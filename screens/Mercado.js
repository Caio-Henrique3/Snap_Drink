import React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TextInput, Image, Alert } from 'react-native';
import RoundButton from './../components/RoundButton';

export default function Mercado({ navigation }) {

    return (
      <View style={styles.container}>
        <Text>Será criado depois</Text>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FF8C00',
      alignItems: 'center',
      justifyContent: 'center',
    },
});