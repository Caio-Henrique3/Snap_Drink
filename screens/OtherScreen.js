import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import RoundButton from './../components/RoundButton';

export default function Other({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Other Screen</Text>
      <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
