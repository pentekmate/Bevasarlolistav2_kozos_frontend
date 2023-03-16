import React, { Component } from "react";
import { Animated, PanResponder, StyleSheet, View, Dimensions, TouchableOpacity, Text, ActivityIndicator, Alert, Modal, Pressable } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import { ipcim } from "./IPcim";
import { ScrollView } from "react-native-gesture-handler";
const IP = require('./IPcim')
import ProgressBar from "react-native-animated-progress";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
export default class Fooldal extends Component {
    pan = new Animated.ValueXY();
    panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([
            null,
            { dx: this.pan.x, dy: this.pan.y },],
            { useNativeDriver: false }
        ),
        onPanResponderRelease: () => {
            Animated.spring(this.pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
            }).start();
        },
    });
    constructor(props) {
        super(props);
        this.state = {
            felhasznalonev: "",
            timePassed: false,
            id: 0,
            pontok: 0,
            adatok: [],
            isLoading: true,
            modal: false

        };
    }
    bevaltas = () => {
        this.setState({ modal: true })
        this.setState({ pontok: 0 })
    }
    createTwoButtonAlert = () => {
        Alert.alert('Pontok beváltása', "Ha beváltod , pontjaid lenullázódnak.", [
            { text: 'Mégse', onPress: () => console.log('Cancel Pressed') },
            { text: 'Beváltás', onPress: () => this.bevaltas() },
        ]);
    }
    getID = async () => {
        let x = 0
        try {
            const jsonValue = await AsyncStorage.getItem('@ID')
            await jsonValue != null ? JSON.parse(jsonValue) : null;
            x = jsonValue


        } catch (e) {

        }
        finally {
            this.getListakszama(x)
            this.adatLekeres(x)
        }
    }
    adatLekeres = (y) => {
        try {
            var bemenet = {
                bevitel1: y
            }
            //szűrt adatok lefetchelése backendről
            fetch(IP.ipcim + 'felhasznalolistainincskesz3', {
                method: "POST",
                body: JSON.stringify(bemenet),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            }
            ).then((response) => response.json())
                .then((responseJson) => {
                    responseJson.reverse(),
                        this.setState({ adatok: responseJson });
                    //console.log(responseJson)
                    console.log(JSON.stringify(this.state.adatok))
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (e) { console.log(e) }
        finally {
            this.timeoutHandle = setTimeout(() => {
                this.setState({ isLoading: false })
            }, 150);

        }

    }
    getListakszama(y) {
       this.setState({ pontok: 0 })
        var bemenet = {
            bevitel1: y
        }
        fetch(IP.ipcim + 'felhasznaloosszeskesz', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        }
        ).then((response) => response.json())
            .then((responseJson) => {
                (
                    responseJson.map((item) => {
                        this.setState({ pontok: item.felhasznalo_keszlistakszama * 5 })
                        // alert(this.state.pontok)
                    })
                );
            })
    }
    listaletrehozas = () => {
        this.props.navigation.navigate('Listalétrehozás');
    }
    componentDidMount() {
        this.getID()
        this.navFocusListener = this.props.navigation.addListener('focus', () => {
            this.getID()

        })
    }
    componentWillUnmount() {
        this.navFocusListener();
        clearTimeout(this.timeoutHandle);
    }
    getParsedDate = (strDate) => {
        var strSplitDate = String(strDate).split(' ');
        var date = new Date(strSplitDate[0]);
        var dd = date.getDate();
        var mm = date.getMonth() + 1;

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        date = yyyy + "-" + mm + "-" + dd;
        return date.toString();
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    stickyHeaderIndices={[0, 2]}
                >
                    {this.state.pontok >= 100 ?
                        <View style={{ height: height * 0.11, position: "absolute", top: 0, borderColor: "rgb(18,18,18)", borderWidth: 1 }}>
                            <View style={{ position: "relative", backgroundColor: "rgb(18,18,18)", borderBottomRadius: 5 }}>
                                <View style={{ position: "relative", flexDirection: "row", }}>
                                    <View style={{ flex: 7 }}><Text style={{ color: "white", fontSize: 18, margin: 10, fontWeight: "bold" }}>Pontjaid:</Text></View>
                                    <View style={{ flex: 2, justifyContent: "center" }}><TouchableOpacity onPress={() => this.createTwoButtonAlert()} style={{ alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "red" }}><Text style={{ color: "white", margin: 7, fontWeight: "600", fontSize: 15 }}>Beváltás!</Text></TouchableOpacity></View>
                                </View>
                                <View style={{ margin: 10 }}>
                                    <ProgressBar
                                        progress={this.state.pontok}
                                        height={15}
                                        backgroundColor="rgb(1,194,154)"
                                        trackColor="#505050" />
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ height: height * 0.11, position: "absolute", top: 0, }}>
                            <View style={{ position: "relative", backgroundColor: "rgb(18,18,18)", borderBottomRadius: 5 }}>
                                <View style={{ position: "relative", flexDirection: "row", }}>
                                    <View style={{ flex: 10 }}><Text style={{ color: "white", fontSize: 18, margin: 10, fontWeight: "bold" }}>Pontjaid:</Text></View>
                                    <View style={{ flex: 3 }}><Text style={{ color: "white", margin: 10 }}>{this.state.pontok}/100</Text></View>
                                </View>
                                <View style={{ margin: 10 }}>
                                    <ProgressBar
                                        progress={this.state.pontok}
                                        height={10}
                                        backgroundColor="rgb(1,194,154)"
                                        trackColor="#505050" />
                                </View>
                            </View>
                        </View>}

                    <View style={{ height: height * 0.2, justifyContent: "center" }}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1, justifyContent: "center" }}><Text style={{ fontSize: 16, margin: 5, fontWeight: "700", color: "white", alignSelf: "flex-end" }}>Szerezz pontokat </Text></View>
                            <View style={{ flex: 1, justifyContent: "center" }}><TouchableOpacity onPress={() => this.props.navigation.navigate('Listák')}><Text style={{ fontSize: 18, color: "rgb(1,194,154)", fontWeight: "700" }}>Lista befejezéssel!</Text></TouchableOpacity></View>
                        </View>
                        <Text style={{ fontSize: 16, color: "white", marginTop: 5, alignSelf: "center" }}>Hogyan szerezhetsz pontokat?</Text>
                        <Text style={{ fontSize: 16, color: "white", marginTop: 5, alignSelf: "center" }}>Minden befejezett lista után 5 pontot kapsz.</Text>
                    </View>

                    <View style={{ height: height * 0.1, backgroundColor: "rgb(18,18,18)", marginTop: height * 0.020, borderTopEndRadius: 20, borderTopLeftRadius: 20 }}>
                        <Text style={{ fontSize: 20, alignSelf: "center", fontWeight: "bold", color: "white", position: "absolute", bottom: width * 0.05 }}>Legutóbbi listáid:</Text>
                    </View>
                    <View style={{ height: height * 0.85, backgroundColor: "rgb(50,50,50)" }}>


                        <View>
                            {this.state.isLoading == true ? <ActivityIndicator size="large" color="rgb(1,194,154)"></ActivityIndicator>
                                : this.state.adatok.length > 0 ? this.state.adatok.map((item, key) =>
                                        <LinearGradient
                                        key={key}
                                        
                                        start={{ x: 0.3, y: 0.2 }}
                                        end={{ x: 1, y: 1 }}
                                        //colors={['transparent',"#000000","rgb(1,194,154)"]}
                                        colors={['transparent',"rgb(18,18,18)", "rgb(1,194,154)",]}
                                        style={{
                                        padding: 1,
                                        marginTop: 15,
                                        height: height * 0.115,
                                        justifyContent: "center",
                                        borderRadius: 15,
                                        }}>
                                 <View key={key} style={{ margin: 1, backgroundColor: "rgb(32,32,32)",  padding: 10, height: height * 0.11, borderRadius: 15,  }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Seged', { aktid: item.listak_id, akttart: item.listak_tartalom })}>
                                            <View key={key}>
                                                <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{item.listak_nev}</Text>
                                                <Text style={{ marginTop: 10, fontSize: 15, color: "rgb(1,194,154)" }}>{this.getParsedDate(item.listak_datum)}</Text>
                                            </View>
                                            
                                        </TouchableOpacity>
                                    </View>
                                    </LinearGradient>
                                )
                                    :
                                    <View style={{ alignSelf: "center", marginTop: 30 }}>
                                        <Text style={{ color: "white", fontSize: 15, margin: 10 }}>Úgy tűnik jelenleg nem hoztál létre egy listát sem.</Text>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('Listalétrehozás')}>
                                            <Text style={{ alignSelf: "center", color: "rgb(1,194,154)", fontSize: 20 }}>Listalétrehozása!</Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                            {this.state.adatok.length > 0 ? <Text style={{ alignSelf: "center", color: "white", fontWeight: "500", fontSize: 16, marginTop: 30 }}>A listáid végére értél.</Text> :
                                <Text></Text>}

                        </View>

                    </View>


                </ScrollView>

                <Animated.View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        margin: 25,
                        zIndex: 2,
                        transform: [{ translateX: this.pan.x }, { translateY: this.pan.y }],
                    }}
                    {...this.panResponder.panHandlers}>
                    <View style={{ backgroundColor: "696969" }}>
                        <TouchableOpacity
                            onPress={(this.listaletrehozas)}
                            style={{ backgroundColor: "rgb(1,194,154)", width: 65, alignSelf: "flex-end", alignItems: "center", borderRadius: 150 / 2, height: 65, justifyContent: "center", zIndex: 1, }}>
                            <FontAwesome5 name="plus" size={20} color="white" />
                        </TouchableOpacity>

                    </View>
                </Animated.View>
                <Modal
                    style={{ backgroundColor: "red" }}
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modal}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        this.setState({ modalVisible: !modalVisible });
                    }}>
                    <View style={styles.modalView}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 0.9 }}></View>
                                <View style={{ flex: 0.1, borderTopRightRadius: 40, justifyContent: "center" }}>
                                    <Pressable onPress={() => this.setState({ modal: false })}><MaterialIcons name="close" size={30} color="white" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 4, justifyContent: "center" }}>
                            <Text style={{ alignSelf: "center", color: "white", fontSize: 18, fontWeight: "700" }}>Sajnáljuk de ez a funkció jelenleg nem elérhető.</Text>
                        </View>


                    </View>
                </Modal>
            </View>


        );
    }
}
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgb(50,50,50)"

    },
    modalView: {
        flexDirection: "column",
        bottom: 0,
        position: "absolute",
        backgroundColor: '#181818',
        width: "100%",
        height: "45%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderWidth: 2,
        borderTopColor: "rgb(50,50,50)",
        borderLeftColor: "rgb(50,50,50)",
        borderRightColor: "rgb(50,50,50)",
    },

});