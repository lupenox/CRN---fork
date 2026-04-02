import React from 'react';
import { StyleSheet, View } from 'react-native';
import { 
  Layout, 
  Text, 
  Icon, 
  TopNavigationAction, // <-- Make sure this is imported
  Card,
  Avatar,
  Divider,
  Button
} from '@ui-kitten/components';
import { useAuth0 } from 'react-native-auth0'; 
import { AppHeader } from '../navigation/AppHeader';
import { useAppTheme } from '../theme/ThemeContext';

export default function Account() {
  const { resolvedTheme, setMode } = useAppTheme();
  const { user, clearSession } = useAuth0(); 

  const isDark = resolvedTheme === 'dark';

  const handleLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // 1. Create the toggle button exactly like your teammate had it
  const ThemeToggle = (
    <TopNavigationAction
      icon={(props: any) => <Icon {...props} name={isDark ? "sun-outline" : "moon-outline"} />}
      onPress={() => setMode(isDark ? 'light' : 'dark')}
    />
  );

  return (
    <Layout style={{ flex: 1 }}>
      {/* 2. Pass it using their custom 'rightAction' prop! */}
      <AppHeader title="Account Settings" rightAction={ThemeToggle} />
      
      <View style={styles.container}>
        {/* Profile Info */}
        <Card style={styles.card}>
          <View style={styles.profileHeader}>
            <Avatar 
              size="giant" 
              source={{ uri: user?.picture || 'https://via.placeholder.com/150' }} 
            />
            <View style={styles.profileInfo}>
              <Text category="h5">{user?.name || 'Campus Navigator'}</Text>
              <Text category="s1" appearance="hint">{user?.email || 'No email provided'}</Text>
            </View>
          </View>
        </Card>

        <Divider style={styles.divider} />

        {/* Logout Button */}
        <Button status="danger" style={styles.logoutBtn} onPress={handleLogout}>
          Log Out
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  card: { marginBottom: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  profileInfo: { marginLeft: 16 },
  divider: { marginVertical: 10 },
  logoutBtn: { marginTop: 'auto', marginBottom: 20 },
});