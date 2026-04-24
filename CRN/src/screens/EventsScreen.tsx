import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Layout, Text, Icon, useTheme } from '@ui-kitten/components';
import { AppHeader } from '../navigation/AppHeader';
import { useRecentlySearched } from '../context/RecentlySearchedContext';
// Types
type DateFilter = 'all' | 'today' | '3days' | 'week';

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  organizer: string;
  date: string;
  lat?: number;
  lng?: number;
};

// Date helpers
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

function formatDate(dateStr: string): string {
  const date = parseEventDate(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function isToday(dateStr: string): boolean {
  const today = localMidnight(new Date());
  const d = parseEventDate(dateStr);
  return d.getTime() === today.getTime();
}

function isSoon(dateStr: string): boolean {
  const today = localMidnight(new Date());
  const d = parseEventDate(dateStr);
  const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 3;
}



function isValidEventDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return false;
  const [m, d, y] = parts.map(Number);
  if (isNaN(m) || isNaN(d) || isNaN(y)) return false;
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 2000) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

// Main Screen
export default function EventsScreen({ navigation, route }: any) {
  const theme = useTheme();
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const [searchQuery, setSearchQuery] = useState(route?.params?.initialQuery ?? '');
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [sortAsc, setSortAsc] = useState(true);
  const { addRecentSearch } = useRecentlySearched();
  const tc = {
    bg:           theme['color-basic-800'],
    surface:      theme['color-basic-700'],
    surfaceAlt:   theme['color-basic-600'],
    border:       theme['color-basic-500'],
    text:         theme['text-basic-color'],
    hint:         theme['text-hint-color'],
    primary:      theme['color-primary-500'],
    primaryLight: theme['color-primary-300'],
    danger:       theme['color-danger-500'],
    info:         theme['color-info-500'],
    success:      theme['color-success-500'],
    inputBg:      theme['color-basic-600'],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://crn.crn.deno.net/dynamic?table=event');
        const json = await response.json();
        const events: Event[] = (json.data ?? [])
          .filter((e: any) => isValidEventDate(e.date))
          .map((e: any, i: number) => ({ ...e, id: `event-${i}` }));
        setAllEvents(events);
      } catch (error) {
        console.log('Error fetching events:', error);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const today = localMidnight(new Date());
    let events = [...allEvents];

    // Date filter
    if (dateFilter !== 'all') {
      const limits: Record<Exclude<DateFilter, 'all'>, Date> = {
        today:  addDays(today, 1),
        '3days': addDays(today, 3),
        week:   addDays(today, 7),
      };
      const end = limits[dateFilter as Exclude<DateFilter, 'all'>];
      events = events.filter((e) => {
        const d = parseEventDate(e.date);
        return d >= today && d < end;
      });
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }

    // Sort
    events.sort((a, b) => {
      const diff = parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime();
      return sortAsc ? diff : -diff;
    });

    return events;
  }, [searchQuery, dateFilter, sortAsc]);

  // Group by date
  const grouped = useMemo(() => {
    const map: Record<string, Event[]> = {};
    for (const e of filtered) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return Object.entries(map);
  }, [filtered]);

  const DATE_FILTERS: { key: DateFilter; label: string }[] = [
    { key: 'today',  label: 'Today'     },
    { key: '3days',  label: '3 Days'    },
    { key: 'week',   label: 'This Week' },
    { key: 'all',    label: 'All'       },
  ];

  return (
    <Layout style={[styles.root, { backgroundColor: tc.bg }]}>
      <AppHeader title="Events" />

      {/* Search bar */}
      <View style={[styles.searchWrap, { backgroundColor: tc.surface }]}>
        <Icon name="search-outline" style={styles.searchIcon} fill={tc.hint} />
        <TextInput
          style={[styles.searchInput, { color: tc.text }]}
          placeholder="Search events, organizers..."
          placeholderTextColor={tc.hint}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onBlur={() => {
            if (searchQuery.trim()) addRecentSearch(searchQuery.trim(), 'Events');
          }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-outline" style={styles.clearIcon} fill={tc.hint} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter and sort row */}
      <View style={styles.controlRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {DATE_FILTERS.map(({ key, label }) => {
            const active = dateFilter === key;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.chip,
                  { borderColor: active ? tc.primary : tc.border,
                    backgroundColor: active ? tc.primary : 'transparent' },
                ]}
                onPress={() => setDateFilter(key)}
              >
                <Text style={[styles.chipText, { color: active ? '#000' : tc.hint }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: tc.hint }]}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Event list grouped by date */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {grouped.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Icon name="calendar-outline" style={styles.emptyIcon} fill={tc.border} />
            <Text style={[styles.emptyText, { color: tc.hint }]}>No events found</Text>
          </View>
        ) : (
          grouped.map(([date, events]) => (
            <View key={date}>
              {/* Date header */}
              <View style={styles.dateHeader}>
                <View style={[styles.datePill, {
                  backgroundColor: isToday(date) ? tc.primary : tc.surfaceAlt,
                }]}>
                  <Text style={[styles.datePillText, {
                    color: isToday(date) ? '#000' : tc.hint,
                  }]}>
                    {isToday(date) ? 'TODAY' : formatDate(date).toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.dateLine, { backgroundColor: tc.border }]} />
              </View>

              {/* Cards for this date */}
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  tc={tc}
                  onPress={() => navigation.navigate('EventDetail', { event })}
                />
              ))}
            </View>
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </Layout>
  );
}

// Event Card
function EventCard({ event, tc, onPress }: { event: Event; tc: any; onPress: () => void }) {
  const hasCoords = event.lat != null && event.lng != null;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: tc.surface, borderColor: tc.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.cardAccent, { backgroundColor: tc.primary }]} />

      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: tc.text }]} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.cardMeta}>
          <Icon name="person-outline" style={styles.metaIcon} fill={tc.hint} />
          <Text style={[styles.metaText, { color: tc.hint }]} numberOfLines={1}>
            {event.organizer}
          </Text>
        </View>

        <View style={styles.cardMeta}>
          <Icon name="pin-outline" style={styles.metaIcon} fill={tc.hint} />
          <Text style={[styles.metaText, { color: tc.hint }]} numberOfLines={1}>
            {event.location.split(',')[0]}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  root: { flex: 1 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: { width: 18, height: 18, marginRight: 8 },
  clearIcon:  { width: 18, height: 18, marginLeft: 4  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },

  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 4,
  },
  chipScroll: { paddingLeft: 16, paddingVertical: 4 },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  chipText: { fontSize: 12, fontWeight: '600' },

  sortBtn: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    marginLeft: 4,
  },
  sortIcon: { width: 16, height: 16 },

  countRow: { paddingHorizontal: 16, paddingBottom: 4 },
  countText: { fontSize: 12 },

  listContent: { paddingHorizontal: 16 },

  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    gap: 10,
  },
  datePill: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  datePillText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  dateLine: { flex: 1, height: 1 },

  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6, lineHeight: 20 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  metaIcon: { width: 13, height: 13, marginRight: 5 },
  metaText: { fontSize: 12, flex: 1 },

  cardRight: {
    paddingRight: 10,
    paddingTop: 10,
    alignItems: 'center',
    gap: 8,
  },
  chevron: { width: 18, height: 18 },
  mapBadge: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 4,
  },
  mapBadgeIcon: { width: 13, height: 13 },

  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon: { width: 48, height: 48 },
  emptyText: { fontSize: 15 },
});