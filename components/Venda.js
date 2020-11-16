import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore, storage } from './../components/Firebase'; 

import { Card } from 'react-native-paper';

export function Venda({ titulo, legenda, preco, quantidade, onComprar, remove, onRemove, uid, id, imagem, showComprar }) {
  
  const [link, setLink] = React.useState('')

  useEffect(() => {
    storage.ref(id).getDownloadURL().then(l => setLink(l))
  },[])
  
  async function onRemove() {
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
          await storage.ref(`${id}`).delete()
          await firestore.collection('Vendas').doc(id).delete()
          Alert.alert("Removido com sucesso!")
        }}
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>
          {titulo?titulo:'...'}
        </Text>
        <Image style={styles.logo} source={{uri: imagem?imagem:link}} />
        <Text style={styles.paragraph}>
        {legenda?legenda:'...'}
        </Text>
        <Text style={styles.title}>
        {preco && quantidade?`R\$${preco} - ${quantidade}`:'...'}  
        </Text>
        {showComprar?<TouchableOpacity style={styles.button} onPress={onComprar}>
        <Text style={styles.buttonText}>Comprar</Text>
        </TouchableOpacity>:null}
        {(remove?<TouchableOpacity onPress={onRemove} style={{backgroundColor: '#000', padding: 12}}><Text style={{color: "#fff"}}>🗑️ Excluir</Text></TouchableOpacity>:null)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginVertical: 22,
    alignSelf: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 12,
  },
  title: {
    margin: 24,
    marginTop: 0,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    margin: 24,
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: "#afafaf",
  },
  logo: {
    height: 128,
    width: 128,
  },
  button: {
    width: 150,
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 6,
  },
  buttonText: {
    width: '100%',
    color: 'white',
    textAlign: 'center',
    padding: 8,
  }
});
