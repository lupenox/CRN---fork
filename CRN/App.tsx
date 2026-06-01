import * as React from 'react';

// UI Kitten & Eva Design
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { lightTheme, darkTheme } from './src/theme/customTheme.ts';
import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext.tsx';

// Navigation & Safe Area
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { SideMenuProvider } from './src/navigation/SideMenuContext.tsx';
import { RecentlySearchedProvider } from './src/context/RecentlySearchedContext';

// Screens
import DirectoryScreen from './src/screens/DirectoryScreen.tsx';
import DirectoryDetailScreen from './src/screens/DirectoryDetailScreen.tsx';
import Account from './src/screens/Account.tsx';

import MyClassesScreen from './src/screens/MyClassesScreen';
import ClassSearchScreen from './src/screens/ClassSearchScreen';
import ClassSectionsScreen from './src/screens/ClassSectionsScreen';
import ClassDetailScreen from './src/screens/ClassDetailScreen';

import EventsScreen from './src/screens/EventsScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';

import SideMenu from './src/navigation/SideMenu.tsx';
import Map from './src/screens/Map.tsx';
import Home from './src/screens/Home.tsx';

import { EnrolledClassesProvider } from './src/context/EnrolledClassesContext';

const Stack = createNativeStackNavigator();

// Dev screenshot mode: bypass Auth0 and load the main app directly.
// This branch is for local portfolio screenshots only; keep main on the real Auth0 flow.
const RootNavigator = () => {
  return (
    <NavigationContainer>
      <>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Directory" component={DirectoryScreen} />
          <Stack.Screen name="DirectoryDetail" component={DirectoryDetailScreen} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="Classes" component={MyClassesScreen} />
          <Stack.Screen name="ClassSearch" component={ClassSearchScreen} />
          <Stack.Screen name="ClassSections" component={ClassSectionsScreen} />
          <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
          <Stack.Screen name="Events" component={EventsScreen} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
        </Stack.Navigator>
        <SideMenu />
      </>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ resolvedTheme }) => {
          const evaTheme = resolvedTheme === 'dark' ? eva.dark : eva.light;
          const customTheme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

          return (
            <ApplicationProvider {...eva} theme={{ ...evaTheme, ...customTheme }}>
              <SafeAreaProvider>
                <IconRegistry icons={EvaIconsPack} />
                <RecentlySearchedProvider>
                  <EnrolledClassesProvider>
                    <SideMenuProvider>
                      <RootNavigator />
                    </SideMenuProvider>
                  </EnrolledClassesProvider>
                </RecentlySearchedProvider>
              </SafeAreaProvider>
            </ApplicationProvider>
          );
        }}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
