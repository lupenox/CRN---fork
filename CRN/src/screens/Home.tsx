//screens/Home.tsx

import React from 'react';
import { AppHeader } from '../navigation/AppHeader.tsx';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Layout } from '@ui-kitten/components';
import { mockResources } from '../data/mockData';

/**
 * 
 * @Note Landing page for the application after
 * logging in. Displays last used resources
 * 
 * @TODO Current implementation shows the top 5
 * resources from our mock. Change to use last searched
 * metadata from user
 */
export default function Home({ navigation }){
    const top5Resources = mockResources.slice(0,5);
    return (
		<Layout level="2" style={styles.container}>
            <AppHeader title="Welcome" />
            <Card style={styles.card}>
                <ScrollView contentContainerStyle={{ gap: 12 }}>
                <Text category='h3' style={styles.title}>Campus Resource Navigator</Text>
                <Text category='h5' >Last Searched</Text>
                    {top5Resources.map(event => (
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
            </Card>
        </Layout>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	card: {
		height: '80%',
		width: '100%',
		padding: 10,
	},
	title: {
		textAlign: 'center',
		marginBottom: 20,
	},
	input: {
		marginBottom: 12,
	},
	btn: {
		marginTop: 8,
	},
});
