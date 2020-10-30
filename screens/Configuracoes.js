import React from 'react';
import {StyleSheet, Text, View } from 'react-native';
import RoundButton from './../components/RoundButton';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function Configuracoes() {

  return (
    <Stack.Navigator>
            <Stack.Screen name="Configurações" component={({ navigation }) => {
        return(
          <View style={styles.container}>
            <RoundButton title="Meus Pedidos" onPress={() => {navigation.navigate("Meus Pedidos")}}></RoundButton>
            <RoundButton title="Editar meus Dados" onPress={() => {navigation.navigate("Editar meus Dados")}}></RoundButton>
            <RoundButton title="Criar e Editar página da Empresa" onPress={() => {navigation.navigate("Criar ou Editar perfil da Empresa")}}></RoundButton>
            <RoundButton title="Convide um amigo" onPress={() => {navigation.navigate("Convide amigos")}}></RoundButton> 
            <RoundButton title="Suporte" onPress={() => {navigation.navigate("Suporte")}}></RoundButton> 
            <RoundButton title="Sobre este aplicativo e nossa Empresa" onPress={() => {navigation.navigate("Sobre")}}></RoundButton>       
            <RoundButton title="Deslogar Conta" onPress={() => {navigation.navigate("Sair App")}}></RoundButton>
          </View>
        )
      }}/>
      <Stack.Screen name="Meus Pedidos" component={Pedido}/>
      <Stack.Screen name="Editar meus Dados" component={Dados}/>
      <Stack.Screen name="Criar ou Editar perfil da Empresa" component={Empresa}/>
      <Stack.Screen name="Convide amigos" component={Convidar}/>
      <Stack.Screen name="Suporte" component={Suporte}/>
      <Stack.Screen name="Sobre" component={Sobre}/>
      <Stack.Screen name="Sair App" component={Sair}/>
    </Stack.Navigator>
  );
}

function Pedido({ navigation }) {
  return (
  <View style={styles.container}>
    <Text>PEDIDO</Text>
    <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
  </View>
);}

function Dados({ navigation }) {
  return (
  <View style={styles.container}>
    <Text>EDITAR MEUS DADOS</Text>
    <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
  </View>
);}

function Empresa({ navigation }) {
  return (
  <View style={styles.container}>
    <Text>CRIAR/EDITAR PÁGINA DA EMPRESA</Text>
    <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
  </View>
);}

function Convidar({ navigation }) {
  return (
  <View style={styles.container}>
    <Text>CONVIDE UM AMIGO</Text>
    <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
  </View>
);}

function Suporte({ navigation }) {
  return (
  <View style={styles.container}>
    <Text>Direcionamento de Suporte</Text>
    <RoundButton title="Possível problema 1" onPress={() => {}}></RoundButton>
    <RoundButton title="Possível problema 2" onPress={() => {}}></RoundButton>
    <RoundButton title="Possível problema 3" onPress={() => {}}></RoundButton>
    <RoundButton title="Possível problema 4" onPress={() => {}}></RoundButton>
    <RoundButton title="Possível problema 5" onPress={() => {}}></RoundButton>
    <RoundButton title="Possível problema 6" onPress={() => {}}></RoundButton>
    <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
  </View>
);}

function Sobre({ navigation }) {
  return (
  <View style={styles.container}>
    <Text style={{fontSize:16, lineHeight: 37, maxWidth: 180}}>A CHMSoftware apresenta neste trabalho um aplicativo formulado para a comercialização de bebidas,
      onde estamos disposotos a atender do menor vendedor de um suco ao maior vendedor de uma grande fraquia
      de vinhos ou champagne. Basicamente ele atende aos interesses de obviamente quem busca vender seus produtos
      e gerar notoriedade com eles, até o usuário e comprador final das bebidas comercializadas aqui, contando com
      uma plataforma de uso com fácil aprednizagem para começar logo a comprar produtos de seu interesse,
      comunicação direta com os vendedores da mesma para qualquer tipo de problema que possa ser gerado nessa venda
      e também comunicação com nosso sistema, podendo relatar qualquer tipo de problema no próprio aplicativo, até
      algum abuso cometido por partes de outros usuários ou até mesmo vendedores.
      Esta é o primeiro aplicativo posto para exibição da CHMSoftware, porém temos vários protópios ainda em desenvolvimento
      que buscam atender à praticidade dos usuários, que é o principal objetivo que nossa empresa busca cumprir para com 
      o desenvolvimento de seus trabalhos direcionados ao público. Ficou curioso para conhecer nossos próximos projetos?
      Acesse nosso site e saiba muito mais sobre nossa empresa e sobre nossos trabalhos (LINK DO SITE...)
      E se você tem interesse em solicitar um desenvolvimento específico para sua empresa também fale conosco, nos mande
      uma mensagem no nosso WhatsApp (99) 9 9999 - 9999 ou acesse também nosso site!!!
    </Text>
    <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
  </View>
);}

function Sair({ navigation }) {
  return (
  <View style = {styles.container}>
        <Text>Ao clicar no botão "Deslogar" você irá encerrar sua sessão de uso</Text>
        <View style={styles.coluna}>
    <RoundButton title="Deslogar" onPress={() => navigation.navigate("Snapdrink")}></RoundButton>
    <RoundButton title="Voltar" onPress={() => navigation.goBack()}></RoundButton>
        </View>
  </View>
);}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  coluna: {
    backgroundColor: '#FF8C00',
    //flex: 1,
    flexDirection: 'row',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}
});