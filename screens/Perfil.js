import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Feed from '../components/Feed';
import {auth, firestore, storage} from './../components/Firebase'; 
import RoundButton from './../components/RoundButton';

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
  const [upload, setupload] = useState(null);

  useEffect (() => {
    auth.onAuthStateChanged((usr) => {
      if (usr) {
        //se estiver authenticado usr é o usuário logado
        var docRef = firestore.collection("Usuarios").doc(`${usr.uid}`);

        docRef.get().then(u => {
          console.log(u.data())
          setuser(u.data())
          storage.ref(`Profile/${u.data().imagem_perfil}.jpg`).getDownloadURL().then(url => setLink(url))
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
      <View style={styles.feed}>
        <View style={styles.container}>
            <Image source={{uri: link}} style={styles.imagem}/>
            <View style={styles.detalhes}>
                <Text style={styles.texto}>@{user.username}</Text>
                <Text style={styles.texto}>{user.nome}</Text>
                <Text style={styles.texto}>{user.data}</Text>
                <RoundButton title = 'Atulizar Foto Perfil' onPress={() => {
                  console.log('apertou botão de upload de perfil')
                }} > </RoundButton>
            </View>
        </View>
        <Feed/>
      </View>)
    } else//não está logado
      return(
        <View style={styles.feed}><Image source={{uri: 'https://i.pinimg.com/originals/13/e7/c0/13e7c0a5af43287383abdadb6fb35eb6.gif'}} style={styles.imagem}></Image></View>
      )
  
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
  }
});
