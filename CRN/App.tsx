import * as React from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { lightTheme, darkTheme } from './src/theme/customTheme.ts';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DirectoryScreen from './src/screens/DirectoryScreen.tsx';
import DirectoryDetailScreen from './src/screens/DirectoryDetailScreen.tsx';
import Account from './src/screens/Account.tsx';
import Login from './src/screens/Login.tsx';
import SignUp from './src/screens/SignUp.tsx';

import MyClassesScreen     from './src/screens/MyClassesScreen';
import ClassSearchScreen   from './src/screens/ClassSearchScreen';
import ClassSectionsScreen from './src/screens/ClassSectionsScreen';
import ClassDetailScreen   from './src/screens/ClassDetailScreen';

import { SideMenuProvider } from './src/navigation/SideMenuContext.tsx';
import SideMenu from './src/navigation/SideMenu.tsx';
import Map from './src/screens/Map.tsx';
import Home from './src/screens/Home.tsx';

import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext.tsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ resolvedTheme }) => {
          const evaTheme    = resolvedTheme === 'dark' ? eva.dark : eva.light;
          const customTheme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

          return (
            <ApplicationProvider {...eva} theme={{ ...evaTheme, ...customTheme }}>
              <SafeAreaProvider>
                <IconRegistry icons={EvaIconsPack} />
                <SideMenuProvider>
                  <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="Login"           component={Login}                 />
                      <Stack.Screen name="Home"            component={Home}                  />
                      <Stack.Screen name="Directory"       component={DirectoryScreen}       />
                      <Stack.Screen name="SignUp"          component={SignUp}                />
                      <Stack.Screen name="DirectoryDetail" component={DirectoryDetailScreen} />
                      <Stack.Screen name="Account"         component={Account}               />
                      <Stack.Screen name="Map"             component={Map}                   />
                      <Stack.Screen name="Classes"         component={MyClassesScreen}       />
                      <Stack.Screen name="ClassSearch"     component={ClassSearchScreen}     />
                      <Stack.Screen name="ClassSections"   component={ClassSectionsScreen}   />
                      <Stack.Screen name="ClassDetail"     component={ClassDetailScreen}     />
                    </Stack.Navigator>
                    <SideMenu />
                  </NavigationContainer>
                </SideMenuProvider>
              </SafeAreaProvider>
            </ApplicationProvider>
          );
        }}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}