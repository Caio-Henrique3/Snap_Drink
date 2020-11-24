import React from 'react';
import { Button, StyleSheet, Text, TextInput, ScrollView, View, Image, Alert } from 'react-native';

import RoundButton from './../components/RoundButton';

import {auth, firestore, storage} from './../components/Firebase'; 
import * as ImagePicker from 'expo-image-picker';


export default function Feed({ navigation , uid }) {

  const [user, setuser] = React.useState(null);
  const [posts, setPosts] = React.useState([])
  const [url, setUrl] = React.useState("")
  const [legenda, setLegenda] = React.useState("")

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

      firestore.collection('Posts').orderBy('data', 'desc').where('uid','==', uid).onSnapshot(snapshot => {
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
    } else {
      firestore.collection('Posts').orderBy('data', 'desc').onSnapshot(snapshot => {
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

  async function handleSelectImages(legenda) {
    //variavel com o post
    var postId = '';

    //criar o post
    firestore.collection("Posts").add({
      Nome: user.nome,
      Legenda: legenda,
      uid: user.uid,
      data: Date.now(),
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
          
          firestore.collection('Posts').orderBy('data', 'desc').where('uid','==', uid).get()
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
          firestore.collection('Posts').orderBy('data', 'desc').get()
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

      setLegenda("")
    
    } catch (e) {
      console.error(e);
    }
    
  };

  return (//renderiza para aparecer na tela
    <ScrollView style={{width: '100%', height: '100%', backgroundColor: '#FF8C00',}}>
     <TextInput style={styles.input} value={legenda} onChangeText={text => setLegenda(text)} placeholder= "Diga algo sobre o seu post..."></TextInput> 
      <RoundButton title = 'Novo Post' onPress={() => handleSelectImages(legenda)} > </RoundButton>
      {posts.map(post => {
        return (
          <View key={post.id} style={styles.container}>
            <Image source={{uri:(post.imagem!=''?post.imagem:'https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif')}} style={{width: 350, height: 350}}></Image>
            <View style={{flexDirection: 'row', justifyContent: "space-between", padding: 16}}>
              <Text style={styles.title}>{'@'+post.Nome}</Text>
              <Text style={styles.date}>{
                new Date(post.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) + " - " + new Date(post.data).toLocaleTimeString().slice(0,5) + 'h'
              }</Text>
            </View>
            <Text style={styles.paragraph}>{post.Legenda}</Text>
          </View>
      )})}
    </ScrollView>
  );
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
  imagem: {
    width: 100,
    height: 100,
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
});
