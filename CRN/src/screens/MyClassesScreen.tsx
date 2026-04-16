import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Layout, Text, Icon, Divider, useTheme } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../navigation/AppHeader';
import Button from '../components/Button';
import { useEnrolledClasses } from '../context/EnrolledClassesContext';

const PlusIcon = (props) => <Icon {...props} name="plus-outline" />;
const BookIcon = (props) => <Icon {...props} name="book-open-outline" />;

function getMeetingSummary(section: any): string {
  if (section.meeting_times?.length) {
    const first = section.meeting_times[0];
    return `${first.day} ${first.start_time}–${first.end_time}`;
  }
  if (section.meets && section.meets !== 'No Meeting Pattern') return section.meets;
  return 'No meeting pattern';
}

function ClassRow({ section, onPress, theme }) {
  const tc = {
    text:    theme['text-basic-color'],
    hint:    theme['text-hint-color'],
    border:  theme['color-basic-400'],
    warning: theme['color-warning-500'],
  };

  const location = section.room ?? section.campus ?? null;

  return (
    <TouchableOpacity
      style={[styles.row, { borderColor: tc.border }]}
      onPress={() => onPress(section)}
      activeOpacity={0.7}
    >
      <View style={[styles.accent, { backgroundColor: tc.warning }]} />
      <View style={styles.rowBody}>
        <Text style={[styles.courseCode, { color: tc.text }]} numberOfLines={1}>
          {section.course_code} — {section.title}
        </Text>

        <View style={styles.metaRow}>
          <Icon name="pin-outline" style={styles.metaIcon} fill={tc.hint} />
          <Text style={[styles.metaMeta, { color: tc.hint }]} numberOfLines={1}>
            {location ?? 'Location TBA'}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Icon name="clock-outline" style={styles.metaIcon} fill={tc.hint} />
          <Text style={[styles.metaMeta, { color: tc.hint }]} numberOfLines={1}>
            {getMeetingSummary(section)}
          </Text>
        </View>
      </View>
      <Icon name="chevron-right-outline" style={styles.chevron} fill={tc.border} />
    </TouchableOpacity>
  );
}

export default function MyClassesScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { enrolledClasses } = useEnrolledClasses();

  return (
    <Layout level="2" style={styles.root}>
      <AppHeader
        title="My Classes"
        accessoryRight={() => (
          <Button
            appearance="ghost"
            status="primary"
            accessoryLeft={PlusIcon}
            onPress={() => navigation.navigate('ClassSearch')}
          />
        )}
      />

      {enrolledClasses.length === 0 ? (
        <View style={styles.emptyState}>
          <BookIcon style={styles.emptyIcon} fill={theme['text-hint-color']} />
          <Text category="s1" appearance="hint">No classes added yet</Text>
          <Text category="c1" appearance="hint" style={{ marginTop: 4, marginBottom: 20 }}>
            Tap + to search and add classes
          </Text>
          <Button accessoryLeft={PlusIcon} onPress={() => navigation.navigate('ClassSearch')}>
            Browse Classes
          </Button>
        </View>
      ) : (
        <FlatList
          data={enrolledClasses}
          keyExtractor={(item) => item.crn}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <ClassRow
              section={item}
              theme={theme}
              onPress={(section) => navigation.navigate('ClassDetail', { course: section })}
            />
          )}
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  list:       { padding: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon:  { width: 56, height: 56, marginBottom: 12 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  accent:     { width: 4, alignSelf: 'stretch', backgroundColor: 'orange' },
  rowBody:    { flex: 1, padding: 12, gap: 4 },
  courseCode: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  metaRow:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaIcon:   { width: 13, height: 13 },
  metaMeta:   { fontSize: 12, flex: 1 },
  chevron:    { width: 18, height: 18, marginRight: 10 },
});