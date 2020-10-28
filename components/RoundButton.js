import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';



export default function RoundButton({ title, onPress, color }) {
  console.log(title)
  if (!color===undefined)
    styles.container.color=color
  return (
    <TouchableOpacity
      style={{width: '80%',
      backgroundColor: (color===undefined)?'#000':color, //cor de fundo do botão
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 32,
      padding: 12,
      margin: 6,}}
      onPress={() => onPress()}
    >
        <Text style={styles.text}>
          {title}
        </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    backgroundColor: '#000', //cor de fundo do botão
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    padding: 12,
    margin: 6,
  },
  text: {
      textAlign: 'center',
     // flex: 1,
      color: '#fff',//cor do texto do botão
      fontSize: 20,//tamanho da fonte
  }
});
