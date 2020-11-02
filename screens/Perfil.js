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
  const [link, setLink] = useState('https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png');
  const [upload, setUpload] = useState(null);
  const [posts, setPosts] = React.useState([])

  useEffect (() => {
    auth.onAuthStateChanged((usr) => {
      if (usr) {
        //se estiver authenticado usr é o usuário logado
        var docRef = firestore.collection("Usuarios").doc(`${usr.uid}`);
        storage.ref(`Profile/${usr.uid}`).getDownloadURL().then(url => setLink(url))

        docRef.get().then(u => {
          console.log(u.data())
          firestore.collection('Posts').where('uid','==', usr.uid).get()
          .then(snapshot => {
            if (snapshot.empty) {
              console.log('No matching documents.');
              return;
            }

            let lista = [] 

            snapshot.forEach(doc => {
              lista.push({id: doc.id, ...doc.data()})
            });

            console.log(lista)
            setPosts(lista)
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
          setuser({uid: usr.uid, ...u.data()})
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      }
      else {
        //não está logado
        setuser(null)
      }
    })
  }, [])
  

  if (user) {//estiver logado
    return (
      <ScrollView style={{backgroundColor: '#FF8C00'}}>
        <View style={styles.container}>
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
              <View key={post.id} style={styles.container_post}>
                <Image source={{uri: post.imagem}} style={{width: 400, height: 400}}></Image>
                <Text style={styles.texto}>{post.Nome}</Text>
                <Text style={styles.texto}>{post.Legenda}</Text>
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
    maxHeight: '40%',
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imagem: {
    flex: 0.4,
    width: 150,
    height: 150,
  },
  detalhes: {
    flex: 1,
    margin: 10,
      width:'100%',
      alignItems: 'flex-start',
    justifyContent: 'center',
  },
  texto: {
      fontSize: 20,
      fontWeight: 'bold',
  },
  feed: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#FF8C00',
      alignItems: 'center',
      justifyContent: 'center',
  },
 /* image_post: {
    width: '100%',
   },
   texto: {
    fontSize: 20,
    fontWeight: 'bold',
    },
    container_post: {
      margin: 10,
      padding: 16,
      backgroundColor: '#FF8C00',
      alignItems: 'center',
      justifyContent: 'center',
    },*/
});
