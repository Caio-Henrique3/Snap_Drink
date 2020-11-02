import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Button, TextInput, Image, Alert } from 'react-native';
import {auth, firestore} from './../components/Firebase'; 
import RoundButton from './../components/RoundButton';

export default function Login({ navigation }) {
  //VARIAVEIS
  const [login,setLogin] = useState('');
  const [senha,setSenha] = useState('');
  const [erro,setErro] = useState('');
  
 //executa apenas quando os itens da lista forem "atualizados"

  
  function entrar( navigation) {
    if (login === "" || senha === "") {
      return
    }
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
  
  function registrar() {
    //ir para outra tela
    navigation.navigate('Registrar')
  }

  return (
    <View style={styles.container}>
      <Image></Image>
      <Text>E-mail</Text>
      <TextInput value={login} style={styles.input} onChangeText={text => setLogin(text)} placeholder= "caio@hotmail.com"></TextInput> 
      <Text>Senha</Text>
      <TextInput value={senha} style={styles.input} secureTextEntry={true} onChangeText={text => setSenha(text)} placeholder= "********"></TextInput> 
      <TouchableOpacity onPress={() => navigation.navigate("Senha")}><Text>Esqueceu sua senha?</Text></TouchableOpacity>
      <RoundButton title="Login" onPress={() => { entrar( navigation ) }} ></RoundButton>
      <Text>Ou se conecte com</Text>
      <View style={styles.coluna}>
      <RoundButton title="Facebook" color="#3b5998" onPress={() => {}}></RoundButton>
      <RoundButton title="Google" color="red" onPress={() => {}}></RoundButton>
      <RoundButton onPress={() => navigation.goBack()} title="Voltar"></RoundButton>
      </View>
      <Text style={{color: 'white', backgroundColor:'red', padding:3}}>{erro}</Text>
      <StatusBar style="auto" />
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
  input: {
    backgroundColor: '#D3D3D3',
    minWidth: 350,
    marginTop: 10,
    padding: 16,
    borderRadius:32,  },
  coluna: {
      //flexDirection: 'row',
      maxWidth: '100%',
      alignItems: 'center',
      justifyContent: 'center',
  }
});