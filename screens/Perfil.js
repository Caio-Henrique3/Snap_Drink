import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, ScrollView, Text, View, Alert } from 'react-native';
import {auth, firestore, storage} from './../components/Firebase'; 
import RoundButton from './../components/RoundButton';
import * as ImagePicker from 'expo-image-picker';

const options = {
  title: 'Selecione uma imagem para o perfil',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}; 

export default function Perfil({ navigation }) {

  const [user, setuser] = useState(null);
  const [link, setLink] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTKRCfg2xIu9yLGDGiAXcw56FM5zjIvvCPsfQ&usqp=CAU');
  const [upload, setUpload] = useState(null);
  const [posts, setPosts] = React.useState([])

  useEffect (() => {
    //pegar dados dod usuario
    firestore.collection("Usuarios").doc(auth.currentUser.uid).onSnapshot(snapshot => {
      setuser({uid:auth.currentUser.uid, ...snapshot.data()})
      console.log(user)
      storage.ref(`Profile/${auth.currentUser.uid}`).getDownloadURL().then(url => setLink(url))
    })


    //atualiza os post dos usuários
    firestore.collection('Posts').where('uid','==', auth.currentUser.uid).onSnapshot(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }

      let lista = [] 

      snapshot.forEach(doc => {
        lista.push({id: doc.id, ...doc.data()})
      });

      lista.sort((a,b) => a.data<b.data)
      console.log(lista)
      setPosts(lista)
    })
  }, [])
  

  if (user) {//estiver logado
    return (
      <ScrollView style={{backgroundColor: '#FF8C00'}}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <Image source={{uri: link}} style={styles.imagem}/>
            <View style={styles.detalhes}>
                <Text style={styles.texto}>@{user.username}</Text>
                <Text style={styles.texto}>{user.nome}</Text>
                <Text style={styles.texto}>{user.data}</Text>
                <RoundButton title = 'Atulizar Foto Perfil' onPress={() => handleSelectImages(setUpload, user)} > </RoundButton>
            </View>
        </View>
        {posts.map(post => {
        return (
          <View key={post.id} style={styles.container}>
            <Image source={{uri:(post.imagem!=''?post.imagem:'https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif')}} style={{width: 350, height: 350}}></Image>
            <View style={{flexDirection: 'row', justifyContent: "space-between", padding: 16}}>
              <Text style={styles.title}>{'@'+post.Nome}</Text>
              <Text style={styles.date}>{new Date(post.data).toLocaleDateString() + " - " + new Date(post.data).toLocaleTimeString().slice(0,5) + 'h'}</Text>
            </View>
            <Text style={styles.paragraph}>{post.Legenda}</Text>
            <RoundButton title="Excluir" onPress={() => {
              Alert.alert(
                "Deseja remover?",
                "Esta ação não pode ser desfeita",
                [
                  {
                    text: "Cancelar",
                    onPress: () => {},
                    style: "cancelar"
                  },
                  { text: "Remover", onPress: async () => {
                    try { await storage.ref(`/Posts/${post.id}`).delete()
                    } catch (error) {
                      console.log(error)
                    }
                    await firestore.collection(`Posts`).doc(post.id).delete()
                    Alert.alert("Removido com sucesso!")
                  }}
                ],
                { cancelable: false }
              );
            }}></RoundButton>
          </View>
      )})}
      </ScrollView>)
    } else//não está logado
      return(
        <View style={styles.feed}><Image source={{uri: 'https://i.pinimg.com/originals/13/e7/c0/13e7c0a5af43287383abdadb6fb35eb6.gif'}} style={styles.imagem}></Image></View>
      )


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

  async function handleSelectImages(setUpload, user) {
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
    const task = storage.ref(`/Profile/${user.uid}`).put(blob);

    try {
      await task;
    } catch (e) {
      console.error(e);
    }
  
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!'
    );

    await storage.ref(`Profile/${user.uid}`).getDownloadURL().then(url => setLink(url))
  };

}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 16,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  detalhes:{
    alignItems: "center",
    width: '60%',
  },
  imagem: {
    width: 150,
    height: 150
  },
 image_post: {
  width: '100%',
 },
 texto: {
  fontSize: 20,
  fontWeight: 'bold',
  },
  title: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 16,
    fontWeight: 'normal',
    color: "#2f2f2f",
    textShadowColor: '#000'
  },
  date: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#D3D3D3',
    color: '#4F4F4F',
    minWidth: 350,
    marginTop: 10,
    padding: 16,
    borderRadius:32,  
},
 /* image_post: {
    width: '100%',
   },
   texto: {
    fontSize: 20,
    fontWeight: 'bold',
    },
    container_post: {
      margin: w10,
      padding: 16,
      backgroundColor: '#FF8C00',
      alignItems: 'center',
      justifyContent: 'center',
    },*/
});
