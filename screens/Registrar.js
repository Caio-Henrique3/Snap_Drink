import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, Alert, ScrollView } from 'react-native';
import {auth, firestore} from './../components/Firebase';
import RoundButton from './../components/RoundButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function Registrar({ navigation }) {
    //Variaveis
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [login, setLogin] = useState("");
    const [nome, setNome] = useState("");
    const [data, setData] = useState("");
    const [erro,setErro] = useState("");
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

    function registrar( navigation ) {
        if (email == "" || senha == "") {
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
                firestore.collection("Usuarios").doc(auth.currentUser.uid).set(
                  {
                    nome: nome,
                    username: login,
                    imagem_perfil: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTKRCfg2xIu9yLGDGiAXcw56FM5zjIvvCPsfQ&usqp=CAU',
                    data: `${date.getUTCDay()}/${date.getMonth()}/${date.getFullYear()}`,
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
        <ScrollView style={{flex: 1, backgroundColor: '#FF8C00', paddingVertical: 40}}>
        <View style={styles.container}>
            <Text style={styles.textT} >Nome e sobrenome</Text>
            <TextInput style={styles.input} onChangeText={text => setLogin(text)} placeholder= "ex: Pedro Henrique ou Maria Eduarda"></TextInput> 
            <Text style={styles.textT} >E-mail</Text> 
            <TextInput style={styles.input} onChangeText={text => setEmail(text)} placeholder= "ex: pedro_henrique@hotmail.com"></TextInput> 
            <Text style={styles.textT} >Nome de usuário</Text> 
            <TextInput style={styles.input} onChangeText={text => setNome(text)} placeholder= "ex: Pedro_Henrique"></TextInput>
            <Text style={styles.textT}>Data de Nascimento:</Text>
            <TouchableOpacity style={styles.data} onPress={showDatepicker}>
              <Text style={{color: "#000"}}>
                {`${date.getUTCDay()>9?date.getUTCDay():'0'+date.getUTCDay()}/${date.getMonth()>9?date.getMonth():'0'+date.getMonth()}/${date.getFullYear()}`}
              </Text>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
            <Text style={styles.textT}>Senha</Text>  
            <TextInput style={styles.input} secureTextEntry={true} onChangeText={text => setSenha(text)} placeholder= "********"></TextInput> 
            <Text style={styles.textT} >Confirme senha</Text>  
            <TextInput style={styles.input} secureTextEntry={true} onChangeText={text => setConfirmaSenha(text)} placeholder= "********"></TextInput> 
            <Text style={{color: 'white', backgroundColor:'red', padding:3}}>{erro}</Text>
            <RoundButton style={styles.textT} title="Próximo" onPress={() => registrar(navigation)}></RoundButton>
            <RoundButton onPress={() => navigation.goBack()} title="Voltar"></RoundButton>
        </View>
        </ScrollView>
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
    textT: {
      fontFamily: 'Lobster_400Regular',
      height: 35,
      fontSize: 24,
      padding: 1,
      //marginTop: 5,
    },
    data: {
      backgroundColor: '#D3D3D3',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 32,
      padding: 12,
      margin: 6,
    }
});