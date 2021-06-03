/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ImageBackground,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';


import ScanBleManger from './app/manager/myapp'

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.body}>
          <ImageBackground source={require('./app/images/bg.jpg')} style={styles.image}>
          </ImageBackground>
            <View style={styles.sectionContainer}>
              <Text style={styles.title}>
                Recopilacion de datos
              </Text>
              <ScanBleManger/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
    flex : 1,
    position: 'relative',
    zIndex: 3
  },
  sectionContainer: {
    marginTop: 32,
    position: 'relative',
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  title : {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 20,
    color: Colors.black,
  },
  highlight: {
    fontWeight: '700',
  },
  image: {
    width: '100%',
    height: 300,
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
});

export default App;
