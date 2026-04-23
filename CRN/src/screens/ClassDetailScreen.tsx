import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Layout, Text, Icon, Divider, useTheme } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../navigation/AppHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import { useEnrolledClasses } from '../context/EnrolledClassesContext';

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const HashIcon   = (props) => <Icon {...props} name="hash-outline" />;
const PinIcon    = (props) => <Icon {...props} name="pin-outline" />;
const NavIcon    = (props) => <Icon {...props} name="navigation-2-outline" />;

const GOOGLE_MAPS_API_KEY = 'AIzaSyAm_mrIr3my6R_QJpdFOiiVGiO_G_86Svc';

const DAY_MAP: Record<string, string> = {
  M: 'Monday',
  T: 'Tuesday',
  W: 'Wednesday',
  R: 'Thursday',
  F: 'Friday',
  S: 'Saturday',
  U: 'Sunday',
};

const SCHD_LABEL: Record<string, string> = {
  LEC: 'Lecture',
  LAB: 'Laboratory',
  SEM: 'Seminar',
  IND: 'Independent Study',
  DIS: 'Discussion',
  FLD: 'Field Studies',
};

function deriveScheduleType(section: string): string {
  const num = parseInt(section, 10);
  if (isNaN(num)) return 'LEC';
  return num >= 600 ? 'LAB' : 'LEC';
}

function parseMeetingTimes(meets: string): { day: string; start_time: string; end_time: string }[] {
  if (!meets || meets.trim() === '' || meets === 'No Meeting Pattern') return [];

  const match = meets.trim().match(/^([A-Za-z]+)\s+([\d:]+)-([\d:]+)([aApP]?)$/);
  if (!match) return [];

  const [, dayStr, rawStart, rawEnd, ampm] = match;

  const suffix = ampm.toLowerCase() === 'p' ? 'pm' : 'am';

  function normalizeTime(t: string, forceSuffix: string): string {
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const mins = m ?? '00';
    return `${hour}:${mins} ${forceSuffix}`;
  }

  const endHour = parseInt(rawEnd.split(':')[0], 10);
  const startHour = parseInt(rawStart.split(':')[0], 10);
  const startSuffix = suffix === 'pm' && startHour > endHour ? 'am' : suffix;

  const start_time = normalizeTime(rawStart, startSuffix);
  const end_time   = normalizeTime(rawEnd, suffix);

  const result: { day: string; start_time: string; end_time: string }[] = [];
  for (const letter of dayStr.toUpperCase()) {
    const day = DAY_MAP[letter];
    if (day) result.push({ day, start_time, end_time });
  }
  return result;
}

function getBadgeColors(schedType: string, theme: Record<string, string>) {
  switch (schedType) {
    case 'LEC': return { bg: theme['color-info-100'],    text: theme['color-info-700']    };
    case 'LAB': return { bg: theme['color-warning-100'], text: theme['color-warning-700'] };
    case 'SEM': return { bg: theme['color-success-100'], text: theme['color-success-700'] };
    case 'IND': return { bg: theme['color-basic-200'],   text: theme['color-basic-600']   };
    default:    return { bg: theme['color-primary-100'], text: theme['color-primary-700'] };
  }
}

async function geocodeRoom(roomString: string): Promise<{ lat: number; lng: number } | null> {
  const query = `${roomString}, University of Wisconsin-Milwaukee`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK' || !data.results?.length) return null;
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

function InfoRow({ IconComp, label, value, hintColor }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <IconComp style={styles.infoIcon} fill={hintColor} />
      <View>
        <Text category="c1" appearance="hint">{label}</Text>
        <Text category="s2">{value}</Text>
      </View>
    </View>
  );
}

function MeetingPills({ times, theme }) {
  if (!times?.length) return (
    <Text category="p2" appearance="hint">No scheduled meeting pattern</Text>
  );
  return (
    <View style={{ gap: 8 }}>
      {times.map((t, i) => (
        <Card key={i} style={{ borderRadius: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text category="s2" style={{ color: theme['color-primary-600'] }}>{t.day}</Text>
            <Text category="p2">{t.start_time} – {t.end_time}</Text>
          </View>
        </Card>
      ))}
    </View>
  );
}

export default function ClassDetailScreen() {
  const navigation = useNavigation();
  const route      = useRoute();
  const theme      = useTheme();
  const hintColor  = theme['text-hint-color'];

  const raw = (route.params as { course: any }).course;
  const course = {
    ...raw,
    schedule_type: deriveScheduleType(raw.section),
    meeting_times: parseMeetingTimes(raw.meets),
  };

  const { addClass, removeClass, isEnrolled } = useEnrolledClasses();
  const enrolled      = isEnrolled(course.crn);
  const scheduleLabel = SCHD_LABEL[course.schedule_type] ?? course.schedule_type;
  const { bg, text }  = getBadgeColors(course.schedule_type, theme);

  const locationString = (course.room || course.campus)?.toLowerCase().includes('online')
    ? null
    : course.room || course.campus;

  const [geocodedLocation, setGeocodedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geocodeLoading, setGeocodeLoading]     = useState(false);
  const [geocodeFailed, setGeocodeFailed]       = useState(false);

  useEffect(() => {
    if (!locationString) return;
    setGeocodeLoading(true);
    setGeocodeFailed(false);
    geocodeRoom(locationString)
      .then((coords) => coords ? setGeocodedLocation(coords) : setGeocodeFailed(true))
      .catch(() => setGeocodeFailed(true))
      .finally(() => setGeocodeLoading(false));
  }, [locationString]);

  return (
    <Layout level="2" style={styles.root}>
      <AppHeader title="Section Detail" showBack={true} />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Title card */}
        <Card style={styles.card}>
          <View style={styles.titleTopRow}>
            <View style={[styles.badge, { backgroundColor: bg }]}>
              <Text category="c2" style={{ color: text }}>{scheduleLabel}</Text>
            </View>
            <Text category="c1" appearance="hint">Section {course.section}</Text>
          </View>
          <Text category="h5" style={styles.courseCode}>{course.course_code}</Text>
          <Text category="s1">{course.title}</Text>
        </Card>

        {/* Info card */}
        <Card style={styles.card}>
          <Text category="s1" style={styles.sectionLabel}>Course Info</Text>
          <Divider style={styles.divider} />
          <InfoRow IconComp={HashIcon}   label="CRN"        value={course.crn}       hintColor={hintColor} />
          <InfoRow IconComp={PersonIcon} label="Instructor" value={course.instructor} hintColor={hintColor} />
          <InfoRow IconComp={PinIcon}    label="Room"       value={course.room}       hintColor={hintColor} />
          <InfoRow IconComp={PinIcon}    label="Campus"     value={course.room ? undefined : course.campus} hintColor={hintColor} />

          {locationString && (
            <View style={styles.navigateRow}>
              {geocodeLoading ? (
                <View style={styles.geocodeStatus}>
                  <ActivityIndicator size="small" color={theme['color-primary-500']} />
                  <Text category="c1" appearance="hint" style={styles.geocodeStatusText}>Finding location…</Text>
                </View>
              ) : geocodeFailed ? (
                <View style={styles.geocodeStatus}>
                  <Icon name="alert-circle-outline" style={styles.geocodeStatusIcon} fill={hintColor} />
                  <Text category="c1" appearance="hint" style={styles.geocodeStatusText}>Location not found</Text>
                </View>
              ) : geocodedLocation ? (
                <Button
                  style={styles.navigateButton}
                  accessoryLeft={NavIcon}
                  onPress={() => navigation.navigate('Map', {
                    targetLocation: {
                      id: `class-${course.crn}`,
                      lat: geocodedLocation.lat,
                      lng: geocodedLocation.lng,
                      title: locationString,
                    }
                  })}
                >
                  Navigate to {locationString}
                </Button>
              ) : null}
            </View>
          )}
        </Card>

        {/* Meeting times card */}
        <Card style={styles.card}>
          <Text category="s1" style={styles.sectionLabel}>Meeting Times</Text>
          <Divider style={styles.divider} />
          <MeetingPills times={course.meeting_times} theme={theme} />
        </Card>

        <Button
          style={styles.addBtn}
          status={enrolled ? 'danger' : 'primary'}
          onPress={() => enrolled ? removeClass(course.crn) : addClass(course)}
        >
          {enrolled ? 'Remove Class' : 'Add Class'}
        </Button>

      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  root:              { flex: 1 },
  scroll:            { padding: 16, gap: 12, paddingBottom: 40 },
  card:              { width: '100%' },
  titleTopRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badge:             { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  courseCode:        { marginTop: 4, marginBottom: 2 },
  sectionLabel:      { marginBottom: 8 },
  divider:           { marginBottom: 12 },
  infoRow:           { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  infoIcon:          { width: 18, height: 18, marginTop: 2 },
  addBtn:            { marginTop: 8 },
  navigateRow:       { marginTop: 4 },
  navigateButton:    { width: '100%' },
  geocodeStatus:     { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
  geocodeStatusIcon: { width: 16, height: 16 },
  geocodeStatusText: { fontSize: 12 },
});