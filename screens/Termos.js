import React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TextInput, Image, Alert } from 'react-native';
import RoundButton from './../components/RoundButton';

export default function Termos({ navigation }) {

    return (
      <View style={styles.container}>
        <Text>Apresentamos os Termos</Text>
        <RoundButton title="Li e aceito todos os termos propostos" onPress={() => navigation.navigate("Login")}></RoundButton>
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