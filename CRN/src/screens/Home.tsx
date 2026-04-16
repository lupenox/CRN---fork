import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Layout, Text, Icon, useTheme } from '@ui-kitten/components';
import { AppHeader } from '../navigation/AppHeader';
import { mockResources } from '../data/mockData';
import eventsData from '../../scripts/events_geocoded.json';
import { useRecentlySearched } from '../context/RecentlySearchedContext';
import { useEnrolledClasses } from '../context/EnrolledClassesContext';

type Event = {
  id: string;
  title: string;
  location: string;
  organizer: string;
  date: string;
  lat?: number;
  lng?: number;
};

function parseEventDate(dateStr: string): Date {
  const [m, d, y] = dateStr.split('/').map(Number);
  return new Date(y, m - 1, d);
}

function localMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatShortDate(dateStr: string): string {
  return parseEventDate(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
}

const allEvents: Event[] = (eventsData as any[]).map((e, i) => ({
  ...e,
  id: `event-${i}`,
}));

function getTodaysEvents(): Event[] {
  const today = localMidnight(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return allEvents.filter((e) => {
    const d = parseEventDate(e.date);
    return d >= today && d < tomorrow;
  });
}

// Home Screen
export default function Home({ navigation }: any) {
  const theme = useTheme();
  const todayEvents = useMemo(() => getTodaysEvents(), []);
  const displayedEvents = todayEvents.slice(0, 3);
  const { recentSearches, clearRecentSearches  } = useRecentlySearched();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const { enrolledClasses } = useEnrolledClasses();
  const tc = {
    bg:          theme['color-basic-800'],
    surface:     theme['color-basic-700'],
    surfaceDeep: theme['color-basic-600'],
    border:      theme['color-basic-500'],
    text:        theme['text-basic-color'],
    hint:        theme['text-hint-color'],
    primary:     theme['color-primary-500'],
    primaryDim:  theme['color-primary-300'],
    info:        theme['color-info-500'],
    infoDim:     theme['color-info-300'],
    success:     theme['color-success-500'],
    warning:     theme['color-warning-500'],
    danger:      theme['color-danger-500'],
  };

  const SECTION_ICONS: Record<string, string> = {
    Events:    'calendar-outline',
    Classes:   'award-outline',
    Directory: 'book-outline',
  };
  const SECTION_COLORS: Record<string, string> = {
    Events:    tc.primary,
    Classes:   tc.warning,
    Directory: tc.success,
  };

  const SECTION_NAV: Record<string, string> = {
    Events:    'Events',
    Classes:   'ClassSearch',
    Directory: 'Directory',
  };

  return (
    <Layout style={[styles.root, { backgroundColor: tc.bg }]}>
      <AppHeader title="Campus Resource Navigator" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <Text style={[styles.appName, { color: tc.hint }]}>{greeting}</Text>
        </View>

        {/* Quick nav tiles row */}
        <View style={styles.quickRow}>
          <QuickTile
            icon="award-outline"
            label="Classes"
            color={tc.warning}
            bg={tc.surface}
            border={tc.border}
            onPress={() => navigation.navigate('Classes')}
          />
          <QuickTile
            icon="calendar-outline"
            label="Events"
            color={tc.primary}
            bg={tc.surface}
            border={tc.border}
            onPress={() => navigation.navigate('Events')}
          />
          <QuickTile
            icon="book-outline"
            label="Directory"
            color={tc.success}
            bg={tc.surface}
            border={tc.border}
            onPress={() => navigation.navigate('Directory')}
          />
          <QuickTile
            icon="map-outline"
            label="Map"
            color={tc.info}
            bg={tc.surface}
            border={tc.border}
            onPress={() => navigation.navigate('Map')}
          />
        </View>

        {/* My Classes tile */}
        <SectionTile
          icon="award-outline"
          iconColor={tc.warning}
          title="My Classes"
          subtitle="Your enrolled courses"
          actionLabel="View Classes"
          onAction={() => navigation.navigate('Classes')}
          tc={tc}
        >
          {enrolledClasses.length === 0 ? (
            <View style={[styles.emptySlot, { borderColor: tc.border }]}>
              <Icon name="plus-outline" style={styles.emptySlotIcon} fill={tc.hint} />
              <Text style={[styles.emptySlotText, { color: tc.hint }]}>
                Add classes to see them here
              </Text>
            </View>
          ) : (
            enrolledClasses.slice(0, 3).map((section) => (
              <TouchableOpacity
                key={section.crn}
                style={[styles.listRow, { borderColor: tc.border }]}
                onPress={() => navigation.navigate('ClassDetail', { course: section })}
                activeOpacity={0.7}
              >
                <View style={[styles.listAccent, { backgroundColor: tc.warning }]} />
                <View style={styles.listBody}>
                  <Text style={[styles.listTitle, { color: tc.text }]} numberOfLines={1}>
                    {section.course_code} · {section.title}
                  </Text>
                  <View style={styles.listMeta}>
                    <Icon name="pin-outline" style={styles.listMetaIcon} fill={tc.hint} />
                    <Text style={[styles.listMetaText, { color: tc.hint }]} numberOfLines={1}>
                      {section.room ?? section.campus ?? 'TBA'}
                    </Text>
                  </View>
                  <View style={styles.listMeta}>
                    <Icon name="clock-outline" style={styles.listMetaIcon} fill={tc.hint} />
                    <Text style={[styles.listMetaText, { color: tc.hint }]} numberOfLines={1}>
                      {section.meets ?? section.meeting_times?.[0]
                        ? `${section.meeting_times[0].day} ${section.meeting_times[0].start_time}–${section.meeting_times[0].end_time}`
                        : 'No meeting pattern'}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right-outline" style={styles.listChevron} fill={tc.border} />
              </TouchableOpacity>
            ))
          )}
        </SectionTile>

        {/* Today's Events tile */}
        <SectionTile
          icon="calendar-outline"
          iconColor={tc.primary}
          title="Today's Events"
          subtitle={todayEvents.length > 0 ? `${todayEvents.length} happening today` : 'Nothing scheduled today'}
          actionLabel="All Events"
          onAction={() => navigation.navigate('Events')}
          tc={tc}
        >
          {todayEvents.length === 0 ? (
            <View style={[styles.emptySlot, { borderColor: tc.border }]}>
              <Icon name="calendar-outline" style={styles.emptySlotIcon} fill={tc.hint} />
              <Text style={[styles.emptySlotText, { color: tc.hint }]}>No events today</Text>
            </View>
          ) : (
            displayedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.listRow, { borderColor: tc.border }]}
                onPress={() => navigation.navigate('EventDetail', { event })}
                activeOpacity={0.7}
              >
                <View style={[styles.listAccent, { backgroundColor: tc.primary }]} />
                <View style={styles.listBody}>
                  <Text style={[styles.listTitle, { color: tc.text }]} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <View style={styles.listMeta}>
                    <Icon name="person-outline" style={styles.listMetaIcon} fill={tc.hint} />
                    <Text style={[styles.listMetaText, { color: tc.hint }]} numberOfLines={1}>
                      {event.organizer}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right-outline" style={styles.listChevron} fill={tc.border} />
              </TouchableOpacity>
            ))
          )}
        </SectionTile>

        {/* Recently Viewed tile */}
        <SectionTile
          icon="search-outline"
          iconColor={tc.info}
          title="Recent Searches"
          subtitle={recentSearches.length > 0 ? 'Jump back in' : 'No searches yet'}
          actionLabel="Clear"
          onAction={clearRecentSearches}
          tc={tc}
        >
          {recentSearches.length === 0 ? (
            <View style={[styles.emptySlot, { borderColor: tc.border }]}>
              <Icon name="search-outline" style={styles.emptySlotIcon} fill={tc.hint} />
              <Text style={[styles.emptySlotText, { color: tc.hint }]}>
                Search events or classes to see them here
              </Text>
            </View>
          ) : (
            recentSearches.slice(0, 4).map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={[styles.listRow, { borderColor: tc.border }]}
                onPress={() => navigation.navigate(SECTION_NAV[entry.section], { initialQuery: entry.query })}
                activeOpacity={0.7}
              >
                <View style={[styles.listAccent, { backgroundColor: SECTION_COLORS[entry.section] }]} />
                <View style={styles.listBody}>
                  <Text style={[styles.listTitle, { color: tc.text }]} numberOfLines={1}>
                    {entry.query}
                  </Text>
                  <View style={styles.listMeta}>
                    <Icon
                      name={SECTION_ICONS[entry.section]}
                      style={styles.listMetaIcon}
                      fill={tc.hint}
                    />
                    <Text style={[styles.listMetaText, { color: tc.hint }]}>{entry.section}</Text>
                  </View>
                </View>
                <Icon name="chevron-right-outline" style={styles.listChevron} fill={tc.border} />
              </TouchableOpacity>
            ))
          )}
        </SectionTile>
        <View style={{ height: 32 }} />
      </ScrollView>
    </Layout>
  );
}

function QuickTile({ icon, label, color, bg, border, onPress }: {
  icon: string; label: string; color: string;
  bg: string; border: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.quickTile, { backgroundColor: bg, borderColor: border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickIconWrap, { backgroundColor: color + '22' }]}>
        <Icon name={icon} style={styles.quickIcon} fill={color} />
      </View>
      <Text style={[styles.quickLabel, { color: color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SectionTile({ icon, iconColor, title, subtitle, actionLabel, onAction, tc, children }: {
  icon: string; iconColor: string; title: string; subtitle: string;
  actionLabel: string; onAction: () => void; tc: any; children: React.ReactNode;
}) {
  return (
    <View style={[styles.tile, { backgroundColor: tc.surface, borderColor: tc.border }]}>
      <View style={styles.tileHeader}>
        <View style={styles.tileTitleRow}>
          <View style={[styles.tileIconWrap, { backgroundColor: iconColor + '22' }]}>
            <Icon name={icon} style={styles.tileIcon} fill={iconColor} />
          </View>
          <View>
            <Text style={[styles.tileTitle, { color: tc.text }]}>{title}</Text>
            <Text style={[styles.tileSubtitle, { color: tc.hint }]}>{subtitle}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.tileAction, { borderColor: tc.border }]}
          onPress={onAction}
        >
          <Text style={[styles.tileActionText, { color: iconColor }]}>{actionLabel}</Text>
          <Icon name="arrow-forward-outline" style={styles.tileActionIcon} fill={iconColor} />
        </TouchableOpacity>
      </View>

      <View style={[styles.tileDivider, { backgroundColor: tc.border }]} />

      <View style={styles.tileContent}>
        {children}
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  root:  { flex: 1 },
  scroll: { padding: 16, gap: 14 },

  greetingRow: { marginBottom: 4 },
  greeting:    { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  appName:     { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },

  // Quick nav row
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 2,
  },
  quickTile: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  quickIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIcon:  { width: 18, height: 18 },
  quickLabel: { fontSize: 11, fontWeight: '700' },

  // Section tile
  tile: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  tileTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tileIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileIcon:     { width: 18, height: 18 },
  tileTitle:    { fontSize: 15, fontWeight: '700' },
  tileSubtitle: { fontSize: 12, marginTop: 1 },
  tileAction: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 3,
  },
  tileActionText: { fontSize: 12, fontWeight: '600' },
  tileActionIcon: { width: 12, height: 12 },
  tileDivider:    { height: 1 },
  tileContent:    { padding: 12, gap: 8 },

  // List rows inside tiles
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  listAccent:    { width: 4, alignSelf: 'stretch' },
  listBody:      { flex: 1, padding: 10 },
  listTitle:     { fontSize: 13, fontWeight: '600', marginBottom: 3 },
  listMeta:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listMetaIcon:  { width: 12, height: 12 },
  listMetaText:  { fontSize: 11, flex: 1 },
  listChevron:   { width: 16, height: 16, marginRight: 10 },

  // Empty state slot
  emptySlot: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  emptySlotIcon: { width: 24, height: 24 },
  emptySlotText: { fontSize: 13 },
});