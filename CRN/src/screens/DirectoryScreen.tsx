import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Layout, Text, Card, Input, Icon } from '@ui-kitten/components';
import { AppHeader } from '../navigation/AppHeader';
import { mockResources } from '../data/mockData';

export default function DirectoryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = mockResources.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SearchIcon = (props) => (
    <Icon {...props} name='search-outline' />
  );

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <AppHeader title="Directory of UWM Resources" />

      {/* Search Section */}
      <Layout style={styles.searchContainer} level="1">
        <Input
          placeholder="Search..."
          value={searchQuery}
          accessoryRight={SearchIcon}
          onChangeText={nextValue => setSearchQuery(nextValue)}
        />
      </Layout>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredData.length > 0 ? (
          filteredData.map(event => (
            <Card
              key={event.id}
              style={styles.card}
              onPress={() => navigation.navigate('DirectoryDetail', { event })}
            >
              <Text category="s1" style={{ marginBottom: 4 }}>{event.title}</Text>
              <Text appearance="hint" style={{ marginBottom: 8 }}>{event.location}</Text>
            </Card>
          ))
        ) : (
          <Text category="p1" style={styles.emptyText}>No resources found matching "{searchQuery}"</Text>
        )}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.5
  }
});