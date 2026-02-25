import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@ui-kitten/components';
import { SideMenuContext } from './SideMenuContext';

export default function MenuButton()
{
    const { toggleMenu } = useContext(SideMenuContext);
    return(
        <TouchableOpacity onPress={toggleMenu} style={{ paddingHorizontal: 6}}>
            <Icon name="menu-outline" style={{ width: 24, height: 24}} fill="#222B45"/>
        </TouchableOpacity>
   );
}