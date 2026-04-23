import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text, Input, Icon, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { AppHeader } from '../navigation/AppHeader';
import { ScrollView } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { useRecentlySearched } from '../context/RecentlySearchedContext';

type Resource = {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  address: string;
  organizer: string;
  phone: string;
  website: string;
  hours: string;
  lat?: number;
  lng?: number;
};

export default function DirectoryScreen({ navigation, route }: any) {
  const [searchQuery, setSearchQuery] = useState(route?.params?.initialQuery ?? '');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [menuVisible, setMenuVisible] = useState(false);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const { addRecentSearch } = useRecentlySearched();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://crn.crn.deno.net/dynamic?table=resource');
        const json = await response.json();
        const resources: Resource[] = (json.data ?? []).map((r: any, i: number) => ({
          ...r,
          id: r.id ?? `resource-${i}`,
        }));
        setAllResources(resources);
      } catch (error) {
        console.log('Error fetching resources:', error);
      }
    };
    fetchData();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(allResources.map(r => r.category).filter(Boolean)));
    return ['All Categories', ...unique];
  }, [allResources]);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return allResources.filter(item => {
      const matchesSearch =
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategory === 'All Categories' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allResources, searchQuery, selectedCategory]);

  const SearchIcon = (props: any) => <Icon {...props} name="search-outline" />;
  const FilterIcon = (props: any) => <Icon {...props} name="funnel-outline" />;

  const renderFilterButton = () => (
    <Button
      accessoryLeft={FilterIcon}
      appearance="ghost"
      status={selectedCategory === 'All Categories' ? 'basic' : 'primary'}
      onPress={() => setMenuVisible(!menuVisible)}
    />
  );

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <AppHeader title="Resources" />
      <Layout style={styles.searchRow} level="1">
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          accessoryLeft={SearchIcon}
          onChangeText={setSearchQuery}
          onBlur={() => {
            if (searchQuery.trim()) addRecentSearch(searchQuery.trim(), 'Directory');
          }}
          style={styles.input}
        />
        <OverflowMenu
          anchor={renderFilterButton}
          visible={menuVisible}
          onBackdropPress={() => setMenuVisible(false)}
        >
          {categories.map(cat => (
            <MenuItem
              key={cat}
              title={cat}
              onPress={() => {
                setSelectedCategory(cat);
                setMenuVisible(false);
              }}
            />
          ))}
        </OverflowMenu>
      </Layout>

      {selectedCategory !== 'All Categories' && (
        <Layout level="1" style={styles.activeFilterBar}>
          <Text category="c1">Filtering by: **{selectedCategory}**</Text>
          <Button size="tiny" appearance="ghost" onPress={() => setSelectedCategory('All Categories')}>
            Clear
          </Button>
        </Layout>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredData.map(resource => (
          <Card
            key={resource.id}
            style={styles.card}
            onPress={() => navigation.navigate('DirectoryDetail', { event: resource })}
          >
            <Text category="s1">{resource.title}</Text>
            <Text appearance="hint">{resource.location}</Text>
          </Card>
        ))}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: { flex: 1 },
  activeFilterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  scrollContent: { padding: 16, gap: 12 },
  card: { width: '100%' },
});