import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Vista1 from './Vista1';
import Vista2 from './Vista2';
import configuracion from './configuracion';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Vista1" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Vista1" component={Vista1} />
            <Stack.Screen name="Vista2" component={Vista2} />
            <Stack.Screen name="configuracion" component={configuracion} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;