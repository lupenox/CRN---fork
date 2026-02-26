import * as React from 'react';
import { ApplicationProvider, Button, Layout, Text, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './src/theme/customTheme.ts';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DirectoryScreen from './src/screens/DirectoryScreen.tsx';
import DirectoryDetailScreen from './src/screens/DirectoryDetailScreen.tsx';
import Account from './src/screens/Account.tsx';
import Login from './src/screens/Login.tsx';

import { SideMenuProvider } from './src/navigation/SideMenuContext.tsx';
import SideMenu from './src/navigation/SideMenu.tsx';
import MenuButton from './src/navigation/MenuButton';
import Map from './src/screens/Map.tsx';

const Stack = createNativeStackNavigator();

export default function App() {

	const systemTheme = useColorScheme() ?? 'light';
	const evaTheme = systemTheme === 'dark'? eva.dark : eva.light;
	const customTheme = systemTheme === 'dark'? darkTheme : lightTheme;

  return (
    <ApplicationProvider {...eva} theme={{...evaTheme, ...customTheme}}>
     <IconRegistry icons ={EvaIconsPack} />
      <SideMenuProvider>
       <NavigationContainer>
         <Stack.Navigator screenOptions={{ headerLeft: () => <MenuButton/>, }}>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Directory" component={DirectoryScreen} options={{ title: 'Directory of UWM Resources' }} />
            <Stack.Screen name="DirectoryDetail" component={DirectoryDetailScreen} />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="Map" component={Map} />
         </Stack.Navigator>
         <SideMenu />
       </NavigationContainer>
      </SideMenuProvider>
    </ApplicationProvider>
  );
}
