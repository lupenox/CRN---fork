import React from 'react';
import { Layout, Text, Card } from '@ui-kitten/components';
import { ScrollView } from 'react-native';
import { AppHeader } from '../navigation/AppHeader';
import { mockResources } from '../data/mockData';

export default function DirectoryScreen({ navigation }) {

  return (
    <Layout level="2" style={{ flex: 1 }}>
     <AppHeader title="Directory of UWM Resources" />
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        {mockResources.map(event => (
          <Card
            key={event.id}
            style={{ width: '100%', paddingVertical: 12 }}
            onPress={() => navigation.navigate('DirectoryDetail', { event })}
          >
            <Text category="s1" style={{ marginBottom: 4 }}>{event.title}</Text>
            <Text appearance="hint" style={{ marginBottom: 8 }}>{event.location}</Text>
          </Card>
        ))}
      </ScrollView>
    </Layout>
  );
}
