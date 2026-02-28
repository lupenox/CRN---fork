import React, { useLayoutEffect, useContext } from 'react';
import { Layout, Text, Card, Divider, Button, Icon } from '@ui-kitten/components';
import { ScrollView, Linking, TouchableOpacity } from 'react-native';
import { SideMenuContext } from '../navigation/SideMenuContext';

export default function DirectoryDetailScreen({ route, navigation })
{
    const { event } = route.params ?? {};
    const { closeMenu } = useContext(SideMenuContext);

    useLayoutEffect(() =>
    {
        navigation.setOptions({ title: event?.title ?? 'Detail',
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => {
                        closeMenu();
                        navigation.goBack();
                    }}
                    style={{ paddingHorizontal: 12 }}
                >
                    <Icon name="arrow-back" style={{width: 24, height: 24}} />
                </TouchableOpacity>
            ),
        });
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
                <Text style={{ marginBottom: 8 }}>{event.description}</Text>

                <Button onPress={() => Linking.openURL(event.website)} style={{ marginTop: 12 }}>
                    Open Website
                </Button>
                </Card>
            </ScrollView>
            </Layout>
        );
}