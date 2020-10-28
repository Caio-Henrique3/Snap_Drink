import React, { createContext, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './screens/Main';
import Registrar from './screens/Registrar';
import Login from './screens/Login';
import Termos from './screens/Termos';
import Menu from './screens/Menu';

const Stack = createStackNavigator();
const user = createContext (null);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Snapdrink" component={Main} options={cabecalho('',false)}/>
        <Stack.Screen name="Registrar" component={Registrar} options={cabecalho('',false)}/>
        <Stack.Screen name="Login" component={Login} options={cabecalho('',false)}/>
        <Stack.Screen name="Termos" component={Termos} options={cabecalho('',false)}/>
        <Stack.Screen name="Menu" component={Menu} options={cabecalho('',false)}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function cabecalho( titulo, mostrar) {
  let opcao = {
    title: titulo,
    headerStyle: {
      backgroundColor: '#FF8C00',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: 'left',
      width: 'auto',
    }
  }

  if (!mostrar) {
    opcao.headerStyle.height = 0
    opcao.title = ''
  }

  return opcao
}
