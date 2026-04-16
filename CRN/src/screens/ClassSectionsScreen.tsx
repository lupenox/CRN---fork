import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Layout, Text, Icon, Divider, useTheme } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../navigation/AppHeader';
import Card from '../components/Card';
import { useEnrolledClasses } from '../context/EnrolledClassesContext';

const ClockIcon   = (props) => <Icon {...props} name="clock-outline" />;
const PersonIcon  = (props) => <Icon {...props} name="person-outline" />;
const PinIcon     = (props) => <Icon {...props} name="pin-outline" />;
const ChevronIcon = (props) => <Icon {...props} name="chevron-right-outline" />;

const SCHD_LABEL = {
  LEC: 'Lecture', LAB: 'Lab', SEM: 'Seminar',
  IND: 'Independent Study', DIS: 'Discussion',
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

function SectionCard({ section, onPress, theme }) {
  const hintColor    = theme['text-hint-color'];
  const hasTime      = section.meets && section.meets !== 'No Meeting Pattern';
  const { bg, text } = getBadgeColors(section.schedule_type, theme);
  const { isEnrolled } = useEnrolledClasses();

  return (
    <Card style={styles.card} onPress={() => onPress(section)}>
      <View style={styles.cardRow}>
        <View style={styles.cardBody}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: bg }]}>
              <Text category="c2" style={{ color: text }}>
                {SCHD_LABEL[section.schedule_type] ?? section.schedule_type}
              </Text>
            </View>
            <Text category="c1" appearance="hint">Section {section.section}</Text>
            <Text category="c1" appearance="hint">CRN: {section.crn}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.metaRow}>
            <PersonIcon style={styles.metaIcon} fill={hintColor} />
            <Text category="c1" appearance="hint">{section.instructor || 'TBA'}</Text>
          </View>
          {hasTime && (
            <View style={styles.metaRow}>
              <ClockIcon style={styles.metaIcon} fill={hintColor} />
              <Text category="c1" appearance="hint">{section.meets}</Text>
            </View>
          )}
          {(section.room || section.campus) ? (
            <View style={styles.metaRow}>
              <PinIcon style={styles.metaIcon} fill={hintColor} />
              <Text category="c1" appearance="hint">
                {section.room ? section.room : section.campus}
              </Text>
            </View>
          ) : null}
        </View>

        {isEnrolled(section.crn)
          ? <Icon name="checkmark-circle-2-outline" style={styles.checkIcon} fill={theme['color-success-500']} />
          : <ChevronIcon style={styles.chevron} fill={hintColor} />
        }
      </View>
    </Card>
  );
}

export default function ClassSectionsScreen() {
  const navigation = useNavigation();
  const route      = useRoute();
  const theme      = useTheme();
  const { group }  = route.params as { group: any };

  const lectures = group.sections.filter(s => s.schedule_type === 'LEC');
  const others   = group.sections.filter(s => s.schedule_type !== 'LEC');

  const renderHeader = (label: string, count: number) => (
    <View style={styles.groupHeader}>
      <Text category="label" appearance="hint">{label.toUpperCase()}</Text>
      <Text category="c1" appearance="hint">{count} section{count !== 1 ? 's' : ''}</Text>
    </View>
  );

  return (
    <Layout level="2" style={styles.root}>
      <AppHeader title={group.course_code} showBack={true} />

      <Layout level="1" style={styles.subtitle}>
        <Text category="p1">{group.title}</Text>
        <Text category="c1" appearance="hint">{group.sections.length} total sections</Text>
      </Layout>

      <FlatList
        data={[
          ...(lectures.length ? [{ _header: 'Lectures', _count: lectures.length }, ...lectures] : []),
          ...(others.length   ? [{ _header: 'Labs & Other', _count: others.length }, ...others] : []),
        ]}
        keyExtractor={(item, i) => item._header ? `header-${i}` : item.crn}
        renderItem={({ item }) =>
          item._header
            ? renderHeader(item._header, item._count)
            : <SectionCard
                section={item}
                theme={theme}
                onPress={(section) => navigation.navigate('ClassDetail', { course: section })}
              />
        }
        contentContainerStyle={styles.listContent}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1 },
  subtitle:    { paddingHorizontal: 16, paddingVertical: 10 },
  listContent: { padding: 16, gap: 8 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 2 },
  card:        { width: '100%' },
  cardRow:     { flexDirection: 'row', alignItems: 'center' },
  cardBody:    { flex: 1 },
  badgeRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  badge:       { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  divider:     { marginVertical: 8 },
  metaRow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  metaIcon:    { width: 14, height: 14 },
  chevron:     { width: 20, height: 20, marginLeft: 8 },
  checkIcon:   { width: 22, height: 22, marginLeft: 8 },
});
