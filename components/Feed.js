import React from 'react';
import { Button, StyleSheet, Text, TextInput, ScrollView, View, Image, Alert } from 'react-native';

import RoundButton from './../components/RoundButton';

import {auth, firestore, storage} from './../components/Firebase'; 
import * as ImagePicker from 'expo-image-picker';

export default function Feed({ navigation , uid }) {

  console.log(uid)

  const [user, setuser] = React.useState(null);
  const [posts, setPosts] = React.useState([])
  const [url, setUrl] = React.useState(null)
  const [legenda, setLegenda] = React.useState(null)

  //executa apenas uma vez
  React.useEffect(() => {
    //usuario logado
    auth.onAuthStateChanged((usr) => {
      if (usr) {
        //se estiver authenticado usr é o usuário logado
        var docRef = firestore.collection("Usuarios").doc(`${usr.uid}`);

        docRef.get().then(u => {
          console.log(u.data())
          setuser({uid: usr.uid, ...u.data()})
          storage.ref(`Profile/${user.uid}`).getDownloadURL().then(url => setLink(url))
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      }
      else {
        //não está logado
        setuser(null)
      }
    })

    //pega os posts da base de
    if (uid) {

      console.log(uid)

      firestore.collection('Posts').where('uid','==', uid).get()
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
    } else {
      firestore.collection('Posts').get()
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
    }
  },[])

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

  async function handleSelectImages() {
    //variavel com o post
    var postId = '';

    //criar o post
    firestore.collection("Posts").add({
      Nome: user.nome,
      Legenda: legenda,
      imagem: '',
      uid: user.uid
    })
    .then(function(docRef) {
      postId=docRef.id  
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    })

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
    const task = storage.ref(`/Posts/${postId}`).put(blob);

    try {
      await task;
      await storage.ref(`Posts/${postId}`).getDownloadURL().then(async url => {
        await firestore.collection('Posts').doc(postId).update({
          imagem: url,
        })
        //pega os posts da base de
        if (uid) {
  
          console.log(uid)
  
          firestore.collection('Posts').where('uid','==', uid).get()
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
        } else {
          firestore.collection('Posts').get()
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
        }
      })

      Alert.alert(
        'Post Enviado',
        'Seu post foi enviado!'
      );
    
    } catch (e) {
      console.error(e);
    }
    
  };

  return (//renderiza para aparecer na tela
    <ScrollView style={{width: '100%', height: '100%', backgroundColor: '#FF8C00',}}>
     <TextInput style={styles.input} onChange={event => setLegenda(event.target.value)} placeholder= "Diga algo sobre o seu post..."></TextInput> 
      <RoundButton title = 'Novo Post' onPress={() => handleSelectImages()} > </RoundButton>
      {posts.map(post => {
        return (
          <View key={post.id} style={styles.container}>
            <Image source={{uri: post.imagem}} style={{width: 400, height: 400}}></Image>
            <Text style={styles.texto}>{post.Nome}</Text>
            <Text style={styles.texto}>{post.Legenda}</Text>
          </View>
      )})}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 16,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: {
    width: 150,
    height: 150,
  },
 image_post: {
  width: '100%',
 },
 texto: {
  fontSize: 20,
  fontWeight: 'bold',
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
