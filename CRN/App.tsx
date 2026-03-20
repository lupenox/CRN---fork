import * as React from 'react';
import { useColorScheme, ActivityIndicator, View } from 'react-native';

// UI Kitten & Eva Design
import { ApplicationProvider, IconRegistry, Layout } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { lightTheme, darkTheme } from './src/theme/customTheme.ts';

// Navigation & Safe Area
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Auth0
import { Auth0Provider, useAuth0 } from 'react-native-auth0';

// Screens & Context
import DirectoryScreen from './src/screens/DirectoryScreen.tsx';
import DirectoryDetailScreen from './src/screens/DirectoryDetailScreen.tsx';
import Account from './src/screens/Account.tsx';
import Login from './src/screens/Login.tsx';
import SignUp from './src/screens/SignUp.tsx';

import MyClassesScreen from './src/screens/MyClassesScreen.tsx';
import ClassSearchScreen  from './src/screens/ClassSearchScreen.tsx';
import ClassSectionsScreen from './src/screens/ClassSectionsScreen.tsx';
import ClassDetailScreen  from './src/screens/ClassDetailScreen.tsx';

import { SideMenuProvider } from './src/navigation/SideMenuContext.tsx';
import SideMenu from './src/navigation/SideMenu.tsx';
import Map from './src/screens/Map.tsx';
import Home from './src/screens/Home.tsx';

const Stack = createNativeStackNavigator();

// 1. Create a Root Navigator to handle the conditional logic
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
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="Directory" component={DirectoryScreen} options={{ title: 'Directory of UWM Resources' }} />
            <Stack.Screen name="DirectoryDetail" component={DirectoryDetailScreen} />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Classes"          component={MyClassesScreen}     />
            <Stack.Screen name="ClassSearch"      component={ClassSearchScreen}     />
            <Stack.Screen name="ClassSections"    component={ClassSectionsScreen}   />
            <Stack.Screen name="ClassDetail"      component={ClassDetailScreen}     />
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

// 2. Wrap the entire app in the Providers
export default function App() {
  const systemTheme = useColorScheme() ?? 'light';
  const evaTheme = systemTheme === 'dark' ? eva.dark : eva.light;
  const customTheme = systemTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <Auth0Provider 
      domain="dev-85gf7oggpaitwy0i.us.auth0.com" 
      clientId="VpyvzewB5JqS7K8WVfbBHPyh1xoPX70i"
    >
      <ApplicationProvider {...eva} theme={{ ...evaTheme, ...customTheme }}>
        <SafeAreaProvider>
          <IconRegistry icons={EvaIconsPack} />
          <SideMenuProvider>
            <RootNavigator />
          </SideMenuProvider>
        </SafeAreaProvider>
      </ApplicationProvider>
    </Auth0Provider>
  );
}
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
