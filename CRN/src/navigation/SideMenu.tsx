import React, { useContext } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { Layout, Text, Button, Divider } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SideMenuContext } from './SideMenuContext';

export default function SideMenu() {
  const { isOpen, closeMenu } = useContext(SideMenuContext);
  const navigation = useNavigation();

  if (!isOpen) return null;

  const SCREEN_W = Dimensions.get('window').width;
  const PANEL_WIDTH = Math.round(SCREEN_W * 0.4);

  function goTo(route) {
    closeMenu();
    navigation.navigate(route);
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        zIndex: 1000,
        flexDirection: 'row'
      }}
    >
      <Layout style={{ width: PANEL_WIDTH, height: '100%', padding: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text category="h6">Menu</Text>

          {/* Account Icon */}
          <TouchableOpacity onPress={() => goTo('Account')}>
            <Ionicons name="person-circle-outline" size={28} />
          </TouchableOpacity>
        </View>


        <Divider style={{ marginVertical: 10 }} />

        <Button appearance="ghost" onPress={() => goTo('Directory')}>
          Directory
        </Button>

        {/* add more items as needed */}
      </Layout>

      {/* Right overlay, semi transparent, closes on press */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}
        activeOpacity={1}
        onPress={closeMenu}
      />
    </View>
  );
}