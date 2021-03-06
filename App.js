import React, { createContext } from 'react';
import {AppLoading} from 'expo';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Roboto_400Regular,Roboto_700Bold, Lobster_400Regular, useFonts } from '@expo-google-fonts/lobster'

import Main from './screens/Main';
import Registrar from './screens/Registrar';
import Termos from './screens/Termos';
import Login from './screens/Login';
import Senha from './screens/Senha';
import Menu from './screens/Menu';

const Stack = createStackNavigator();
const user = createContext (null);

export default function App() {
  let [fontsloaded] = useFonts({
    Lobster_400Regular,
  });

  if (!fontsloaded) {
    return <AppLoading />
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Snapdrink" component={Main} options={cabecalho('',false)}/>
          <Stack.Screen name="Registrar" component={Registrar} options={cabecalho('',false)}/>
          <Stack.Screen name="Termos" component={Termos} options={cabecalho('',false)}/>
          <Stack.Screen name="Login" component={Login} options={cabecalho('',false)}/>
          <Stack.Screen name="Senha" component={Senha} options={cabecalho('',false)}/>
          <Stack.Screen name="Menu" component={Menu} options={cabecalho('',false)}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
 }
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
      marginTop: Constants.statusBarHeight,
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
