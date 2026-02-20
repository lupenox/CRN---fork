import React, { useLayoutEffect } from 'react';
import { Layout, Text, Card, Divider, Button } from '@ui-kitten/components';
import { ScrollView, Linking } from 'react-native';

export default function DirectoryDetailScreen({ route, navigation })
{
    const { event } = route.params ?? {};

    useLayoutEffect(() =>
    {
        navigation.setOptions({ title: event?.title ?? 'Detail' });
    }, [navigation, event]);

    if(!event)
    {
        return(
            <Layout style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No details to display</Text>
            </Layout>
        );
    }
    return (
        <Layout style={{ flex: 1, padding: 16 }}>
          <ScrollView>
            <Card style={{ paddingVertical: 12 }}>
              <Text category="h5" style={{ marginBottom: 6 }}>{event.title}</Text>
              <Text appearance="hint" style={{ marginBottom: 8 }}>{event.location}</Text>

              <Divider style={{ marginVertical: 8 }} />

              <Text category="c1" style={{ marginBottom: 6 }}>Hours: {event.hours}</Text>
              <Text style={{ marginBottom: 8 }}>{event.info}</Text>

              <Button onPress={() => Linking.openURL(event.link)} style={{ marginTop: 12 }}>
                Open Website
              </Button>
            </Card>
          </ScrollView>
        </Layout>
      );
}