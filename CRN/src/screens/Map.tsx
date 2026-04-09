import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Layout, Icon, useTheme } from '@ui-kitten/components';
import { StyleSheet, View, Animated, ScrollView, TouchableOpacity, Text, Modal, TextInput, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { AppHeader } from '../navigation/AppHeader';
import { mockResources } from '../data/mockData';
import eventsData from '../../scripts/events_geocoded.json';
import Button from '../components/Button';
import { darkMapStyle } from '../theme/mapStyles';
import * as Location from 'expo-location';
import { useAppTheme } from '../theme/ThemeContext';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAm_mrIr3my6R_QJpdFOiiVGiO_G_86Svc';

// Types
type MapView_t = 'resources' | 'events';
type DateFilter = 'today' | '3days' | 'week';

type EventWithCoords = {
  title: string;
  description: string;
  location: string;
  organizer: string;
  date: string;
  lat: number;
  lng: number;
};

type Step = {
  instruction: string;
  distance: string;
  maneuver: string;
  startLocation: { latitude: number; longitude: number };
};

type RouteData = {
  polyline: { latitude: number; longitude: number }[];
  steps: Step[];
  totalDuration: string;
  totalDistance: string;
};

// Helpers
function stripHtml(html: string): string {
  return html
    .replace(/<div[^>]*>/gi, '. ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function getDistance(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.latitude * Math.PI) / 180) *
    Math.cos((b.latitude * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function decodePolyline(encoded: string): { latitude: number; longitude: number }[] {
  const result: { latitude: number; longitude: number }[] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let shift = 0, val = 0, byte: number;
    do { byte = encoded.charCodeAt(index++) - 63; val |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lat += val & 1 ? ~(val >> 1) : val >> 1;
    shift = 0; val = 0;
    do { byte = encoded.charCodeAt(index++) - 63; val |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lng += val & 1 ? ~(val >> 1) : val >> 1;
    result.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return result;
}

function parseEventDate(dateStr: string): Date {
  const [m, d, y] = dateStr.split('/').map(Number);
  return new Date(y, m - 1, d);
}

function localMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function filterEventsByDate(events: EventWithCoords[], filter: DateFilter): EventWithCoords[] {
  const today = localMidnight(new Date());
  const limits: Record<DateFilter, Date> = {
    today: addDays(today, 1),
    '3days': addDays(today, 3),
    week: addDays(today, 7),
  };
  const end = limits[filter];
  return events.filter((e) => {
    const d = parseEventDate(e.date);
    return d >= today && d < end;
  });
}

// API stuff
async function fetchRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteData | null> {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.routes?.length) return null;
  const leg = data.routes[0].legs[0];
  const steps: Step[] = leg.steps.map((s: any) => ({
    instruction: stripHtml(s.html_instructions),
    distance: s.distance.text,
    maneuver: s.maneuver ?? 'straight',
    startLocation: { latitude: s.start_location.lat, longitude: s.start_location.lng },
  }));
  return {
    polyline: decodePolyline(data.routes[0].overview_polyline.points),
    steps,
    totalDuration: leg.duration.text,
    totalDistance: leg.distance.text,
  };
}

async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results?.length) return null;
  const { lat, lng } = data.results[0].geometry.location;
  return { latitude: lat, longitude: lng };
}

function maneuverToIcon(maneuver: string): string {
  if (maneuver.includes('left')) return 'corner-left-up-outline';
  if (maneuver.includes('right')) return 'corner-right-up-outline';
  if (maneuver.includes('uturn')) return 'flip-2-outline';
  if (maneuver.includes('merge') || maneuver.includes('ramp')) return 'trending-up-outline';
  if (maneuver.includes('roundabout')) return 'refresh-outline';
  return 'arrow-upward-outline';
}

const SHEET_COLLAPSED = 100;
const SHEET_EXPANDED = 360;

// Static styles
const staticStyles = StyleSheet.create({
  layout: { flex: 1, paddingBottom: '5%' },
  mapContainer: { flex: 1 },
  map: { flex: 1 },

  topControlBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewToggleBar: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 8,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 16,
    gap: 5,
  },
  toggleText: { fontSize: 13, fontWeight: '600' },
  toggleIcon: { width: 15, height: 15 },

  dateChipRow: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 8,
  },
  dateChipInline: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  dateChipText: { fontSize: 12, fontWeight: '600' },

  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 8,
  },
  filterBtnIcon: { width: 18, height: 18 },

  filterDropdown: {
    position: 'absolute',
    top: 56,
    right: 12,
    width: 210,
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
  },
  filterDropdownLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterDropdownItem: {
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    marginVertical: 1,
  },
  filterDropdownItemText: { fontSize: 13, fontWeight: '500' },

  locateButton: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    borderRadius: 50,
    width: 52,
    height: 52,
    paddingHorizontal: 0,
  },

  floatingCallout: {
    position: 'absolute',
    alignSelf: 'center',
    width: 240,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  calloutTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  calloutSubtitle: { fontSize: 12, marginBottom: 2 },
  calloutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  calloutButtonText: { fontSize: 13, fontWeight: '600' },
  calloutIcon: { width: 14, height: 14 },

  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 4,
  },
  sheetHandleTouchable: { flex: 1, alignItems: 'center' },
  stopButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4 },
  stopIcon: { width: 18, height: 18 },
  stopText: { fontSize: 12, fontWeight: '600' },
  stopButtonSpacer: { width: 60 },
  handleBar: { width: 36, height: 4, borderRadius: 2 },
  currentStep: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  maneuverIcon: { width: 32, height: 32, marginRight: 12 },
  currentStepText: { flex: 1 },
  instructionText: { fontSize: 15, fontWeight: '600' },
  distanceText: { fontSize: 13, marginTop: 2 },
  etaBadge: { alignItems: 'center', marginLeft: 8, minWidth: 60 },
  etaText: { fontSize: 14, fontWeight: '700' },
  etaSubText: { fontSize: 11 },
  stepList: { marginTop: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1 },
  stepRowActive: { borderRadius: 8, paddingHorizontal: 6 },
  stepIcon: { width: 22, height: 22, marginRight: 10 },
  stepTextContainer: { flex: 1 },
  stepInstruction: { fontSize: 13 },
  stepInstructionActive: { fontWeight: '600' },
  stepDistance: { fontSize: 12, marginTop: 2 },

  customPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customPinDot: { width: 10, height: 10, borderRadius: 5 },

  eventPin: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  eventPinDot: { width: 8, height: 8, borderRadius: 2 },

  noEventsMsg: {
    position: 'absolute',
    top: 64,
    alignSelf: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 5,
  },
  noEventsMsgText: { fontSize: 13, fontWeight: '500' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  modalSubtitle: { fontSize: 13, marginBottom: 14 },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 14,
  },
  modalButtons: { flexDirection: 'row', gap: 8 },
});

export default function Map({ route }: any) {
  const { resolvedTheme } = useAppTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const theme = useTheme();

  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<{ [key: string]: any }>({});
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const markerJustPressedRef = useRef(false);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventWithCoords | null>(null);

  const { targetLocation: initialTarget, mapViewMode: initialViewMode } = route.params ?? {};

  const [mapViewMode, setMapViewMode] = useState<MapView_t>(initialViewMode ?? 'resources');
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [geocodedEvents, setGeocodedEvents] = useState<EventWithCoords[]>([]);
  const [activeTarget, setActiveTarget] = useState(initialTarget ?? null);
  const [organizerFilter, setOrganizerFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [manualStartVisible, setManualStartVisible] = useState(false);
  const [manualStartInput, setManualStartInput] = useState('');
  const [pendingTarget, setPendingTarget] = useState<any>(null);
  const [manualCoords, setManualCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const sheetHeight = useRef(new Animated.Value(SHEET_COLLAPSED)).current;

  const availableOrganizers = useMemo(() => {
    const orgs = filterEventsByDate(geocodedEvents, dateFilter)
      .filter(e => e.lat && e.lng)
      .map(e => e.organizer)
      .filter(Boolean);
    return Array.from(new Set(orgs)).sort();
  }, [geocodedEvents, dateFilter]);

  const availableCategories = useMemo(() => {
    const cats = mockResources.map(r => r.category).filter(Boolean);
    return Array.from(new Set(cats)).sort();
  }, []);

  // Theme colors
  const tc = {
    toggleBg:                   theme['color-basic-700'],
    toggleActiveBg:             theme['color-primary-500'],
    toggleText:                 theme['text-hint-color'],
    toggleActiveText:           theme['text-control-color'],
    chipBg:                     theme['color-basic-700'],
    chipActiveBg:               theme['color-primary-500'],
    chipText:                   theme['text-hint-color'],
    chipActiveText:             theme['text-control-color'],
    floatingCalloutBg:          theme['color-basic-600'],
    calloutTitleColor:          theme['text-basic-color'],
    calloutSubtitleColor:       theme['text-hint-color'],
    calloutDateColor:           theme['color-primary-500'],
    calloutButtonBg:            theme['color-primary-500'],
    calloutButtonText:          theme['text-control-color'],
    bottomSheetBg:              theme['color-basic-700'],
    handleBarBg:                theme['color-basic-400'],
    stepRowActiveBg:            theme['color-basic-400'],
    stepRowBorder:              theme['color-basic-300'],
    instructionColor:           theme['text-basic-color'],
    distanceColor:              theme['color-primary-600'],
    etaColor:                   theme['color-primary-600'],
    etaSubColor:                theme['text-hint-color'],
    stepInstructionColor:       theme['color-basic-400'],
    stepInstructionActiveColor: theme['color-primary-600'],
    stepDistanceColor:          theme['text-hint-color'],
    stopTextColor:              theme['color-danger-500'],
    pinRedBg:                   theme['color-danger-300'],
    pinRedBorder:               theme['color-danger-600'],
    pinGoldBg:                  theme['color-primary-300'],
    pinGoldBorder:              theme['color-primary-600'],
    pinTealBg:                  theme['color-info-300'],
    pinTealBorder:              theme['color-info-600'],
    pinTealActiveBg:            theme['color-primary-300'],
    pinTealActiveBorder:        theme['color-primary-600'],
    polylineColor:              theme['color-info-500'],
    navIconFill:                theme['text-control-color'],
    maneuverIconFill:           theme['color-primary-600'],
    noEventsBg:                 theme['color-basic-600'],
    noEventsText:               theme['text-hint-color'],
  };

  const visibleEvents = filterEventsByDate(geocodedEvents, dateFilter)
    .filter(e => e.lat && e.lng)
    .filter(e => !organizerFilter || e.organizer === organizerFilter);

  const visibleResources = mockResources.filter(r =>
    !categoryFilter || r.category === categoryFilter
  );

  const hasActiveFilter = !!(organizerFilter || categoryFilter);
  const calloutTop = filterDropdownVisible ? 270 : 56;

  useEffect(() => {
    setOrganizerFilter(null);
  }, [dateFilter]);

  useEffect(() => {
    if (geocodedEvents.length > 0) return;
    const withIds = (eventsData as any[]).map((e, i) => ({ ...e, id: `event-${i}` }));
    setGeocodedEvents(withIds);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function startTracking() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 10 },
        (loc) => { if (!isMounted) return; setLocation(loc); },
        (error) => { console.error('Location error:', error); }
      );
      subscriptionRef.current = sub;
    }

    startTracking();

    if (activeTarget && mapRef.current) {
      mapRef.current.animateCamera({
        center: { latitude: activeTarget.lat, longitude: activeTarget.lng },
        zoom: 17,
      });
    }

    return () => {
      isMounted = false;
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (activeTarget?.id && markerRefs.current[activeTarget.id]) {
      const timer = setTimeout(() => {
        markerRefs.current[activeTarget.id]?.showCallout?.();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [activeTarget?.id]);

  useEffect(() => {
    const origin = location
      ? { lat: location.coords.latitude, lng: location.coords.longitude }
      : manualCoords
        ? { lat: manualCoords.latitude, lng: manualCoords.longitude }
        : null;

    if (origin && activeTarget) {
      setCurrentStepIndex(0);
      fetchRoute(origin, { lat: activeTarget.lat, lng: activeTarget.lng })
        .then((data) => {
          setRouteData(data);
          if (data) {
            Animated.spring(sheetHeight, { toValue: SHEET_COLLAPSED, useNativeDriver: false, friction: 8 }).start();
            setSheetExpanded(false);
          }
        }).catch(console.error);
    } else {
      setRouteData(null);
    }
  }, [location?.coords.latitude, location?.coords.longitude, manualCoords?.latitude, manualCoords?.longitude, activeTarget?.id]);

  useEffect(() => {
    if (!location || !routeData) return;
    const steps = routeData.steps;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= steps.length) return;
    const distToNext = getDistance(
      { latitude: location.coords.latitude, longitude: location.coords.longitude },
      steps[nextIndex].startLocation
    );
    if (distToNext < 20) setCurrentStepIndex(nextIndex);
  }, [location]);

  function toggleSheet() {
    const toValue = sheetExpanded ? SHEET_COLLAPSED : SHEET_EXPANDED;
    Animated.spring(sheetHeight, { toValue, useNativeDriver: false, friction: 8 }).start();
    setSheetExpanded(!sheetExpanded);
  }

  function recenterMap() {
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: { latitude: location.coords.latitude, longitude: location.coords.longitude },
      });
    }
  }

  function handleViewToggle(view: MapView_t) {
    setMapViewMode(view);
    setSelectedResource(null);
    setSelectedEvent(null);
    setOrganizerFilter(null);
    setCategoryFilter(null);
    setFilterDropdownVisible(false);
  }

  const defaultLocation = { latitude: 43.0389, longitude: -87.90647 };
  const initialLat = activeTarget?.lat ?? defaultLocation.latitude;
  const initialLng = activeTarget?.lng ?? defaultLocation.longitude;
  const currentStep = routeData?.steps[currentStepIndex];

  return (
    <Layout style={staticStyles.layout}>
      <AppHeader title="Map" />
      <View style={staticStyles.mapContainer}>
        <MapView
          ref={mapRef}
          style={staticStyles.map}
          customMapStyle={isDarkMode ? darkMapStyle : []}
          onPress={() => {
            if (markerJustPressedRef.current) {
              markerJustPressedRef.current = false;
              return;
            }
            setSelectedResource(null);
            setSelectedEvent(null);
            setFilterDropdownVisible(false);
          }}
          initialRegion={{
            latitude: initialLat,
            longitude: initialLng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* User location marker */}
          {location && (
            <Marker
              coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
              title="You"
            />
          )}

          {/* Resource markers */}
          {mapViewMode === 'resources' && visibleResources.map(resource => {
            const isSelected = selectedResource?.id === resource.id;
            const isActive = activeTarget?.id === resource.id;
            const isGold = isSelected || isActive;
            return (
              <Marker
                key={`res-${resource.id}`}
                ref={(el) => (markerRefs.current[resource.id] = el)}
                coordinate={{ latitude: resource.lat, longitude: resource.lng }}
                onPress={() => { markerJustPressedRef.current = true; setSelectedResource(resource); setSelectedEvent(null); setFilterDropdownVisible(false); }}
                tracksViewChanges={isGold}
              >
                <View pointerEvents="none" style={[
                  staticStyles.customPin,
                  { backgroundColor: isGold ? tc.pinGoldBg : tc.pinRedBg,
                    borderColor: isGold ? tc.pinGoldBorder : tc.pinRedBorder }
                ]}>
                  <View style={[staticStyles.customPinDot, { backgroundColor: isGold ? tc.pinGoldBorder : tc.pinRedBorder }]} />
                </View>
              </Marker>
            );
          })}

          {/* Event markers */}
          {mapViewMode === 'events' && visibleEvents.map(event => {
            const isActive = activeTarget?.id === event.id;
            return (
              <Marker
                key={`evt-${event.id}`}
                coordinate={{ latitude: event.lat!, longitude: event.lng! }}
                onPress={() => { markerJustPressedRef.current = true; setSelectedEvent(event); setSelectedResource(null); setFilterDropdownVisible(false); }}
                tracksViewChanges={isActive}
              >
                <View pointerEvents="none" style={[
                  staticStyles.eventPin,
                  {
                    backgroundColor: isActive ? tc.pinTealActiveBg : tc.pinTealBg,
                    borderColor: isActive ? tc.pinTealActiveBorder : tc.pinTealBorder,
                  }
                ]}>
                  <View style={[staticStyles.eventPinDot, { backgroundColor: isActive ? tc.pinTealActiveBorder : tc.pinTealBorder }]} />
                </View>
              </Marker>
            );
          })}

          {/* Temporary marker */}
          {activeTarget && !visibleResources.some((r: any) => r.id === activeTarget.id) && !geocodedEvents.some(e => e.id === activeTarget.id) && (
            <Marker
              key={`temp-${activeTarget.id}`}
              coordinate={{ latitude: activeTarget.lat, longitude: activeTarget.lng }}
              onPress={() => { markerJustPressedRef.current = true; setSelectedResource({ id: activeTarget.id, lat: activeTarget.lat, lng: activeTarget.lng, title: activeTarget.title, location: '' }); }}
            >
              <View pointerEvents="none" style={[staticStyles.customPin, { backgroundColor: tc.pinGoldBg, borderColor: tc.pinGoldBorder }]}>
                <View style={[staticStyles.customPinDot, { backgroundColor: tc.pinGoldBorder }]} />
              </View>
            </Marker>
          )}

          {/* Route polyline */}
          {routeData && (
            <Polyline coordinates={routeData.polyline} strokeColor={tc.polylineColor} strokeWidth={4} />
          )}
        </MapView>

        {/* ── Top control bar ── */}
        <View style={staticStyles.topControlBar}>

          {/* View toggle */}
          <View style={[staticStyles.viewToggleBar, { backgroundColor: tc.toggleBg }]}>
            {(['resources', 'events'] as MapView_t[]).map((view) => {
              const active = mapViewMode === view;
              return (
                <TouchableOpacity
                  key={view}
                  style={[staticStyles.toggleButton, active && { backgroundColor: tc.toggleActiveBg }]}
                  onPress={() => handleViewToggle(view)}
                >
                  <Icon
                    name={view === 'resources' ? 'pin-outline' : 'calendar-outline'}
                    style={staticStyles.toggleIcon}
                    fill={active ? tc.toggleActiveText : tc.toggleText}
                  />
                  <Text style={[staticStyles.toggleText, { color: active ? tc.toggleActiveText : tc.toggleText }]}>
                    {view === 'resources' ? 'Resources' : 'Events'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Date chips — events only */}
          {mapViewMode === 'events' && (
            <View style={[staticStyles.dateChipRow, { backgroundColor: tc.toggleBg }]}>
              {([
                { key: 'today', label: 'Today' },
                { key: '3days', label: '3D' },
                { key: 'week', label: 'Week' },
              ] as { key: DateFilter; label: string }[]).map(({ key, label }) => {
                const active = dateFilter === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[staticStyles.dateChipInline, active && { backgroundColor: tc.chipActiveBg }]}
                    onPress={() => setDateFilter(key)}
                  >
                    <Text style={[staticStyles.dateChipText, { color: active ? tc.chipActiveText : tc.chipText }]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Filter button */}
          <TouchableOpacity
            style={[staticStyles.filterBtn, {
              backgroundColor: hasActiveFilter ? tc.chipActiveBg : tc.toggleBg,
            }]}
            onPress={() => setFilterDropdownVisible(v => !v)}
          >
            <Icon
              name="options-2-outline"
              style={staticStyles.filterBtnIcon}
              fill={hasActiveFilter ? tc.chipActiveText : tc.toggleText}
            />
          </TouchableOpacity>

        </View>

        {/* Filter dropdown */}
        {filterDropdownVisible && (
          <View style={[staticStyles.filterDropdown, { backgroundColor: tc.toggleBg }]}>
            <Text style={[staticStyles.filterDropdownLabel, { color: tc.chipText }]}>
              {mapViewMode === 'events' ? 'Organizer' : 'Category'}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200 }}>

              <TouchableOpacity
                style={[staticStyles.filterDropdownItem, {
                  backgroundColor: !hasActiveFilter ? tc.chipActiveBg : 'transparent',
                }]}
                onPress={() => {
                  setOrganizerFilter(null);
                  setCategoryFilter(null);
                  setFilterDropdownVisible(false);
                }}
              >
                <Text style={[staticStyles.filterDropdownItemText, {
                  color: !hasActiveFilter ? tc.chipActiveText : tc.toggleText,
                }]}>All</Text>
              </TouchableOpacity>

              {/* Organizer or category items */}
              {mapViewMode === 'events'
                ? availableOrganizers.map((org) => (
                  <TouchableOpacity
                    key={org}
                    style={[staticStyles.filterDropdownItem, {
                      backgroundColor: organizerFilter === org ? tc.chipActiveBg : 'transparent',
                    }]}
                    onPress={() => {
                      setOrganizerFilter(organizerFilter === org ? null : org);
                      setFilterDropdownVisible(false);
                    }}
                  >
                    <Text style={[staticStyles.filterDropdownItemText, {
                      color: organizerFilter === org ? tc.chipActiveText : tc.toggleText,
                    }]}>{org}</Text>
                  </TouchableOpacity>
                ))
                : availableCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[staticStyles.filterDropdownItem, {
                      backgroundColor: categoryFilter === cat ? tc.chipActiveBg : 'transparent',
                    }]}
                    onPress={() => {
                      setCategoryFilter(categoryFilter === cat ? null : cat);
                      setFilterDropdownVisible(false);
                    }}
                  >
                    <Text style={[staticStyles.filterDropdownItemText, {
                      color: categoryFilter === cat ? tc.chipActiveText : tc.toggleText,
                    }]}>{cat}</Text>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
          </View>
        )}

        {/* Floating callout — resource */}
        {selectedResource && (
          <View style={[staticStyles.floatingCallout, { backgroundColor: tc.floatingCalloutBg, top: calloutTop }]}>
            <Text style={[staticStyles.calloutTitle, { color: tc.calloutTitleColor }]} numberOfLines={2}>
              {selectedResource.title}
            </Text>
            <Text style={[staticStyles.calloutSubtitle, { color: tc.calloutSubtitleColor }]} numberOfLines={1}>
              {selectedResource.location}
            </Text>
            <TouchableOpacity
              style={[staticStyles.calloutButton, { backgroundColor: tc.calloutButtonBg }]}
              onPress={() => {
                const target = { id: selectedResource.id, lat: selectedResource.lat, lng: selectedResource.lng, title: selectedResource.title };
                if (!location) {
                  setPendingTarget(target);
                  setManualStartInput('');
                  setManualStartVisible(true);
                } else {
                  setActiveTarget(target);
                  setSelectedResource(null);
                }
              }}
            >
              <Icon name="navigation-2-outline" style={staticStyles.calloutIcon} fill={tc.navIconFill} />
              <Text style={[staticStyles.calloutButtonText, { color: tc.calloutButtonText }]}>Navigate</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Floating callout — event */}
        {selectedEvent && (
          <View style={[staticStyles.floatingCallout, { backgroundColor: tc.floatingCalloutBg, top: calloutTop }]}>
            <Text style={[staticStyles.calloutTitle, { color: tc.calloutTitleColor }]} numberOfLines={2}>
              {selectedEvent.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 }}>
              <Icon name="calendar-outline" style={staticStyles.calloutIcon} fill={tc.calloutDateColor} />
              <Text style={{ color: tc.calloutDateColor, fontSize: 12 }}>
                {selectedEvent.date}
              </Text>
            </View>
            <Text style={[staticStyles.calloutSubtitle, { color: tc.calloutSubtitleColor }]} numberOfLines={2}>
              {selectedEvent.location}
            </Text>
            <TouchableOpacity
              style={[staticStyles.calloutButton, { backgroundColor: tc.calloutButtonBg }]}
              onPress={() => {
                const target = { id: selectedEvent.id, lat: selectedEvent.lat, lng: selectedEvent.lng, title: selectedEvent.title };
                if (!location) {
                  setPendingTarget(target);
                  setManualStartInput('');
                  setManualStartVisible(true);
                } else {
                  setActiveTarget(target);
                  setSelectedEvent(null);
                }
              }}
            >
              <Icon name="navigation-2-outline" style={staticStyles.calloutIcon} fill={tc.navIconFill} />
              <Text style={[staticStyles.calloutButtonText, { color: tc.calloutButtonText }]}>Navigate</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* No events message */}
        {mapViewMode === 'events' && visibleEvents.length === 0 && geocodedEvents.length > 0 && (
          <View style={[staticStyles.noEventsMsg, { backgroundColor: tc.noEventsBg }]}>
            <Text style={[staticStyles.noEventsMsgText, { color: tc.noEventsText }]}>
              No events in this window
            </Text>
          </View>
        )}

        {location && (
          <Button
            style={staticStyles.locateButton}
            accessoryLeft={<Icon name="navigation-2-outline" />}
            onPress={recenterMap}
          />
        )}

        {/* Navigation bottom sheet */}
        {routeData && currentStep && (
          <Animated.View style={[staticStyles.bottomSheet, { height: sheetHeight, backgroundColor: tc.bottomSheetBg }]}>
            <TouchableOpacity onPress={toggleSheet} style={staticStyles.sheetHeader} activeOpacity={1}>
              <View style={staticStyles.stopButtonSpacer} />
              <View style={staticStyles.sheetHandleTouchable}>
                <View style={[staticStyles.handleBar, { backgroundColor: tc.handleBarBg }]} />
              </View>
              <TouchableOpacity
                style={staticStyles.stopButton}
                onPress={() => {
                  setActiveTarget(null);
                  setRouteData(null);
                  setCurrentStepIndex(0);
                  setSheetExpanded(false);
                  setManualCoords(null);
                }}
              >
                <Icon name="close-circle-outline" style={staticStyles.stopIcon} fill={tc.stopTextColor} />
                <Text style={[staticStyles.stopText, { color: tc.stopTextColor }]}>End</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <View style={staticStyles.currentStep}>
              <Icon
                name={maneuverToIcon(currentStep.maneuver)}
                style={staticStyles.maneuverIcon}
                fill={tc.maneuverIconFill}
              />
              <View style={staticStyles.currentStepText}>
                <Text style={[staticStyles.instructionText, { color: tc.instructionColor }]} numberOfLines={2}>
                  {currentStepIndex === routeData.steps.length - 1
                    ? currentStep.instruction
                    : currentStepIndex > 0
                      ? `In ${routeData.steps[currentStepIndex - 1].distance}, ${currentStep.instruction}`
                      : currentStep.instruction}
                </Text>
                <Text style={[staticStyles.distanceText, { color: tc.distanceColor }]}>
                  {currentStep.distance}
                </Text>
              </View>
              <View style={staticStyles.etaBadge}>
                <Text style={[staticStyles.etaText, { color: tc.etaColor }]}>{routeData.totalDuration}</Text>
                <Text style={[staticStyles.etaSubText, { color: tc.etaSubColor }]}>{routeData.totalDistance}</Text>
              </View>
            </View>

            {sheetExpanded && (
              <ScrollView style={staticStyles.stepList} showsVerticalScrollIndicator={false}>
                {routeData.steps.map((step, index) => (
                  <View
                    key={index}
                    style={[
                      staticStyles.stepRow,
                      { borderTopColor: tc.stepRowBorder },
                      index === currentStepIndex && [staticStyles.stepRowActive, { backgroundColor: tc.stepRowActiveBg }],
                    ]}
                  >
                    <Icon
                      name={maneuverToIcon(step.maneuver)}
                      style={staticStyles.stepIcon}
                      fill={index === currentStepIndex ? tc.maneuverIconFill : tc.etaSubColor}
                    />
                    <View style={staticStyles.stepTextContainer}>
                      <Text
                        style={[
                          staticStyles.stepInstruction,
                          { color: tc.stepInstructionColor },
                          index === currentStepIndex && [staticStyles.stepInstructionActive, { color: tc.stepInstructionActiveColor }],
                        ]}
                        numberOfLines={2}
                      >
                        {index === routeData.steps.length - 1
                          ? step.instruction
                          : index > 0
                            ? `In ${routeData.steps[index - 1].distance}, ${step.instruction}`
                            : step.instruction}
                      </Text>
                      <Text style={[staticStyles.stepDistance, { color: tc.stepDistanceColor }]}>
                        {step.distance}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </Animated.View>
        )}
      </View>

      {/* Manual start location modal */}
      <Modal
        visible={manualStartVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setManualStartVisible(false)}
      >
        <View style={staticStyles.modalOverlay}>
          <View style={[staticStyles.modalCard, { backgroundColor: tc.floatingCalloutBg }]}>
            <Text style={[staticStyles.modalTitle, { color: tc.calloutTitleColor }]}>Enter Starting Location</Text>
            <Text style={[staticStyles.modalSubtitle, { color: tc.calloutSubtitleColor }]}>
              Location access is unavailable. Enter your starting address to navigate.
            </Text>
            <TextInput
              style={[staticStyles.modalInput, { color: tc.calloutTitleColor, borderColor: tc.handleBarBg }]}
              placeholder="e.g. 3200 N Cramer St, Milwaukee"
              placeholderTextColor={tc.calloutSubtitleColor}
              value={manualStartInput}
              onChangeText={setManualStartInput}
              autoFocus
            />
            <View style={staticStyles.modalButtons}>
              <TouchableOpacity
                style={[staticStyles.calloutButton, { flex: 1 }]}
                onPress={() => setManualStartVisible(false)}
              >
                <Text style={{ color: tc.calloutSubtitleColor }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[staticStyles.calloutButton, { flex: 1, backgroundColor: tc.calloutButtonBg }]}
                onPress={async () => {
                  if (!manualStartInput.trim()) return;
                  const coords = await geocodeAddress(manualStartInput.trim());
                  if (!coords) {
                    Alert.alert('Location Not Found', 'Could not find that address. Please try again.');
                    return;
                  }
                  setManualCoords(coords);
                  setActiveTarget(pendingTarget);
                  setSelectedResource(null);
                  setSelectedEvent(null);
                  setManualStartVisible(false);
                }}
              >
                <Text style={[staticStyles.calloutButtonText, { color: tc.calloutButtonText }]}>Go</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Layout>
  );
}