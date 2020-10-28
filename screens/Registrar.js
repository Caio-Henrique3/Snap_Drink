import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, Alert } from 'react-native';
import {auth, firestore} from './../components/Firebase';
import RoundButton from './../components/RoundButton';


export default function Registrar({ navigation }) {
    //Variaveis
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [login, setLogin] = useState("");
    const [telefone, setTelefone] = useState("");
    const [erro,setErro] = useState("");

    function registrar( navigation ) {
        if (email === "" || senha === "") {
            return
          }
          if (email == "Teste" && senha == "Teste") {
            navigation.navigate("Termos")
            return
          }
          auth.createUserWithEmailAndPassword(email,senha)
          //se logou com sucesso
          .then(
              dados => {
                firestore.collection("Usuarios").doc(dados.user.uid).set(
                  {
                    nome: nome,
                    username: username,
                    data: data,
                    imagem_perfil: 'https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png',
                  }
                ).catch(erro => console.log(erro))
                navigation.navigate("Termos")
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

    return(
        <View style={styles.container}>
            <Text>E-mail</Text> 
            <TextInput style={styles.input} onChange={event => setEmail(event.target.value)} placeholder= "ex: caio@hotmail.com"></TextInput> 
            <Text>Nome de usuário</Text> 
            <TextInput style={styles.input} onChange={event => setLogin(event.target.value)} placeholder= "ex: Juca Biloba"></TextInput> 
            <Text>Telefone</Text> 
            <TextInput style={styles.input} onChange={event => setTelefone(event.target.value)} placeholder= "ex: (99) 9 9999 - 9999"></TextInput>
            <Text>Senha</Text>  
            <TextInput style={styles.input} secureTextEntry={true} onChange={event => setSenha(event.target.value)} placeholder= "********"></TextInput> 
            <Text>Confirme senha</Text>  
            <TextInput style={styles.input} secureTextEntry={true} onChange={event => setConfirmaSenha(event.target.value)} placeholder= "********"></TextInput> 
            <Text style={{color: 'white', backgroundColor:'red', padding:3}}>{erro}</Text>
            <RoundButton title="Próximo" onPress={() => registrar(navigation)}></RoundButton>
            <RoundButton onPress={() => navigation.goBack()} title="Voltar"></RoundButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FF8C00',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
        backgroundColor: '#D3D3D3',
        color: '#4F4F4F',
        minWidth: 350,
        marginTop: 10,
        padding: 16,
        borderRadius:32,  
    },
});