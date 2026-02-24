import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SideMenuContext } from './SideMenuContext';

export default function MenuButton()
{
    const { toggleMenu } = useContext(SideMenuContext);
    return(
        <TouchableOpacity onPress={toggleMenu} style={{ paddingHorizontal: 6}}>
            <Ionicons name="menu-outline" size={24} />
        </TouchableOpacity>
   );
}