import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Layout, Text, Input, Icon, Spinner, useTheme,
} from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../navigation/AppHeader';
import Card from '../components/Card';
import { searchCourses } from '../services/courseService';

import { useRecentlySearched } from '../context/RecentlySearchedContext';

const SearchIcon  = (props) => <Icon {...props} name="search-outline" />;
const ChevronIcon = (props) => <Icon {...props} name="chevron-right-outline" />;
const BookIcon    = (props) => <Icon {...props} name="book-open-outline" />;

function groupByCourse(sections) {
  const map = new Map();
  for (const s of sections) {
    if (!map.has(s.course_code)) {
      map.set(s.course_code, { course_code: s.course_code, title: s.title, sections: [] });
    }
    map.get(s.course_code).sections.push(s);
  }
  return Array.from(map.values());
}

function CourseGroupCard({ group, onPress, theme }) {
  const lectureCount = group.sections.filter(s => s.schedule_type === 'LEC').length;
  const labCount     = group.sections.filter(s => s.schedule_type === 'LAB').length;
  const summaryParts = [];
  if (lectureCount) summaryParts.push(`${lectureCount} lecture${lectureCount > 1 ? 's' : ''}`);
  if (labCount)     summaryParts.push(`${labCount} lab${labCount > 1 ? 's' : ''}`);
  const otherCount = group.sections.length - lectureCount - labCount;
  if (otherCount)   summaryParts.push(`${otherCount} other`);
  return (
    <Card style={styles.card} onPress={() => onPress(group)}>
      <View style={styles.cardRow}>
        <View style={styles.cardBody}>
          <Text category="s1">{group.course_code}</Text>
          <Text category="p2" numberOfLines={2}>{group.title}</Text>
          <Text category="c1" appearance="hint" style={{ marginTop: 4 }}>
            {summaryParts.join(' · ')}
          </Text>
        </View>
        <ChevronIcon style={styles.chevron} fill={theme['text-hint-color']} />
      </View>
    </Card>
  );
}

export default function ClassSearchScreen({ route }: any) {
  const navigation = useNavigation();
  const theme      = useTheme();
  const { addRecentSearch } = useRecentlySearched();

  const [query, setQuery] = useState(route?.params?.initialQuery ?? '');
  useEffect(() => {
    if (route?.params?.initialQuery) handleSearch();
  }, []);
  const [rawResults, setRawResults] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);

  const grouped = useMemo(() => groupByCourse(rawResults), [rawResults]);

const handleSearch = useCallback(async () => {
  if (!query.trim()) return;
  setLoading(true);
  setSearched(true);
  addRecentSearch(query.trim(), 'Classes');
  try {
    const data = await searchCourses(query.trim(), '');
    setRawResults(data);
  } catch (e) {
    console.error(e);
    setRawResults([]);
  } finally {
    setLoading(false);
  }
}, [query, addRecentSearch]);

  const renderEmpty = () => {
    if (loading) return null;
    if (!searched) return (
      <View style={styles.emptyState}>
        <BookIcon style={styles.emptyIcon} fill={theme['text-hint-color']} />
        <Text category="s1" appearance="hint">Search for classes</Text>
        <Text category="c1" appearance="hint" style={{ marginTop: 4 }}>
          Enter a course name, code, or instructor
        </Text>
      </View>
    );
    return (
      <View style={styles.emptyState}>
        <Text category="s1" appearance="hint">No results found</Text>
        <Text category="c1" appearance="hint" style={{ marginTop: 4 }}>
          Try a different keyword
        </Text>
      </View>
    );
  };

  return (
    <Layout level="2" style={styles.root}>
      <AppHeader title="Add Classes" showBack={true} />

      <View style={styles.searchRow}>
        <Input
          style={styles.input}
          placeholder="Title, code, or instructor…"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          accessoryLeft={SearchIcon}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.course_code}
        renderItem={({ item }) => (
          <CourseGroupCard
            group={item}
            theme={theme}
            onPress={(group) => navigation.navigate('ClassSections', { group })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1 },
  searchRow:   { paddingHorizontal: 16, paddingVertical: 12, width: '100%' },
  input:       { width: '100%' },
  loadingRow:  { alignItems: 'center', paddingVertical: 24 },
  listContent: { padding: 16, gap: 12, flexGrow: 1 },
  card:        { width: '100%' },
  cardRow:     { flexDirection: 'row', alignItems: 'center' },
  cardBody:    { flex: 1 },
  chevron:     { width: 20, height: 20, marginLeft: 8 },
  emptyState:  { alignItems: 'center', paddingTop: 80 },
  emptyIcon:   { width: 48, height: 48, marginBottom: 12 },
});
