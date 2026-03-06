import React, { useLayoutEffect, useContext } from 'react';
import { Layout, Text, Card, Divider, Button, Icon } from '@ui-kitten/components';
import { ScrollView, Linking, TouchableOpacity } from 'react-native';
import { SideMenuContext } from '../navigation/SideMenuContext';
import { AppHeader } from '../navigation/AppHeader';

export default function DirectoryDetailScreen({ route, navigation })
{
    const { event } = route.params ?? {};

    if(!event)
    {
        return(
            <Layout style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No details to display</Text>
            </Layout>
        );
    }
    return (
        <Layout level="2" style={{ flex: 1 }}>
          <AppHeader title={event.title} showBack={true} />
            <ScrollView>
                <Card style={{ paddingVertical: 12 }}>
                <Text category="h5" style={{ marginBottom: 6 }}>{event.title}</Text>
                <Text appearance="hint" style={{ marginBottom: 8 }}>{event.location}</Text>

                <Divider style={{ marginVertical: 8 }} />

                <Text category="c1" style={{ marginBottom: 6 }}>Hours: {event.hours}</Text>
                <Text style={{ marginBottom: 8 }}>{event.description}</Text>

                <Button onPress={() => Linking.openURL(event.website)} style={{ marginTop: 12 }}>
                    Open Website
                </Button>
                {event.lat && event.lng && (
                    <Button
                        style={{ marginTop: 12 }}
                        onPress={() => navigation.navigate('Map', {
                            targetLocation: {
                                id: event.id,
                                lat: event.lat,
                                lng: event.lng,
                                title: event.title
                            }
                        })}
                    >
                        View on Map
                    </Button>
                )}
                </Card>
            </ScrollView>
            </Layout>
        );
}