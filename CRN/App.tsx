import React from 'react';
import {Auth0Provider, useAuth0} from 'react-native-auth0';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ActivityIndicator,
} from 'react-native';

function HomeScreen() {
  const {authorize, clearSession, user, isLoading} = useAuth0();

  const handleLogin = async () => {
    try {
      await authorize({
        customScheme: 'crnapp', 
        scope: 'openid profile email',
        audience: 'https://api.crn.uwm.edu' 
      });
    } catch (e) {
      console.error('Login error:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await clearSession({customScheme: 'crnapp'});
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth0 Expo Sample</Text>

      {user ? (
        <View style={styles.profileContainer}>
          {user.picture && (
            <Image source={{uri: user.picture}} style={styles.avatar} />
          )}
          <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
          <Text style={styles.emailText}>{user.email}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Log Out" onPress={handleLogout} color="#dc3545" />
          </View>
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <Text style={styles.subtitle}>
            Tap the button below to log in
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Log In" onPress={handleLogin} color="#0066cc" />
          </View>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <Auth0Provider domain="dev-85gf7oggpaitwy0i.us.auth0.com" clientId="VpyvzewB5JqS7K8WVfbBHPyh1xoPX70i">
      <HomeScreen />
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  loginContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    width: 200,
    marginTop: 10,
  },
});
// import * as React from 'react';
// import { ApplicationProvider, Button, Layout, Text, IconRegistry } from '@ui-kitten/components';
// import * as eva from '@eva-design/eva';
// import { EvaIconsPack } from '@ui-kitten/eva-icons';

// import { useColorScheme } from 'react-native';
// import { lightTheme, darkTheme } from './src/theme/customTheme.ts';

// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// import DirectoryScreen from './src/screens/DirectoryScreen.tsx';
// import DirectoryDetailScreen from './src/screens/DirectoryDetailScreen.tsx';
// import Account from './src/screens/Account.tsx';
// import Login from './src/screens/Login.tsx';
// import SignUp from './src/screens/SignUp.tsx';

// import { SideMenuProvider } from './src/navigation/SideMenuContext.tsx';
// import SideMenu from './src/navigation/SideMenu.tsx';
// import MenuButton from './src/navigation/MenuButton';
// import Map from './src/screens/Map.tsx';

// const Stack = createNativeStackNavigator();

// export default function App() {

// 	const systemTheme = useColorScheme() ?? 'light';
// 	const evaTheme = systemTheme === 'dark'? eva.dark : eva.light;
// 	const customTheme = systemTheme === 'dark'? darkTheme : lightTheme;

//   return (
//     <ApplicationProvider {...eva} theme={{ ...evaTheme, ...customTheme }}>
//      <SafeAreaProvider>
//       <IconRegistry icons ={EvaIconsPack} />
//       <SideMenuProvider>
//         <NavigationContainer>
//             <Stack.Navigator screenOptions={{ headerShown: false}}>
//                 <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//                 <Stack.Screen name="Directory" component={DirectoryScreen} options={{ title: 'Directory of UWM Resources' }} />
//                 <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
//                 <Stack.Screen name="DirectoryDetail" component={DirectoryDetailScreen} />
//                 <Stack.Screen name="Account" component={Account} />
//                 <Stack.Screen name="Map" component={Map} />
//             </Stack.Navigator>
//           <SideMenu />
//         </NavigationContainer>
//         </SideMenuProvider>
//        </SafeAreaProvider>
//     </ApplicationProvider>
//   );
// }
