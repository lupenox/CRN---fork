import * as React from 'react';
import { ApplicationProvider, Button, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './src/theme/customTheme.ts';

export default function App() {

	const systemTheme = useColorScheme() ?? 'light';
	const evaTheme = systemTheme === 'dark'? eva.dark : eva.light;
	const customTheme = systemTheme === 'dark'? darkTheme : lightTheme;

  return (
    <ApplicationProvider {...eva} theme={{...evaTheme, ...customTheme}}>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text category="h1">App.tsx</Text>
		<Button>UI Kitten Button</Button>
      </Layout>
    </ApplicationProvider>
  );
}
