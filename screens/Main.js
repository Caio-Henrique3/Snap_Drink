import React , { useEffect } from 'react';
import { Button, StyleSheet, Text, View , Image} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {auth, firestore} from './../components/Firebase'; 

import RoundButton from './../components/RoundButton';
import image from './../assets/icon.png';

export default function Main({ navigation }) {

  useEffect(() => {
    if (auth.currentUser)
      navigation.navigate("Menu");
  },[])

  return (
    <View style={styles.container}>
      <Image source={image} style={{width: 150, height: 150}}></Image>
      <Text style={styles.titulo}>Snapdrink</Text>
      <RoundButton title="Login" onPress={() => navigation.navigate("Login")}></RoundButton>
      <RoundButton title="Registrar" onPress={() => navigation.navigate("Registrar")}></RoundButton>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
  }
});
