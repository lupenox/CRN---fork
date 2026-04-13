import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

// UI Kitten & Eva Design
import { ApplicationProvider, IconRegistry, Layout } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { lightTheme, darkTheme } from './src/theme/customTheme.ts';
import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext.tsx';

// Navigation & Safe Area
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Auth0
import { Auth0Provider, useAuth0 } from 'react-native-auth0';

// Context Providers
import { SideMenuProvider } from './src/navigation/SideMenuContext.tsx';
import { RecentlyViewedProvider } from './src/context/RecentlyViewedContext';

// Screens
import DirectoryScreen from './src/screens/DirectoryScreen.tsx';
import DirectoryDetailScreen from './src/screens/DirectoryDetailScreen.tsx';
import Account from './src/screens/Account.tsx';
import Login from './src/screens/Login.tsx';
// SignUp intentionally omitted (Handled by Auth0 Universal Login)

import MyClassesScreen     from './src/screens/MyClassesScreen';
import ClassSearchScreen   from './src/screens/ClassSearchScreen';
import ClassSectionsScreen from './src/screens/ClassSectionsScreen';
import ClassDetailScreen   from './src/screens/ClassDetailScreen';

import EventsScreen        from './src/screens/EventsScreen';
import EventDetailScreen   from './src/screens/EventDetailScreen';

import SideMenu from './src/navigation/SideMenu.tsx';
import Map from './src/screens/Map.tsx';
import Home from './src/screens/Home.tsx';

const Stack = createNativeStackNavigator();

// 1. Create a Root Navigator to handle the Auth0 conditional logic
const RootNavigator = () => {
  const { user, isLoading } = useAuth0();

  // Show a loading spinner while Auth0 checks for a saved session
  if (isLoading) {
    return (
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
      </Layout>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        // MAIN APP: User is logged in
        <>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home"            component={Home}                  />
            <Stack.Screen name="Directory"       component={DirectoryScreen}       />
            <Stack.Screen name="DirectoryDetail" component={DirectoryDetailScreen} />
            <Stack.Screen name="Account"         component={Account}               />
            <Stack.Screen name="Map"             component={Map}                   />
            <Stack.Screen name="Classes"         component={MyClassesScreen}       />
            <Stack.Screen name="ClassSearch"     component={ClassSearchScreen}     />
            <Stack.Screen name="ClassSections"   component={ClassSectionsScreen}   />
            <Stack.Screen name="ClassDetail"     component={ClassDetailScreen}     />
            <Stack.Screen name="Events"          component={EventsScreen}          />
            <Stack.Screen name="EventDetail"     component={EventDetailScreen}     />
          </Stack.Navigator>
          <SideMenu />
        </>
      ) : (
        // AUTHENTICATION: User is logged out
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

// 2. Wrap the app using the team's GitHub structure + Auth0
export default function App() {
  return (
    <Auth0Provider 
      domain="dev-85gf7oggpaitwy0i.us.auth0.com" 
      clientId="VpyvzewB5JqS7K8WVfbBHPyh1xoPX70i"
    >
      <ThemeProvider>
        {/* Using the GitHub branch's ThemeContext.Consumer pattern */}
        <ThemeContext.Consumer>
          {({ resolvedTheme }) => {
            const evaTheme    = resolvedTheme === 'dark' ? eva.dark : eva.light;
            const customTheme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

            return (
              <ApplicationProvider {...eva} theme={{ ...evaTheme, ...customTheme }}>
                <SafeAreaProvider>
                  <IconRegistry icons={EvaIconsPack} />
                  
                  {/* New RecentlyViewedProvider added here */}
                  <RecentlyViewedProvider>
                    <SideMenuProvider>
                      <RootNavigator />
                    </SideMenuProvider>
                  </RecentlyViewedProvider>

                </SafeAreaProvider>
              </ApplicationProvider>
            );
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>
    </Auth0Provider>
  );
}