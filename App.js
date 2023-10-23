import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Router from './app/router';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        translucent
        backgroundColor="transparent"
      />
      <Router />
    </NavigationContainer>
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
