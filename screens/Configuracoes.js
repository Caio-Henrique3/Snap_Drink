import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import RoundButton from './../components/RoundButton';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';

import { auth, firestore, storage } from './../components/Firebase'; 
import { Venda } from './../components/Venda';
import { TextInput } from 'react-native-paper';

import * as ImagePicker from 'expo-image-picker';

const Stack = createStackNavigator();

export default function Configuracoes() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Configurações" component={({ navigation }) => { 
        return(
          <View style={styles.container}>
            <RoundButton title="Meus Pedidos" onPress={() => {navigation.navigate("Meus Pedidos")}}></RoundButton>
            <RoundButton title="Anuncie seu produto" onPress={() => {navigation.navigate("Anuncie seu produto")}}></RoundButton>
            <RoundButton title="Convide um amigo" onPress={() => {navigation.navigate("Convide amigos")}}></RoundButton> 
            <RoundButton title="Suporte" onPress={() => {navigation.navigate("Suporte")}}></RoundButton> 
            <RoundButton title="Sobre este aplicativo e nossa Empresa" onPress={() => {navigation.navigate("Sobre")}}></RoundButton>       
            <RoundButton title="Deslogar Conta" onPress={() => {navigation.navigate("Sair App")}}></RoundButton>
          </View>
        )
      }}options={cabecalho('',false)}/>
      <Stack.Screen name="Meus Pedidos" component={Pedido} options={cabecalho('',false)}/>
      <Stack.Screen name="Anuncie seu produto" component={Empresa} options={cabecalho('',false)}/>
      <Stack.Screen name="Convide amigos" component={Convidar} options={cabecalho('',false)}/>
      <Stack.Screen name="Suporte" component={Suporte} options={cabecalho('',false)}/>
      <Stack.Screen name="Sobre" component={Sobre} options={cabecalho('',false)}/>
      <Stack.Screen name="Sair App" component={Sair} options={cabecalho('',false)}/>
      <Stack.Screen name="Anuncio" component={Anuncio} options={cabecalho('',false)}/>
    </Stack.Navigator>
  );
}

function Pedido({ navigation }) {
  return (
  <View style={styles.container}>
    <Text>PEDIDO</Text>
    <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
  </View>
);}

function Anuncio({ navigation }) {

  const [user, setUser] = useState(null)
  const [titulo, setTitulo] = useState('')
  const [legenda, setLegenda] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preço, setPreço] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [imagem, setImagem] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged((usr) => {
      if (usr) {
        //se estiver authenticado usr é o usuário logado
        var docRef = firestore.collection("Usuarios").doc(`${usr.uid}`);

        docRef.get().then(u => {
          setUser({uid: usr.uid, ...u.data()})
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      }
      else {
        //não está logado
        setUser(null)
      }
    }) 
  }, [])

  function uriToBlob(uri) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
      };
      
      xhr.onerror = function() {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };
      // this helps us get a blob
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      
      xhr.send(null);
    });
  }

  async function handleImagem() {
    //inicia o "pegador" de imagens
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    //permissao de acesso
    if (status !== 'granted') {
      alert('Eita, precisamos de acesso às suas fotos...');
      return;
    }

    //resultado (await = esperar)
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })
    // caso cancelou o upload
    if (result.cancelled) {
      return;
    }

    //teste
    const { uri } = result;
    console.log(result.uri)

    const blob = await uriToBlob(result.uri)
    setImagem(blob)    
  }

  async function enviar() {
    //validar
    if (!imagem | titulo == '' || legenda == '' || preço == '' || quantidade == '') {
      Alert.alert('Inválido', "Preencha todos os campos e selecione uma imagem!")
      return
    }
    
    //criar a venda
    var vendaId = '';

    //criar o post
    await firestore.collection("Vendas").add({
      Titulo: titulo,
      Legenda: legenda,
      Preço: preço,
      Quantidade: quantidade,
      Uid: user.uid,
      Data: Date.now(),
    })
    .then(function(docRef) {
      vendaId=docRef.id
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
      return
    })

    console.log(vendaId);
    const task = storage.ref(`/${vendaId}`).put(imagem);

    try {
      await task;
      let link = await storage.ref(`/${vendaId}`).getDownloadURL()
      firestore.collection('Vendas').doc(vendaId).update({ Imagem: link})
    } catch (e) {
      console.error(e);
    }

    Alert.alert("Enviado", "Seu anuncio foi enviado com sucesso!")

    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Text>Novo anúncio</Text>
      <Text>Título do anuncio</Text>    
      <TextInput style={{ width:'100%'}} placeholder={"ex: Suco de laranja"} onChangeText={text => setTitulo(text)}></TextInput>
      <Text>Descrição do anuncio</Text>
      <TextInput style={{ width:'100%'}} placeholder = {"ex: Suco natural..."} onChangeText={text => setLegenda(text)}></TextInput>
      <Text>Preço do produto</Text>
      <TextInput style={{ width:'100%'}} placeholder = {"ex: R$ 10.00"} onChangeText={text => setPreço(text)}></TextInput>
      <Text>Quantidade do produto</Text>
      <TextInput style={{ width:'100%'}} placeholder = {"ex: 1000 ml"} onChangeText={text => setQuantidade(text)}></TextInput>
      <RoundButton title="Adicionar imagens do produto" onPress={handleImagem}></RoundButton>
      <RoundButton title="Enviar Anúncio" onPress={enviar}></RoundButton>
      <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
    </View>
  );
}

function Empresa({ navigation }) {
  
  const [user, setUser] = useState(null)
  const [vendas, setVendas] = useState([])

  useEffect(() => {
    auth.onAuthStateChanged((usr) => {
      if (usr) {
        //se estiver authenticado usr é o usuário logado
        var docRef = firestore.collection("Usuarios").doc(`${usr.uid}`);

        docRef.get().then(u => {
          setUser({uid: usr.uid, ...u.data()})
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      }
      else {
        //não está logado
        setUser(null)
      }
    })

    firestore.collection('Vendas').where('Uid','==',auth.currentUser.uid).onSnapshot(
      function(querySnapshot) {
        let data = []
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            data.push({id:doc.id, ...doc.data()})
        });
        setVendas(data)
        console.log(data)
    })  
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{backgroundColor: 'black'}} onPress={() => {
        navigation.navigate('Anuncio');
      }}>
          <Text style={{color: '#fff', paddingHorizontal: 18, paddingVertical:12}}>Novo anúncio ➕</Text>
      </TouchableOpacity>
      <ScrollView>
          {vendas.map(item => <Venda
            titulo={item.Titulo}
            id={item.id}
            uid={item.Uid}
            legenda={item.Legenda}
            preco={item.Preço}
            quantidade={item.Quantidade}
            remove={true}
            key={item.id}
            imagem={item.Imagem}
            showComprar={false}
            onRemove={() => {
              console.log('remover')
            }}
            onComprar={() => Linking.openURL(item.Link) }/>
          )}
      </ScrollView>
      <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
    </View>
  );
}

function Convidar({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>CONVIDE UM AMIGO</Text>
      <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
    </View>
  );
}

function Suporte({ navigation }) {
  return (
  <View style={styles.container}>
    <Text>Direcionamento de Suporte</Text>
    <RoundButton title="Possível problema 1" onPress={() => {}}></RoundButton>
    <RoundButton title="Possível problema 2" onPress={() => {}}></RoundButton>
    <RoundButton title="Possível problema 3" onPress={() => {}}></RoundButton>
    <RoundButton title="Possível problema 4" onPress={() => {}}></RoundButton>
    <RoundButton title="Possível problema 5" onPress={() => {}}></RoundButton>
    <RoundButton title="Possível problema 6" onPress={() => {}}></RoundButton>
    <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
  </View>
);}

//style={{fontSize:16, lineHeight: 37, maxWidth: 180}}

function Sobre({ navigation }) {
  return (
  <View style={styles.container}>
    <Text style={styles.textT} >A CHMSoftware apresenta neste trabalho um aplicativo formulado para a comercialização de bebidas,
      onde estamos disposotos a atender do menor vendedor de um suco ao maior vendedor de uma grande fraquia
      de vinhos ou champagne. Basicamente ele atende aos interesses de obviamente quem busca vender seus produtos
      e gerar notoriedade com eles, até o usuário e comprador final das bebidas comercializadas aqui, contando com
      uma plataforma de uso com fácil aprednizagem para começar logo a comprar produtos de seu interesse,
      comunicação direta com os vendedores da mesma para qualquer tipo de problema que possa ser gerado nessa venda
      e também comunicação com nosso sistema, podendo relatar qualquer tipo de problema no próprio aplicativo, até
      algum abuso cometido por partes de outros usuários ou até mesmo vendedores.
      Esta é o primeiro aplicativo posto para exibição da CHMSoftware, porém temos vários protópios ainda em desenvolvimento
      que buscam atender à praticidade dos usuários, que é o principal objetivo que nossa empresa busca cumprir para com 
      o desenvolvimento de seus trabalhos direcionados ao público. Ficou curioso para conhecer nossos próximos projetos?
      Acesse nosso site e saiba muito mais sobre nossa empresa e sobre nossos trabalhos (LINK DO SITE...)
      E se você tem interesse em solicitar um desenvolvimento específico para sua empresa também fale conosco, nos mande
      uma mensagem no nosso WhatsApp (99) 9 9999 - 9999 ou acesse também nosso site!!!
    </Text>
    <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
  </View>
);}

function Sair({ navigation }) {
  return (
  <View style = {styles.container}>
        <Text>Ao clicar no botão "Deslogar" você irá encerrar sua sessão de uso</Text>
        <View style={styles.coluna}>
          <RoundButton title="Deslogar" onPress={() => {
            auth.signOut();
            navigation.navigate("Snapdrink")
          }} width={150}></RoundButton>
          <RoundButton title="Voltar" onPress={() => navigation.goBack()} width={150}></RoundButton>
        </View>
  </View>
);}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 16,
  },
  input: {
    backgroundColor: '#D3D3D3',
    color: '#4F4F4F',
    padding: 4,
    borderRadius:32,  
},
  coluna: {
    backgroundColor: '#FF8C00',
    //flex: 1,
    flexDirection: 'row',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
},
textT: {
  fontFamily: 'Lobster_400Regular',
  height: 'auto',
  fontSize: 15,
  margin: 12,
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