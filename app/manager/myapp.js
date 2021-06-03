import React, {Component} from 'react';
import { BleManager } from 'react-native-ble-plx';
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    TextInput,
} from 'react-native';
import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

import ManagerBlend from './manager';

export default class ScanBleManger extends ManagerBlend {
    constructor() {
        super()
    }
    
    render() {
        let conectables = this.state.conectables;
        return (
            <>
                {/* Notificaciones */}
                {this.state.alert !== "" ? 
                <View style={styles.dialogCard}>
                    <View style={styles.btnCarga}>
                        <Text style={styles.highlight} >
                            Notificacion.
                        </Text>
                        <TouchableOpacity onPress={()=> this.setState({alert: ""})}>
                        <Text style={styles.closeBtn}>x</Text>
                        </TouchableOpacity>
                    </View>
                    <Text>
                        {this.state.alert}
                    </Text>
                </View> : null
                }
                {/* Boton de busqueda */}
                <TouchableOpacity  onPress={()=> this.scanDevices()} >
                    <View style={[styles.container, styles.horizontal, styles.btnCard]}>
                        <Text style={styles.highlight, {color: '#fff'}}>
                        {this.state.text}
                        </Text>
                        {this.state.text == "Buscando Dispositivos" ? 
                            <ActivityIndicator size="small" color="#fff" /> : null
                        }
                    </View>
                </TouchableOpacity>
                {/* Dispositivos para conectar o desconectar */}
                <View>
                    <Text style={styles.sectionTitle}>Dispositivos encontrados</Text>
                </View>
                {Object.keys(conectables).map((key) => {
                return <View key={key} style={styles.cardDevice}>
                            <View>
                                <Text style={styles.titleCard}>
                                    {conectables[key].name}
                                </Text>
                                <View style={styles.details}>
                                    <Text >
                                        ID: {conectables[key].id}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={()=> this.connectDevice(conectables[key].name)}>
                                <View style={[styles.container, styles.horizontal, styles.btnCard]}>
                                    <Text style={styles.highlight, {color: '#fff'}}>
                                    {conectables[key].text}
                                    </Text>             
                                    {conectables[key].text == "Conectando" ? 
                                        <ActivityIndicator size="small" color="#fff" /> : null
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                })}
                <View>
                    <Text style={styles.sectionTitle}>Servicios y Caracteristicas</Text>
                </View>
                {console.log(this.state.currentServices)}
            </> 
        );
    }
}


const styles = StyleSheet.create({
    dialogCard: {
      padding: 20,
      zIndex: 2,
      flex : 1,
      width : '100%',
      marginTop: 6,
      marginBottom: 6,
      top :  -150,
      left: '-50%',
      transform: [{ translateX: 195}],
      position: 'absolute',
      borderRadius: 6,
      backgroundColor : '#fff',
      borderColor : '#189FD9',
      borderWidth: 1,
      marginHorizontal: 'auto'
    },
    btnCarga : {
        flexDirection: "row", 
        flex: 1,
        justifyContent: "space-between"
    },
    highlight: {
        fontWeight: '700'
    },
    closeBtn : {
        width: 22, 
        height: 22, 
        textAlign: 'center',
        color: "#fff",
        fontWeight: '700', 
        borderRadius: 50, 
        backgroundColor: 'red',
    },
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    btnCard : {
        borderWidth: 1,
        width: 210,
        borderColor: "#20232a",
        backgroundColor : '#189FD9',
        borderRadius: 6,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    input : {
        width: '100%',
        height : 300
    },
    cardDevice : {
        marginBottom: 15,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#189FD9",
        padding: 20,
    },
    titleCard : {
        fontWeight: '700',
        fontSize : 20,
        marginBottom: 10
    },
    details : {
        marginBottom: 10,
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row'
    },
    itemServices : {
        backgroundColor: '#189FD9',
        padding: 5,
        marginRight: 5,
        borderRadius: 6,
        marginBottom: 10,
        color: '#fff'
    },
    titleDetail : {
        fontWeight: '700',
        fontSize : 18,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
        color: Colors.black,
    },
    title : {
        fontSize: 30,
        fontWeight: '600',
        marginBottom: 20,
        color: Colors.black,
    },
  });