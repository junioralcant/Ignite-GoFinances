import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';

// import { Container } from './styles';

export function Profile() {
  return (
    <View>
      <Text testID="text-title">Perfil</Text>

      <TextInput
        testID="input-name"
        placeholder="Nome"
        autoCorrect={false}
        value="Junior"
      />

      <TextInput
        testID="input-surname"
        placeholder="Sobrenome"
        value="Marques"
      />

      <Button title="Salvar" onPress={() => {}} />
    </View>
  );
}
