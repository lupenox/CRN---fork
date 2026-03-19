import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Layout, Text, Icon, Divider, useTheme } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../navigation/AppHeader';
import Card from '../components/Card';

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const HashIcon   = (props) => <Icon {...props} name="hash-outline" />;
const PinIcon    = (props) => <Icon {...props} name="pin-outline" />;

const SCHD_LABEL = {
  LEC: 'Lecture', LAB: 'Laboratory', SEM: 'Seminar',
  IND: 'Independent Study', DIS: 'Discussion', FLD: 'Field Studies',
};

function getBadgeColors(schedType: string, theme: Record<string, string>) {
  switch (schedType) {
    case 'LEC': return { bg: theme['color-info-100'],    text: theme['color-info-700']    };
    case 'LAB': return { bg: theme['color-warning-100'], text: theme['color-warning-700'] };
    case 'SEM': return { bg: theme['color-success-100'], text: theme['color-success-700'] };
    case 'IND': return { bg: theme['color-basic-200'],   text: theme['color-basic-600']   };
    default:    return { bg: theme['color-primary-100'], text: theme['color-primary-700'] };
  }
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

  const { course } = route.params as { course: any };

  const scheduleLabel = SCHD_LABEL[course.schedule_type] ?? course.schedule_type;
  const { bg, text }  = getBadgeColors(course.schedule_type, theme);

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
          <InfoRow IconComp={HashIcon}   label="CRN"        value={course.crn}        hintColor={hintColor} />
          <InfoRow IconComp={PersonIcon} label="Instructor" value={course.instructor}  hintColor={hintColor} />
          <InfoRow IconComp={PinIcon}    label="Room"       value={course.room}        hintColor={hintColor} />
          <InfoRow IconComp={PinIcon}    label="Campus"     value={course.room ? undefined : course.campus} hintColor={hintColor} />
        </Card>

        {/* Meeting times card */}
        <Card style={styles.card}>
          <Text category="s1" style={styles.sectionLabel}>Meeting Times</Text>
          <Divider style={styles.divider} />
          <MeetingPills times={course.meeting_times} theme={theme} />
        </Card>

      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1 },
  scroll:       { padding: 16, gap: 12, paddingBottom: 40 },
  card:         { width: '100%' },
  titleTopRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badge:        { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  courseCode:   { marginTop: 4, marginBottom: 2 },
  sectionLabel: { marginBottom: 8 },
  divider:      { marginBottom: 12 },
  infoRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  infoIcon:     { width: 18, height: 18, marginTop: 2 },
  addBtn:       { marginTop: 8 },
});
