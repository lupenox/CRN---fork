import React, { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text, Card, Input, Icon, OverflowMenu, MenuItem, Button } from '@ui-kitten/components';
import { AppHeader } from '../navigation/AppHeader';
import { mockResources } from '../data/mockData';
import { ScrollView } from 'react-native';

export default function DirectoryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [menuVisible, setMenuVisible] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const unique = Array.from(new Set(mockResources.map(r => r.category)));
    return ['All Categories', ...unique];
  }, []);

  // Combined filtering and search logic
  const filteredData = mockResources.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Icons
  const SearchIcon = (props) => <Icon {...props} name='search-outline' />;
  const FilterIcon = (props) => <Icon {...props} name='funnel-outline' />;

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const renderFilterButton = () => (
    <Button
      accessoryLeft={FilterIcon}
      appearance="ghost"
      status={selectedCategory === 'All Categories' ? 'basic' : 'primary'}
      onPress={toggleMenu}
    />
  );

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <AppHeader title="Directory of UWM Resources" />

      <Layout style={styles.searchRow} level="1">
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          accessoryLeft={SearchIcon}
          onChangeText={setSearchQuery}
          style={styles.input}
        />

        <OverflowMenu
          anchor={renderFilterButton}
          visible={menuVisible}
          onBackdropPress={toggleMenu}
        >
          {categories.map((cat) => (
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

      {/* Show active filter tag if one is selected */}
      {selectedCategory !== 'All Categories' && (
        <Layout level="1" style={styles.activeFilterBar}>
          <Text category="c1">Filtering by: **{selectedCategory}**</Text>
          <Button size="tiny" appearance="ghost" onPress={() => setSelectedCategory('All Categories')}>Clear</Button>
        </Layout>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredData.map(event => (
          <Card
            key={event.id}
            style={styles.card}
            onPress={() => navigation.navigate('DirectoryDetail', { event })}
          >
            <Text category="s1">{event.title}</Text>
            <Text appearance="hint">{event.location}</Text>
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
  input: {
    flex: 1,
  },
  activeFilterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    width: '100%',
  },
});