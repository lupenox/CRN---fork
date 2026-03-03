import React, { useState } from 'react';
import { Layout, Card, Input, Button, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

export default function SignUp({ navigation }: { navigation: any }) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	return (
		<Layout level="2" style={styles.container}>
			<Card style={styles.card}>
				<Text category='h5' style={styles.title}>Create Account</Text>
				<Input
					style={styles.input}
					placeholder='Name'
					value={name}
					onChangeText={setName}
				/>
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
				<Input
					style={styles.input}
					placeholder='Confirm Password'
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry
				/>
				<Button
					style={styles.btn}
					onPress={() => navigation.replace('Directory')}
				>
					Create Account
				</Button>
				<Button
					style={styles.btn}
					appearance='ghost'
					onPress={() => navigation.goBack()}
				>
					Back to Login
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
