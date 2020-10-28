import React from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';

import RoundButton from './../components/RoundButton';

import {auth, firestore, storage} from './../components/Firebase'; 

export default function Feed({ navigation }) {

  const [posts, setPosts] = React.useState([])

  //executa apenas uma vez
  React.useEffect(() => {
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
      setPosts(lista)

    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  },[])

    return (//renderiza para aparecer na tela
    <View style={styles.container}>
      {posts.map(post => {
        return (
          <View key={post.id}>
            <Image surce={{uri: post.imagem}}></Image>
            <Text>{post.Nome}</Text>
            <Text>{post.Legenda}</Text>
          </View>
      )})}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
 }
});
