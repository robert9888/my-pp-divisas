import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, TouchableOpacity, Clipboard, Image } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const Vista1 = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState(0);
  const [infoVisibility, setInfoVisibility] = useState({});

  useEffect(() => {
    // Realiza una solicitud a la API para obtener datos sobre el dólar
    fetch("https://ve.dolarapi.com/v1/dolares")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error al obtener los datos:', error));
  }, []);

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
  };


  return (
    <View style={{ flex: 1 }}>
      {/* Menú superior */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CONVERSOR CAPITAL</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('configuracion')} // Navega a la página de configuración
        >
          <Icon name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Input para ingresar el monto */}
        <View style={styles.inputContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('./assets/conversor2.png')}
              style={styles.inputImage}
            />
          </View>
          <Text style={styles.label}>Ingrese un monto:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Monto en USD"
              placeholderTextColor="#888"
              value={amount > 0 ? amount.toString() : ''}
              onChangeText={(value) => setAmount(parseFloat(value) || 0)}
            />
          </View>
        </View>

      {data.length > 0 ? (
        data.map((dolar, index) => {
          let prefix = '';
          if (index === 0) {
            prefix = 'BCV';
          } else if (index === 1) {
            prefix = 'Promedio';
          } else if (index === 2) {
            prefix = 'Paralelo';
          }

          const formattedDate = dolar.fechaActualizacion?.split('T')[0] || 'Fecha no disponible';
          let result = (amount * parseFloat(dolar.promedio)).toFixed(2);
          let displayValue = parseFloat(dolar.promedio).toFixed(2);

          // Calcula el promedio personalizado si es la tarjeta "Promedio"
          if (index === 1 && data.length > 2) {
            const bcvValue = parseFloat(data[0].promedio);
            const paraleloValue = parseFloat(data[2].promedio);
            customAverage = ((bcvValue + paraleloValue) / 2).toFixed(2); // Calcula el promedio entre BCV y Paralelo
            displayValue = customAverage;
            result = (amount * parseFloat(customAverage)).toFixed(2); // Calcula el monto basado en el promedio
          }

          return (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{prefix} - Tasa: {displayValue}</Text>
              <View style={styles.resultWrapper}>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => {
                    setInfoVisibility((prev) => ({
                      ...prev,
                      [index]: !prev[index], // Alterna la visibilidad de la tarjeta seleccionada
                    }));
                  }}
                >
                  <Icon name="compare" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.result}>Bs S: {result}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(result)}
                >
                  <Icon name="content-copy" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* Información adicional bajo la tarjeta seleccionada */}
              {infoVisibility[index] && (
                <View style={styles.additionalInfo}>
                  {data.length > 2 ? (
                    <>
                      <Text style={styles.infoTitle}>Diferencia</Text>

                      {/* Diferencias específicas para cada tarjeta */}
                      {index === 0 && (
                        <>
                          <Text style={styles.infoText}>
                            Promedio: {(
                              parseFloat(amount * parseFloat(data[0].promedio)) - parseFloat(amount * parseFloat(customAverage))
                            ).toFixed(2)}
                          </Text>
                          <Text style={styles.infoText}>
                            Paralelo: {(
                              parseFloat(amount * parseFloat(data[0].promedio)) - parseFloat(amount * parseFloat(data[2].promedio))
                            ).toFixed(2)}
                          </Text>
                        </>
                      )}

                      {index === 1 && (
                        <>
                          <Text style={styles.infoText}>
                            BCV: {(
                              parseFloat(amount * parseFloat(customAverage)) - parseFloat(amount * parseFloat(data[0].promedio))
                            ).toFixed(2)}
                          </Text>
                          <Text style={styles.infoText}>
                            Paralelo: {(
                              parseFloat(amount * parseFloat(customAverage)) - parseFloat(amount * parseFloat(data[2].promedio))
                            ).toFixed(2)}
                          </Text>
                        </>
                      )}

                      {index === 2 && (
                        <>
                          <Text style={styles.infoText}>
                            BCV: {(
                              parseFloat(amount * parseFloat(data[2].promedio)) - parseFloat(amount * parseFloat(data[0].promedio))
                            ).toFixed(2)}
                          </Text>
                          <Text style={styles.infoText}>
                            Promedio: {(
                              parseFloat(amount * parseFloat(data[2].promedio)) - parseFloat(amount * parseFloat(customAverage))
                            ).toFixed(2)}
                          </Text>
                        </>
                      )}
                    </>
                  ) : (
                    <Text style={styles.infoText}>No hay suficientes datos para calcular diferencias.</Text>
                  )}
                </View>
              )}
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
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => {
          if (navigation && navigation.navigate) {
            navigation.navigate('Vista2');
          } else {
            console.error('El objeto navigation no está disponible.');
          }
        }}
      >
        <Text style={styles.customButtonText}>BS a USD</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e1e1e',
    padding: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 5,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    marginBottom: 10,
    width: '100%',
    maxWidth: 400,
  },
  label: {
    color: 'white',
    marginBottom: 5,
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
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
    fontSize: 23,
    color: 'white',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 2,
  },
  customButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 5,
  },
  customButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  result: {
    fontSize: 20,
    color: '#83fb24',
    fontWeight: 'bold',
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
    flex: 1,
  },
  copyButton: {
    marginHorizontal: 10,
    padding: 5,
    backgroundColor: '#333',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  inputImage: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  additionalInfo: {
    marginTop: 10,
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 6,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  infoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Vista1;