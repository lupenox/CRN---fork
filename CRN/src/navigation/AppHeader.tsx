import React, { useContext } from 'react';
import { TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SideMenuContext } from './SideMenuContext';

const MenuIcon = (props) => <Icon {...props} name="menu-outline" />;
const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;

type AppHeaderProps = {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    showAccount?: boolean;
};

export const AppHeader = ({ title = '', showBack = false, onBack, showAccount = true }: AppHeaderProps) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
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

    const RightAction = () => showAccount
        ? <TopNavigationAction icon={PersonIcon} onPress={() => navigation.navigate('Account')} />
        : null;

    return (
        <View style={{ paddingTop: insets.top }}>
            <TopNavigation
                title={title}
                alignment="center"
                accessoryLeft={<LeftAction />}
                accessoryRight={<RightAction />}
            />
        </View>
    );
};