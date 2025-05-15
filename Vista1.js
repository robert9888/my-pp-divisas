import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, TouchableOpacity, Clipboard, Image } from 'react-native';
import Voice from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/MaterialIcons';



const Vista1 = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [infoVisibility, setInfoVisibility] = useState({});

  useEffect(() => {
    // Configura los eventos de Voice
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Limpia los eventos al desmontar el componente
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (event) => {
    if (event.value && event.value.length > 0) {
      const spokenText = event.value[0];
      const parsedAmount = parseFloat(spokenText);
      if (!isNaN(parsedAmount)) {
        setAmount(parsedAmount);
      }
    }
    setIsListening(false);
  };

  const onSpeechError = (error) => {
    console.error('Error de reconocimiento de voz:', error);
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start('es-ES'); // Configura el idioma (español)
    } catch (error) {
      console.error('Error al iniciar el reconocimiento de voz:', error);
      setIsListening(false);
    }
  };

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

  const calculateDifferences = (bcvValue, customAverage, result) => {
    return {
      diffBCVPromedio: (bcvValue - customAverage).toFixed(2),
      diffBCVParalelo: (bcvValue - result).toFixed(2),
    };
  };


  return (
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
          <TouchableOpacity onPress={startListening} disabled={isListening}>
            <Icon
              name="mic"
              size={24}
              color={isListening ? '#FF0000' : '#e2e6e9'}
              style={styles.micIcon}
            />
          </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
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
    flexDirection: 'row', // Alinea el input y el botón en la misma línea
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 10, // Espaciado interno horizontal
  },
  input: {
    flex: 1, // Ocupa el espacio restante
    color: 'white',
    paddingVertical: 10, // Espaciado interno vertical
    fontSize: 18,
    textAlign: 'center',
  },
  micIcon: {
    marginLeft: 10, // Espaciado entre el input y el ícono
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
    backgroundColor: '#3498db', // Color de fondo del botón
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 5,
  },
  customButtonText: {
    color: 'white', // Color del texto
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultWrapper: {
    flexDirection: 'row', // Alinea los elementos en una fila
    alignItems: 'center', // Centra verticalmente los elementos
    justifyContent: 'space-between', // Espaciado entre los elementos
    width: '100%', // Asegura que ocupe todo el ancho disponible
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
    flex: 1, // Permite que el texto ocupe el espacio restante
  },
  copyButton: {
    marginHorizontal: 10, // Espaciado entre los botones y el texto
    padding: 5,
    backgroundColor: '#333',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
      imageWrapper: {
        alignItems: 'center', // Centra la imagen horizontalmente
        justifyContent: 'center', // Centra la imagen verticalmente
        width: '100%', // Asegura que ocupe todo el ancho del contenedor
      },
      inputImage: {
        width: 200, // Ajusta el ancho de la imagen
        height: 100, // Ajusta el alto de la imagen
        resizeMode: 'contain', // Ajusta la imagen dentro del contenedor
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
marginBottom: 10, // Espaciado debajo del título
textAlign: 'center', // Centra el texto
},
});

export default Vista1;