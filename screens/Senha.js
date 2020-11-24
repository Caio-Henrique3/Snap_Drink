import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Button, TextInput, Image, Alert } from 'react-native';
import {auth, firestore} from './../components/Firebase'; 
import RoundButton from './../components/RoundButton';

export default function Senha ({ navigation }) {
    //VARIAVEIS
    const [login,setLogin] = useState('');
    const [erro,setErro] = useState('');
    
   //executa apenas quando os itens da lista forem "atualizados"
  
    
    function entrar( navigation) {
      if (login == "Teste") {
        navigation.navigate("Menu", { username: 'Caio', name: 'Caio Henrique', image: './../imagens/homem.png'})
        return
      }
      auth.signInWithEmailAndPassword(login,senha)
      //se logou com sucesso
      .then(
          dados => {
            navigation.navigate("Menu", { username: 'Caio', name: 'Caio Henrique', image: './../imagens/homem.png'})
          }
      )       
      //se deu erro
      .catch(
          e => {
              console.log(e)
              setErro(e.message)
          }
      )
    }

    return (
      <View style={styles.container}>
        <Text style={styles.textT}>Digite abaixo o endereço de E-mail para onde será enviado o formulário de redifinição de senha</Text>
        <TextInput value={login} style={styles.input} onChangeText={text => setLogin(text)} placeholder= "Digite seu E-mail"></TextInput> 
        <RoundButton title="Enviar" onPress={() => {
          auth.sendPasswordResetEmail(login) 
          Alert.alert("Enviado com sucesso", "Verifique sua caixa de e-mails")
          navigation.goBack()
        }} ></RoundButton>
        <RoundButton onPress={() => navigation.goBack()} title="Voltar"></RoundButton>
        </View>
    );
  
  }
  
  var styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: '#FF8C00',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textT: {
      fontFamily: 'Lobster_400Regular',
      fontSize: 20,
      padding: 12,
      textAlign: 'center',
    },
    input: {
        backgroundColor: '#D3D3D3',
        minWidth: 350,
        marginTop: 10,
        marginBottom: 20,
        padding: 16,
        borderRadius:32,
    },coluna: {
        //flexDirection: 'row',
        maxWidth: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
  });