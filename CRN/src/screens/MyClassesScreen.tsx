import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text, Icon, useTheme } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../navigation/AppHeader';
import Button from '../components/Button';

const PlusIcon = (props) => <Icon {...props} name="plus-outline" />;
const BookIcon = (props) => <Icon {...props} name="book-open-outline" />;

export default function MyClassesScreen() {
  const navigation = useNavigation();
  const theme      = useTheme();

  return (
    <Layout level="2" style={styles.root}>
      <AppHeader
        title="My Classes"
        accessoryRight={() => (
          <Button
            appearance="ghost"
            status="primary"
            accessoryLeft={PlusIcon}
            onPress={() => navigation.navigate('ClassSearch')}
          />
        )}
      />

      <View style={styles.emptyState}>
        <BookIcon style={styles.emptyIcon} fill={theme['text-hint-color']} />
        <Text category="s1" appearance="hint">No classes added yet</Text>
        <Text category="c1" appearance="hint" style={{ marginTop: 4, marginBottom: 20 }}>
          Tap + to search and add classes
        </Text>
        <Button
          accessoryLeft={PlusIcon}
          onPress={() => navigation.navigate('ClassSearch')}
        >
          Browse Classes
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon:  { width: 56, height: 56, marginBottom: 12 },
});
