import React, { useContext } from 'react';
import { TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SideMenuContext } from './SideMenuContext';

const MenuIcon = (props: any) => <Icon {...props} name="menu-outline" />;
const PersonIcon = (props: any) => <Icon {...props} name="person-outline" />;
const BackIcon = (props: any) => <Icon {...props} name="arrow-back-outline" />;

type AppHeaderProps = {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    showAccount?: boolean;
    rightAction?: React.ReactElement; // <-- 1. Good! It's on the guest list.
};

// 2. We must destructure 'rightAction' here so the component can actually use it!
export const AppHeader = ({ title = '', showBack = false, onBack, showAccount = true, rightAction }: AppHeaderProps) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation() as any;
    const { openMenu, closeMenu } = useContext(SideMenuContext);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            closeMenu();
            navigation.goBack();
        }
    };

    const LeftAction = () => showBack
        ? <TopNavigationAction icon={BackIcon} onPress={handleBack} />
        : <TopNavigationAction icon={MenuIcon} onPress={openMenu} />;

    // 3. Update the logic: If a custom rightAction (like your ThemeToggle) is passed in, use it!
    // Otherwise, fall back to the default PersonIcon.
    const renderRightAccessory = () => {
        if (rightAction) {
            return rightAction;
        }
        if (showAccount) {
            return <TopNavigationAction icon={PersonIcon} onPress={() => navigation.navigate('Account')} />;
        }
        return <></>;
    };

    return (
        <View style={{ paddingTop: insets.top }}>
            <TopNavigation
                title={title}
                alignment="center"
                accessoryLeft={<LeftAction />}
                accessoryRight={renderRightAccessory} // <-- 4. Pass the new logic here!
            />
        </View>
    );
};