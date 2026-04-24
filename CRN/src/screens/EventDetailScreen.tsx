import { Modal, TextInput, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { useAuth0 } from 'react-native-auth0';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Layout, Text, Icon, Divider, useTheme } from '@ui-kitten/components';
import { AppHeader } from '../navigation/AppHeader';
import Button from '../components/Button';

const reviewedEventIds = new Set<string>();

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
  const { user } = useAuth0();
  const { event }: { event: Event } = route.params ?? {};
  const [reviewVisible, setReviewVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const starScales = useRef(
    [1, 2, 3, 4, 5].map(() => new Animated.Value(1))
  ).current;
  const [message, setMessage] = useState('');
  const tc = {
    bg:       theme['color-basic-800'],
    surface:  theme['color-basic-700'],
    border:   theme['color-basic-500'],
    text:     theme['text-basic-color'],
    hint:     theme['text-hint-color'],
    primary:  theme['color-primary-500'],
    info:     theme['color-info-500'],
  };

  useEffect(() => {
    if (event?.id && reviewedEventIds.has(event.id)) {
      setHasReviewed(true);
    }
  }, [event?.id]);

  const animateStar = (index: number) => {
    Animated.sequence([
      Animated.timing(starScales[index], {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(starScales[index], {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

const handleSubmitReview = async () => {
  try {
    const response = await fetch('https://crn.crn.deno.net/dynamic?table=review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: event.id,
        user_id: user?.sub ?? null,
        rating,
        comment: message,
      }),
    });

    const result = await response.json();
    console.log('Review POST response:', result);

    if (!response.ok) {
      console.log('Review POST failed:', response.status, result);
      return;
    }

    reviewedEventIds.add(event.id);
    setSubmitted(true);
    setHasReviewed(true);

    setTimeout(() => {
      setSubmitted(false);
      setReviewVisible(false);
      setRating(0);
      setMessage('');
    }, 1200);
  } catch (err) {
    console.log('Error submitting review:', err);
  }
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

          <Button
            style={styles.actionBtn}
            disabled={hasReviewed}
            onPress={() => setReviewVisible(true)}
            accessoryLeft={(props) => (
              <Icon {...props} name={hasReviewed ? 'star' : 'star-outline'} />
            )}
          >
            {hasReviewed ? 'Already Reviewed' : 'Leave a Review'}
          </Button>

        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
      <Modal visible={reviewVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: tc.surface }]}>

            <Text style={[styles.modalTitle, { color: tc.text }]}>
              Leave a Review
            </Text>

            {submitted ? (
              <View style={styles.successContainer}>
                <Icon
                  name="checkmark-circle-2-outline"
                  fill={tc.primary}
                  style={{ width: 40, height: 40 }}
                />
                <Text style={{ color: tc.text, marginTop: 8 }}>
                  Review submitted!
                </Text>
              </View>
            ) : (
              <>
                {/* Stars */}
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => {
                        setRating(star);
                        animateStar(index);
                      }}
                    >
                      <Animated.View style={{ transform: [{ scale: starScales[index] }] }}>
                        <Icon
                          name={star <= rating ? "star" : "star-outline"}
                          fill={tc.primary}
                          style={styles.starIcon}
                        />
                      </Animated.View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Message */}
                <TextInput
                  placeholder="Write a review..."
                  placeholderTextColor={tc.hint}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  style={[
                    styles.input,
                    { color: tc.text, borderColor: tc.border }
                  ]}
                />

                {/* Actions */}
                <View style={styles.modalActions}>
                  <Button
                    appearance="ghost"
                    onPress={() => {
                      setReviewVisible(false);
                      setRating(0);
                      setMessage('');
                      setSubmitted(false);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={rating === 0}
                    onPress={handleSubmitReview}
                  >
                    Submit
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  starsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 6,
  },

  starIcon: {
    width: 28,
    height: 28,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});