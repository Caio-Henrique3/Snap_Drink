import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import Feed from '../components/Feed';
import Configuracoes from './Configuracoes';
import Perfil from './Perfil';
import Mercado from './Mercado';
import OtherScreen from './OtherScreen';

const Tab = createMaterialTopTabNavigator();

export default function Menu({ route, navigation }) {

  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Mercado" component={Mercado} />
      <Tab.Screen name="Perfil">
        {() => <Perfil/>}
      </Tab.Screen>
      <Tab.Screen name="Configuracoes" component={Configuracoes} />
    </Tab.Navigator>
  );
}