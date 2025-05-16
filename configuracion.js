// filepath: c:\Users\Rcontreras\Downloads\my\codigos\my-pp-divisas\Configuracion.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const configuracion = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Página de Configuración</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default configuracion;