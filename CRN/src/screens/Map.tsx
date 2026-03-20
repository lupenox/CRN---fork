import { useEffect, useRef, useState } from 'react';
import { Layout, Icon, useTheme } from '@ui-kitten/components';
import { StyleSheet, View, useColorScheme, Animated, ScrollView, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { AppHeader } from '../navigation/AppHeader';
import { mockResources } from '../data/mockData';
import Button from '../components/Button';
import { darkMapStyle } from '../theme/mapStyles';
import * as Location from 'expo-location';
import { useAppTheme } from '../theme/ThemeContext';
const GOOGLE_MAPS_API_KEY = 'AIzaSyAm_mrIr3my6R_QJpdFOiiVGiO_G_86Svc';

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
    startLocation: {
      latitude: s.start_location.lat,
      longitude: s.start_location.lng,
    },
  }));

  return {
    polyline: decodePolyline(data.routes[0].overview_polyline.points),
    steps,
    totalDuration: leg.duration.text,
    totalDistance: leg.distance.text,
  };
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

// Static styles outside component — never rebuilds, prevents marker flashing
const staticStyles = StyleSheet.create({
  layout: { flex: 1, paddingBottom: '5%' },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
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
    top: 16,
    alignSelf: 'center',
    width: 220,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  calloutTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  calloutSubtitle: { fontSize: 12, marginBottom: 10 },
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
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
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
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
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
});

export default function Map({ route }: any) {
  const { resolvedTheme } = useAppTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const theme = useTheme();

  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<{ [key: number]: any }>({});
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);

  const { targetLocation: initialTarget } = route.params ?? {};
  const [activeTarget, setActiveTarget] = useState(initialTarget ?? null);

  const sheetHeight = useRef(new Animated.Value(SHEET_COLLAPSED)).current;

  const tc = {
    floatingCalloutBg:          theme['color-basic-600'],
    calloutTitleColor:          theme['text-basic-color'],
    calloutSubtitleColor:       theme['text-hint-color'],
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
    polylineColor:              theme['color-info-500'],
    navIconFill:                theme['text-control-color'],
    maneuverIconFill:           theme['color-primary-600'],
  };

  function toggleSheet() {
    const toValue = sheetExpanded ? SHEET_COLLAPSED : SHEET_EXPANDED;
    Animated.spring(sheetHeight, { toValue, useNativeDriver: false, friction: 8 }).start();
    setSheetExpanded(!sheetExpanded);
  }

  useEffect(() => {
    async function startTracking() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      subscriptionRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 5000, distanceInterval: 0 },
        (loc) => setLocation(loc)
      );
    }
    startTracking();

    if (activeTarget && mapRef.current) {
      mapRef.current.animateCamera({
        center: { latitude: activeTarget.lat, longitude: activeTarget.lng },
        zoom: 17,
      });
    }

    return () => { subscriptionRef.current?.remove(); };
  }, []);

  useEffect(() => {
    if (activeTarget?.id && markerRefs.current[activeTarget.id]) {
      const timer = setTimeout(() => {
        markerRefs.current[activeTarget.id].showCallout();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [activeTarget?.id]);

  useEffect(() => {
    if (location && activeTarget) {
      setCurrentStepIndex(0);
      fetchRoute(
        { lat: location.coords.latitude, lng: location.coords.longitude },
        { lat: activeTarget.lat, lng: activeTarget.lng }
      ).then((data) => {
        setRouteData(data);
        if (data) {
          Animated.spring(sheetHeight, {
            toValue: SHEET_COLLAPSED,
            useNativeDriver: false,
            friction: 8,
          }).start();
          setSheetExpanded(false);
        }
      }).catch(console.error);
    } else {
      setRouteData(null);
    }
  }, [location?.coords.latitude, location?.coords.longitude, activeTarget?.id]);

  useEffect(() => {
    if (!location || !routeData) return;
    const steps = routeData.steps;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= steps.length) return;

    const distToNext = getDistance(
      { latitude: location.coords.latitude, longitude: location.coords.longitude },
      steps[nextIndex].startLocation
    );

    if (distToNext < 20) {
      setCurrentStepIndex(nextIndex);
    }
  }, [location]);

  function recenterMap() {
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: { latitude: location.coords.latitude, longitude: location.coords.longitude },
      });
    }
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
          onPress={() => setSelectedResource(null)}
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
          {mockResources.map(resource => {
            const isSelected = selectedResource?.id === resource.id;
            const isActive = activeTarget?.id === resource.id;
            const isGold = isSelected || isActive;
            return (
              <Marker
                key={`${resource.id}-${isGold ? 'gold' : 'red'}`}
                ref={(el) => (markerRefs.current[resource.id] = el)}
                coordinate={{ latitude: resource.lat, longitude: resource.lng }}
                onPress={() => setSelectedResource(resource)}
              >
                <View style={[
                  staticStyles.customPin,
                  { backgroundColor: isGold ? tc.pinGoldBg : tc.pinRedBg,
                    borderColor: isGold ? tc.pinGoldBorder : tc.pinRedBorder }
                ]}>
                  <View style={[
                    staticStyles.customPinDot,
                    { backgroundColor: isGold ? tc.pinGoldBorder : tc.pinRedBorder }
                  ]} />
                </View>
              </Marker>
            );
          })}

          {/* Temporary marker for class/non-directory navigation targets */}
          {activeTarget && !mockResources.some(r => r.id === activeTarget.id) && (
            <Marker
              key={`temp-${activeTarget.id}`}
              coordinate={{ latitude: activeTarget.lat, longitude: activeTarget.lng }}
              onPress={() => setSelectedResource({
                id: activeTarget.id,
                lat: activeTarget.lat,
                lng: activeTarget.lng,
                title: activeTarget.title,
                location: '',
              })}
            >
              <View style={[staticStyles.customPin, { backgroundColor: tc.pinGoldBg, borderColor: tc.pinGoldBorder }]}>
                <View style={[staticStyles.customPinDot, { backgroundColor: tc.pinGoldBorder }]} />
              </View>
            </Marker>
          )}

          {/* Route polyline */}
          {routeData && (
            <Polyline
              coordinates={routeData.polyline}
              strokeColor={tc.polylineColor}
              strokeWidth={4}
            />
          )}
        </MapView>

        {/* Floating callout card */}
        {selectedResource && (
          <View style={[staticStyles.floatingCallout, { backgroundColor: tc.floatingCalloutBg }]}>
            <Text style={[staticStyles.calloutTitle, { color: tc.calloutTitleColor }]}>
              {selectedResource.title}
            </Text>
            <Text style={[staticStyles.calloutSubtitle, { color: tc.calloutSubtitleColor }]}>
              {selectedResource.location}
            </Text>
            <TouchableOpacity
              style={[staticStyles.calloutButton, { backgroundColor: tc.calloutButtonBg }]}
              onPress={() => {
                setActiveTarget({
                  id: selectedResource.id,
                  lat: selectedResource.lat,
                  lng: selectedResource.lng,
                  title: selectedResource.title,
                });
                setSelectedResource(null);
              }}
            >
              <Icon name="navigation-2-outline" style={staticStyles.calloutIcon} fill={tc.navIconFill} />
              <Text style={[staticStyles.calloutButtonText, { color: tc.calloutButtonText }]}>Navigate</Text>
            </TouchableOpacity>
          </View>
        )}

        {location && (
          <Button
            style={staticStyles.locateButton}
            accessoryLeft={<Icon name="navigation-2-outline" />}
            onPress={recenterMap}
          />
        )}

        {/* Bottom sheet — only renders when a route is active */}
        {routeData && currentStep && (
          <Animated.View style={[staticStyles.bottomSheet, { height: sheetHeight, backgroundColor: tc.bottomSheetBg }]}>

            <View style={staticStyles.sheetHeader}>
              <View style={staticStyles.stopButtonSpacer} />
              <TouchableOpacity onPress={toggleSheet} style={staticStyles.sheetHandleTouchable}>
                <View style={[staticStyles.handleBar, { backgroundColor: tc.handleBarBg }]} />
              </TouchableOpacity>
              <TouchableOpacity
                style={staticStyles.stopButton}
                onPress={() => {
                  setActiveTarget(null);
                  setRouteData(null);
                  setCurrentStepIndex(0);
                  setSheetExpanded(false);
                }}
              >
                <Icon name="close-circle-outline" style={staticStyles.stopIcon} fill={tc.stopTextColor} />
                <Text style={[staticStyles.stopText, { color: tc.stopTextColor }]}>End</Text>
              </TouchableOpacity>
            </View>

            {/* Current step — always visible */}
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

            {/* Expanded step list */}
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
    </Layout>
  );
}