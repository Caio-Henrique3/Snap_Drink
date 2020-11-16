import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TextInput, Image, Alert, ScrollView , Linking  } from 'react-native';
import RoundButton from './../components/RoundButton';
import { auth, firestore, storage } from './../components/Firebase'; 
import { Venda } from './../components/Venda';


export default function Mercado() {

  const [vendas, setVendas] = useState([])

  useEffect(() => {
    firestore.collection('Vendas').onSnapshot(
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
      <ScrollView>
        {vendas.map(item => <Venda
          titulo={item.Titulo}
          uid={item.uid}
          id={item.id}
          imagem={item.Imagem}
          legenda={item.Legenda}
          preco={item.Preço}
          quantidade={item.Quantidade}
          showComprar={true}
          remove={false}
          onComprar={() => Linking.openURL(item.Link)
          }/>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FF8C00',
      alignItems: 'stretch',
      padding: 0,
      justifyContent: 'space-around',
    },
});
