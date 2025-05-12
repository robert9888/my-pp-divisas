import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button } from 'react-native';

const Vista2 = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Realiza una solicitud a la API para obtener datos sobre el dólar
    fetch("https://ve.dolarapi.com/v1/dolares")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error al obtener los datos:', error));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Input para ingresar el monto */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ingrese un monto en Bolívares:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Monto en Bolívares"
          placeholderTextColor="#888"
          onChangeText={(value) => setAmount(parseFloat(value) || 0)}
        />
      </View>

      {/* Tarjetas con los datos */}
      {data.length > 0 ? (
        data.map((dolar, index) => {
          // Determina el texto adicional basado en el índice
          let prefix = '';
          if (index === 0) {
            prefix = 'BCV';
          } else if (index === 1) {
            prefix = 'Promedio';
          } else if (index === 2) {
            prefix = 'Paralelo';
          }

          // Formatea la fecha para mostrar solo la parte de la fecha (YYYY-MM-DD)
          const formattedDate = dolar.fechaActualizacion?.split('T')[0] || 'Fecha no disponible';

          // Calcula el monto dividido
          let result;
          if (dolar.promedio && amount > 0) {
            result = (amount / parseFloat(dolar.promedio)).toFixed(2);
          } else {
            result = 'N/A';
          }

          const tasaConDosDecimales = parseFloat(dolar.promedio).toFixed(2);

          return (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{prefix}</Text>
              <Text style={styles.cardText}>Tasa: {tasaConDosDecimales}</Text>
              <Text style={styles.result}>M. USD: {result}</Text>
            </View>
          );
        })
      ) : (
        <Text style={styles.cardText}>Cargando datos...</Text>
      )}

      {/* Fecha en la parte inferior */}
      {data.length > 0 && data[0].fechaActualizacion && (
        <Text style={styles.cardText}>
          Última actualización: {data[0].fechaActualizacion.split('T')[0]}
        </Text>
      )}

      {/* Botón para navegar a Vista 1 */}
      <Button
        title="USD a BS"
        onPress={() => {
          if (navigation && navigation.navigate) {
            navigation.navigate('Vista1');
          } else {
            console.error('El objeto navigation no está disponible.');
          }
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center', // Centra verticalmente
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  label: {
    color: 'white',
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#',
    color: 'white',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 25,
    color: 'white',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 5,
  },
  result: {
    fontSize: 20, // Aumenta el tamaño de la fuente
    color: '#83fb24', // Cambia a un color dorado para resaltar
    marginTop: 10,
    fontWeight: 'bold', // Negrita para mayor énfasis
    backgroundColor: '#333', // Fondo oscuro para contraste
    padding: 10, // Espaciado interno
    borderRadius: 8, // Bordes redondeados
    textAlign: 'center', // Centra el texto
  },
});


export default Vista2;