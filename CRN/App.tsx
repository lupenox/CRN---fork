import * as React from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './src/theme/customTheme.ts';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DirectoryScreen from './src/screens/DirectoryScreen.tsx';
import DirectoryDetailScreen from './src/screens/DirectoryDetailScreen.tsx';
import Account from './src/screens/AccountScreen.tsx';
import Login from './src/screens/LoginScreen.tsx';
import SignUp from './src/screens/SignUpScreen.tsx';

import { SideMenuProvider } from './src/navigation/SideMenuContext.tsx';
import SideMenu from './src/navigation/SideMenu.tsx';
import Map from './src/screens/MapScreen.tsx';
import Home from './src/screens/HomeScreen.tsx';

const Stack = createNativeStackNavigator();

export default function App() {

	const systemTheme = useColorScheme() ?? 'light';
	const evaTheme = systemTheme === 'dark'? eva.dark : eva.light;
	const customTheme = systemTheme === 'dark'? darkTheme : lightTheme;

  return (
    <ApplicationProvider {...eva} theme={{ ...evaTheme, ...customTheme }}>
     <SafeAreaProvider>
      <IconRegistry icons ={EvaIconsPack} />
      <SideMenuProvider>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false}}>
                <Stack.Screen name="Login"            component={Login}                 />
                <Stack.Screen name="Home"             component={Home}                  />
                <Stack.Screen name="Directory"        component={DirectoryScreen}       />
                <Stack.Screen name="SignUp"           component={SignUp}                />
                <Stack.Screen name="DirectoryDetail"  component={DirectoryDetailScreen} />
                <Stack.Screen name="Account"          component={Account}               />
                <Stack.Screen name="Map"              component={Map}                   />
            </Stack.Navigator>
          <SideMenu />
        </NavigationContainer>
        </SideMenuProvider>
       </SafeAreaProvider>
    </ApplicationProvider>
  );
}
