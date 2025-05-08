import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button } from 'react-native';

const Vista1 = ({ navigation }) => {
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
        <Text style={styles.label}>Ingrese un monto:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Monto en USD"
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

          // Calcula el monto final
          let result;
          let displayValue = dolar.promedio;

          if (index === 1 && data.length > 2) {
            // Calcula el promedio entre BCV (index 0) y Paralelo (index 2)
            const bcvValue = parseFloat(data[0].promedio);
            const paraleloValue = parseFloat(data[2].promedio);
            const customAverage = ((bcvValue + paraleloValue) / 2).toFixed(2);
            displayValue = customAverage; // Actualiza el valor mostrado en "Promedio"
            result = (amount * parseFloat(customAverage)).toFixed(2);
          } else {
            result = (amount * parseFloat(dolar.promedio)).toFixed(2);
          }

          return (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{prefix}</Text>
              <Text style={styles.cardText}>Compra: {displayValue}</Text>
              <Text style={styles.result}>Monto en BS: {result}</Text>
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

      {/* Botón para navegar a Vista 2 */}
      <Button
        title="Ir a Vista 2"
        onPress={() => {
          if (navigation && navigation.navigate) {
            navigation.navigate('Vista2');
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
    backgroundColor: '#1e1e1e',
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
    padding: 20,
    marginBottom: 20,
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
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  result: {
    fontSize: 16,
    color: '#4caf50',
    marginTop: 10,
  },
});

export default Vista1;