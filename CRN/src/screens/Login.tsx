import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Layout, Card } from '@ui-kitten/components';
import { useAuth0 } from 'react-native-auth0';

export default function Login() {
  const { authorize } = useAuth0();

  const handleAuth0Login = async () => {
    try {
      await authorize({
        scope: 'openid profile email',
        audience: 'https://api.crn.uwm.edu',
        additionalParameters: {
          prompt: 'select_account',
        },
      });
    } catch (e) {
      console.error('Login error:', e);
    }
  };

  return (
    <Layout level="2" style={styles.container}>
      <Card style={styles.card}>
        <Text category="h5" style={styles.title}>Campus Resource Navigator</Text>
        <Text category="s1" style={styles.subtitle}>Log in or create an account to continue</Text>
        
        <Button onPress={handleAuth0Login} status="primary" style={styles.btn}>
          Continue with Auth0
        </Button>
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { padding: 10, width: '100%', maxWidth: 400 },
  title: { marginBottom: 10, textAlign: 'center' },
  subtitle: { marginBottom: 30, textAlign: 'center', color: '#666' },
  btn: { marginTop: 10 },
});
// import React from 'react';
// import { Layout, Card, Input, Button, Text } from '@ui-kitten/components';
// import { StyleSheet } from 'react-native';
// import { useState } from 'react';

// export default function Login({ navigation }: { navigation: any }) {
// 	const [email, setEmail] = useState('');
// 	const [password, setPassword] = useState('');

// 	return (
// 		<Layout level="2" style={styles.container}>
// 			<Card style={styles.card}>
// 				<Text category='h5' style={styles.title}>Campus Resource Navigator</Text>
// 				<Input
// 					style={styles.input}
// 					placeholder='Email'
// 					value={email}
// 					onChangeText={setEmail}
// 					keyboardType='email-address'
// 					autoCapitalize='none'
// 				/>
// 				<Input
// 					style={styles.input}
// 					placeholder='Password'
// 					value={password}
// 					onChangeText={setPassword}
// 					secureTextEntry
// 				/>
// 				<Button
// 					style={styles.btn}
// 					onPress={() => navigation.replace('Directory')}
// 				>
// 					Login
// 				</Button>
// 				<Button
// 					style={styles.btn}
// 					appearance='ghost'
// 					onPress={() => navigation.navigate('SignUp')}
// 				>
// 					Create Account
// 				</Button>
// 			</Card>
// 		</Layout>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 	},
// 	card: {
// 		width: '80%',
// 		padding: 10,
// 	},
// 	title: {
// 		textAlign: 'center',
// 		marginBottom: 20,
// 	},
// 	input: {
// 		marginBottom: 12,
// 	},
// 	btn: {
// 		marginTop: 8,
// 	},
// });
