import React from 'react';
import { Layout, Card, Input, Button, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { useState } from 'react';

export default function Login({ navigation }: { navigation: any }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<Layout level="2" style={styles.container}>
			<Card style={styles.card}>
				<Text category='h5' style={styles.title}>Campus Resource Navigator</Text>
				<Input
					style={styles.input}
					placeholder='Email'
					value={email}
					onChangeText={setEmail}
					keyboardType='email-address'
					autoCapitalize='none'
				/>
				<Input
					style={styles.input}
					placeholder='Password'
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
				<Button
					style={styles.btn}
					onPress={() => navigation.replace('Home')}
				>
					Login
				</Button>
				<Button
					style={styles.btn}
					appearance='ghost'
					onPress={() => navigation.navigate('SignUp')}
				>
					Create Account
				</Button>
			</Card>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	card: {
		width: '80%',
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
