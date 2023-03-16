import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, Image, Pressable, Dimensions } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsDrawerOpen } from '@react-navigation/drawer'
import { TouchableOpacity } from "react-native";
import { ipcim } from "./IPcim";
const IP = require('./IPcim')
import { useFocusEffect } from '@react-navigation/native';
import { ImagesAssets } from './Kepek/kepek';

const CustomDrawer = (props, { navigation }) => {
    const [profkep, SetProfkep] = useState("")
    const [felhasznalo, SetFelhasznalo] = useState("")
    const [db, Setdb] = useState(0)




    const getID = async () => {
        let x = 0
        try {
            const jsonValue = await AsyncStorage.getItem('@ID')
            await jsonValue != null ? JSON.parse(jsonValue) : null;
            x = jsonValue

        } catch (e) {

        }
        finally {

            getProfkep(x)
            getListakszama(x)
        }
    }


    const getProfkep = async (y) => {

        var bemenet = {
            bevitel1: y
        }
        fetch(IP.ipcim + 'profilkep', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }
        ).then((response) => response.json())
            .then((responseJson) => {
                responseJson.map((item) => {
                    SetProfkep(item.kepek_nev)

                })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    const getFh = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@felhasznalo')
            return jsonValue != null ? JSON.parse(jsonValue) : null;

        } catch (e) {

        }
    }
    const getListakszama = (y) => {
        var bemenet = {
            bevitel1: y
        }
        fetch(IP.ipcim + 'felhasznaloossz', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }
        ).then((response) => response.json())
            .then((responseJson) => {
                responseJson.map((item) => {
                    Setdb(item.osszes)

                })
            })
            .catch((error) => {
                console.error(error);
            });
    }


    useEffect(() => {
        getFh().then((nev) => {
            SetFelhasznalo(nev)
        })
        getID()
        const interval = setInterval(() => {
            getFh().then((nev) => {
                SetFelhasznalo(nev)
            })
            getID()
        }, 1000);
        return () => clearInterval(interval);

    }, []);

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: 'black' }}>
                <ImageBackground
                    source={ImagesAssets.kep4}
                    style={{ padding: 20 }}>

                    <TouchableOpacity style={{ width: width * 0.2, height: width * 0.2, backgroundColor: "rgb(50,50,50)", justifyContent: "center", borderRadius: width * 0.2 / 2, alignContent: "center" }} onPress={() => props.navigation.navigate('Profilom')}>

                        <Image
                            source={{ uri: IP.ipcim + profkep }}
                            style={{ height: "100%", width: "100%", borderRadius: width * 0.2 / 2 }}
                        />
                    </TouchableOpacity>


                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: "bold" }}>{felhasznalo}</Text>
                    <Text style={{ color: '#fff', fontSize: 15 }}>Listák száma: <Text style={{ color: "rgb(1,194,154)" }}>{db}</Text></Text>


                </ImageBackground>
                <View style={{ flex: 1, backgroundColor: "rgb(32,32,32)", paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>

            </DrawerContentScrollView>

        </View>
    )
}

export default CustomDrawer
const { width, height } = Dimensions.get("window");