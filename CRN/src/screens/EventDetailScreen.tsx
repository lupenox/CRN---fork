import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Layout, Text, Icon, Divider, useTheme } from '@ui-kitten/components';
import { AppHeader } from '../navigation/AppHeader';
import Button from '../components/Button';

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

function parseEventDate(dateStr: string): Date {
  const [m, d, y] = dateStr.split('/').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateLong(dateStr: string): string {
  return parseEventDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function EventDetailScreen({ route, navigation }: any) {
  const theme = useTheme();
  const { event }: { event: Event } = route.params ?? {};

  const tc = {
    bg:       theme['color-basic-800'],
    surface:  theme['color-basic-700'],
    border:   theme['color-basic-500'],
    text:     theme['text-basic-color'],
    hint:     theme['text-hint-color'],
    primary:  theme['color-primary-500'],
    info:     theme['color-info-500'],
  };

  if (!event) {
    return (
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No event details available.</Text>
      </Layout>
    );
  }

  const hasCoords = event.lat != null && event.lng != null;

  return (
    <Layout style={[styles.root, { backgroundColor: tc.bg }]}>
      <AppHeader title="Event Details" showBack={true} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={[styles.heroCard, { backgroundColor: tc.surface, borderColor: tc.border }]}>
          <View style={[styles.heroStripe, { backgroundColor: tc.primary }]} />

          <View style={styles.heroBody}>
            <Text style={[styles.heroTitle, { color: tc.text }]}>{event.title}</Text>

            <View style={[styles.dateBadge, { backgroundColor: tc.primary + '22', borderColor: tc.primary + '55' }]}>
              <Icon name="calendar-outline" style={styles.badgeIcon} fill={tc.primary} />
              <Text style={[styles.dateBadgeText, { color: tc.primary }]}>
                {formatDateLong(event.date)}
              </Text>
            </View>
          </View>
        </View>

        {/* Info rows */}
        <View style={[styles.infoCard, { backgroundColor: tc.surface, borderColor: tc.border }]}>

          <InfoRow
            icon="person-outline"
            label="Organizer"
            value={event.organizer}
            tc={tc}
          />
          <Divider style={{ marginVertical: 2 }} />
          <InfoRow
            icon="pin-outline"
            label="Location"
            value={event.location}
            tc={tc}
          />

        </View>

        {/* Description */}
        {event.description ? (
          <View style={[styles.descCard, { backgroundColor: tc.surface, borderColor: tc.border }]}>
            <View style={styles.descHeader}>
              <Icon name="file-text-outline" style={styles.descIcon} fill={tc.hint} />
              <Text style={[styles.descLabel, { color: tc.hint }]}>About this event</Text>
            </View>
            <Text style={[styles.descText, { color: tc.text }]}>{event.description}</Text>
          </View>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            style={styles.actionBtn}
            onPress={() =>
              navigation.navigate('Map', {
                targetLocation: {
                  id: event.id,
                  lat: event.lat,
                  lng: event.lng,
                  title: event.title,
                },
                mapViewMode: 'events',
              })
            }
            accessoryLeft={(props) => <Icon {...props} name="map-outline" />}
          >
            {hasCoords ? 'View on Map' : 'Show on Map'}
          </Button>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </Layout>
  );
}

// Info Row
function InfoRow({ icon, label, value, tc }: { icon: string; label: string; value: string; tc: any }) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIconWrap, { backgroundColor: tc.primary + '18' }]}>
        <Icon name={icon} style={styles.infoIcon} fill={tc.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={[styles.infoLabel, { color: tc.hint }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: tc.text }]}>{value}</Text>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { padding: 16, gap: 12 },

  heroCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 4,
  },
  heroStripe: { height: 5 },
  heroBody:   { padding: 16 },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 12,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 6,
  },
  badgeIcon:     { width: 14, height: 14 },
  dateBadgeText: { fontSize: 13, fontWeight: '600' },

  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon:  { width: 18, height: 18 },
  infoText:  { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  infoValue: { fontSize: 14, lineHeight: 20 },

  descCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  descHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  descIcon:   { width: 15, height: 15 },
  descLabel:  { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  descText:   { fontSize: 14, lineHeight: 22 },

  actions:   { gap: 10, marginTop: 4 },
  actionBtn: { width: '100%' },
});