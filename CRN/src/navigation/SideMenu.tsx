import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layout, Text, Button, Divider, Icon } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { SideMenuContext } from './SideMenuContext';

const NAV_ITEMS = [
  { label: 'Home',      route: 'Home',      icon: 'home-outline'   },
  { label: 'Map',       route: 'Map',       icon: 'map-outline'    },
  { label: 'Directory', route: 'Directory', icon: 'book-outline' },
];

const NavIcon = (name) => (props) => <Icon {...props} name={name} />;

const ANIM_DURATION = 130;

export default function SideMenu() {
  const { isOpen, closeMenu } = useContext(SideMenuContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const PANEL_WIDTH = Math.round(Dimensions.get('window').width * 0.4);

  const [visible, setVisible] = useState(isOpen);
  const slideAnim = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
    else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -PANEL_WIDTH,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    }
  }, [isOpen]);

  if (!visible) return null;

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
        flexDirection: 'row',
      }}
    >
      {/* Animated panel */}
      <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
        <Layout
          level="3"
          style={{
            width: PANEL_WIDTH,
            height: '100%',
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 12,
            paddingHorizontal: 8,
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
            paddingHorizontal: 4,
          }}>
            <Text category="h6">Navigation</Text>

          </View>

          <Divider style={{ marginBottom: 8 }} />

          {/* Nav items */}
          {NAV_ITEMS.map(({ label, route, icon }) => (
            <Button
              key={route}
              appearance="ghost"
              status="basic"
              size="large"
              accessoryLeft={NavIcon(icon)}
              onPress={() => goTo(route)}
              style={{
                justifyContent: 'flex-start',
                marginVertical: 2,
                paddingHorizontal: 0,
              }}
            >
              {label}
            </Button>
          ))}
        </Layout>
      </Animated.View>

      {/* Animated dim overlay */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
          activeOpacity={1}
          onPress={closeMenu}
        />
      </Animated.View>
    </View>
  );
}