import React, {Component} from 'react';

import { BleManager } from 'react-native-ble-plx';

export default class ManagerBlend extends Component {
    constructor() {
        super()
        this.manager =  new BleManager();
        this.state = {
            text: "Buscar Dispositivos", 
            connectState : "Conectar", 
            values: {}, 
            conectables : {}, 
            alert : ''
        }
        this.sensors = {value: {}}
        this.timeWait;
        this.device;
        this.scanWait;
        this.scanDevices = this.scanDevices.bind(this);
    }
    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
                title: 'Location permission for bluetooth scanning',
                message: 'wahtever',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
            ); 
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }

    getServicesAndCharacteristics(device) {
        return new Promise((resolve, reject) => {
            device.services().then(services => {
                const characteristics = []
                services.forEach((service, i) => {
                    service.characteristics().then(c => {
                        characteristics.push(c)
                        if (i === services.length - 1) {
                            const temp = characteristics.reduce(
                                (acc, current) => {
                                    return [...acc, ...current]
                                },
                                []
                            )
                            const dialog = temp.find(
                                characteristic =>
                                    characteristic.isWritableWithoutResponse
                            )
                            if (!dialog ) {
                                reject('No writable characteristic')
                            }
                            resolve(dialog)
                        }
                    })
                })
            })
        })
    }

    
    connectDevice(deviceName) {
        this.manager.stopDeviceScan();
        this.setState({text:"Buscar Dispositivos"})
        let item = this.state.conectables[deviceName]
        let device = item.obj;
        const btnConectText = (e)=> item.text = e;
        //console.log(device)
        if(item.text == 'Desconectar'){
            this.manager.cancelDeviceConnection(device.id).then(response => {
                this.setState({alert : `Dispositivo desconectado`})
            });
            btnConectText('Conectar')
        }else {
            const serviceUUIDs = device.serviceUUIDs[0];
            btnConectText('Conectando')
            this.manager.connectToDevice(device.id, {autoConnect:true}).then((estado) => {
                (async () => {
                    const services = await estado.discoverAllServicesAndCharacteristics()
                    const characteristic = await this.getServicesAndCharacteristics(services)
                    this.setState({alert : 'Buscando los Servicios y Caracteristicas'})
                    this.setState({alert : `Servicios y Caracteristicas encontradas`})
                    this.setState({deviceid:estado.id, serviceUUID:serviceUUIDs, characteristicsUUID : characteristic.uuid, device: estado })
                })();
                //console.log(device)
                this.setState({device:estado})
                return estado.discoverAllServicesAndCharacteristics();
            }).then((estado) => {
                this.manager.isDeviceConnected(device.id).then((e)=>{
                    btnConectText('Desconectar')
                })
            }).then((estado) => {
                this.manager.isDeviceConnected(device.id).then((e)=>{
                    btnConectText('Desconectar')
                })
            }, (error) => {
                this.manager.cancelDeviceConnection(device.id).then(response => {
                    btnConectText('Conectar')
                });
                btnConectText('Conectar')
                console.log("Connection error "+ JSON.stringify(error))
            })
        }
        
    }

    scanDevices() {
        let conectables = {};
        if(this.state.text == "Buscando Dispositivos"){
            this.setState({text:"Buscar Dispositivos"})
            clearTimeout(this.scanWait)
            clearTimeout(this.timeWait)
            this.manager.stopDeviceScan();
        }else {
            this.setState({text:"Buscando Dispositivos"})
            this.scanWait = setTimeout(() => {
                this.manager.startDeviceScan(null, null, (error, device) => {
                    console.log("Buscando Dispositivos");
                    
                    if (null) {
                        console.log('null')
                    }
                    if (error) {
                        this.setState({text:"Buscar Dispositivos"})
                        this.manager.stopDeviceScan();
                        this.setState({alert : "Error in scan => "+error})
                        return
                    }
        
                    if( device.name !== null) 
                    {
                        let newDevice = {
                            name : device.name, 
                            id : device.id,
                            obj : device,
                            text: 'Conectar'
                        };

                        this.manager.isDeviceConnected(device.id).then((e)=>{
                            newDevice = {
                                name : device.name, 
                                id : device.id,
                                obj : device,
                                text: 'Desconectar'
                            };
                            console.log(e)
                            conectables[device.name] = newDevice
                        })
                        

                        conectables[device.name] = newDevice

                        this.setState({
                            conectables : conectables
                        })
                    }
                });
            }, 1000);
            this.timeWait = setTimeout(() => {
                this.manager.stopDeviceScan();
                this.setState({text:"Buscar Dispositivos"})
                if(Object.keys(conectables).length < 1) {
                    this.setState({alert : 'No es han encontrado resultados. Si este problema persiste reiniciar la aplicacion'})
                }else {
                    this.setState({alert : 'La busqueda finalizo. Si no encuentrra su dispositivo, intentar de nuevo'})
                }
            }, 5000);
        }

    }
}