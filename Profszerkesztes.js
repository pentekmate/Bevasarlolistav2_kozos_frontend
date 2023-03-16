import React, { Component } from 'react';
import { Animated, PanResponder, Text, StyleSheet, View, Dimensions, TouchableOpacity, TextInput, Modal, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { ipcim } from "./IPcim";
const IP = require('./IPcim')

export default class ProfilEdit extends Component {
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
            id: 0,
            felhasznalonevek: [],
            felhasznalonev: "",
            felhasznalonevCsere: "",
            fokusz1: false,
            modal: false,
            kepek: [],
            profkep: "",
            profIsLoad: true,
            sikeresModal: false

        };
    }
    profilTorles = () => {
        console.log("torles", this.state.id)
        var bemenet = {
            bevitel1: this.state.id
        }
        fetch(IP.ipcim + 'profiltorles', {
            method: "DELETE",
            body: JSON.stringify(bemenet),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }
        ).catch((error) => {
            console.error(error);
        }).then(this.props.navigation.navigate('Bejelentkezes'))
    }

    createTwoButtonAlert = () => {
        Alert.alert('Biztosan törlöd a fiókod?', "", [
            { text: 'Mégse', onPress: () => console.log('Cancel Pressed') },
            { text: 'Törlés', onPress: () => this.profilTorles() },
        ]);
    }
    async getKepek() {
        try {
            const response = await fetch(IP.ipcim + 'felhasznalokepek');
            const json = await response.json();

            this.setState({ kepek: json });
        } catch (error) {
            console.log(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }
    getProfilkep() {
        var bemenet = {
            bevitel1: this.state.id
        }
        fetch(IP.ipcim + 'profilkep', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }
        ).then((response) => response.json())
            .then((responseJson) => {
                responseJson.map((item) => {
                    this.setState({ profkep: item.kepek_nev })
                    console.log("profkep:", this.state.profkep)

                })
            })
            .catch((error) => {
                console.error(error);
            }).then(
                this.timeoutHandle = setTimeout(() => {
                    this.setState({ profIsLoad: false })
                }, 200))
    }
    sikeresModalMutat = () => {
        this.setState({ sikeresModal: true })
        setTimeout(() => {
            this.setState({
                sikeresModalMutat: false
            });
        }, 2000);

    }

    Profkepfrissites = (x) => {
        console.log(x)
        this.setState({ profIsLoad: true })
        var bemenet = {
            bevitel1: x,
            bevitel2: this.state.id
        }
        fetch(IP.ipcim + 'profkepfrissites', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(this.timeoutHandle = setTimeout(() => {
            this.getProfilkep()
        }, 300))
    }
    felhasznaloNevFrissites = () => {
        try {
            var bemenet = {
                bevitel1: this.state.felhasznalonevCsere,
                bevitel2: this.state.id
            }

            fetch(IP.ipcim + 'felhasznalonevfrissites', {
                method: "POST",
                body: JSON.stringify(bemenet),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
        } catch (e) { console.log(e) }
        finally {
            this.storeData([])
            this.storeData(this.state.felhasznalonevCsere)
            this.sikeresModalMutat()
        }
    }
    mentes = () => {
        let egyezomezok = 0

        if (this.state.felhasznalonevCsere.length < 1) {
            alert("Üresen hagyott mező!")
        }
        else {
            this.state.felhasznalonevek.map((item) => {
                if (item.felhasznalo_nev == this.state.felhasznalonevCsere) {
                    egyezomezok += 1
                }

            })
            if (egyezomezok > 0) {
                alert("Használatban lévő felhasználónév!")
            }
            else {
                this.felhasznaloNevFrissites()
            }
        }


    }
    getFelhasznalok = async => {
        fetch(IP.ipcim + 'felhasznalonevek')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ felhasznalonevek: responseJson })
            })
            .catch((error) => {
                console.error(error);
            })

    }
    getID = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@ID')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {

        }
    }
    modalmutat = () => {
        let bmodal = this.state.modal;
        bmodal = !bmodal
        this.setState({ modal: bmodal })
    }
    getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@felhasznalo')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {

        }
    }
    storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@felhasznalo', jsonValue)
        } catch (e) {
            // saving error
        }
    }
    componentDidMount() {
        this.getKepek();
        this.getData().then((vissza_adatok2) => {
            this.setState({ felhasznalonev: vissza_adatok2 })
            this.getFelhasznalok();

        });
        this.getID().then((vissza_adatok2) => {
            this.setState({ id: vissza_adatok2 })
            this.getProfilkep();
        });
        this.navFocusListener = this.props.navigation.addListener('focus', () => {

            this.getKepek();
            this.getData().then((vissza_adatok2) => {
                this.setState({ felhasznalonev: vissza_adatok2 })


            });
            this.getID().then((vissza_adatok2) => {
                this.setState({ id: vissza_adatok2 })
                this.getProfilkep();
            });
        })

    }
    componentWillUnmount() {
        this.navFocusListener();
        clearTimeout(this.timeoutHandle);
    }



    render() {

        return (
            <View style={{ flexDirection: 'column', flex: 1, backgroundColor: "rgb(50,50,50)" }}>
                <View style={{ flex: 0.5 }}>
                    <Image
                        source={require('./a.png')}
                        style={{ alignSelf: "center", width: '100%', height: '100%', opacity: 0.5 }}
                    />
                    <View style={styles.diszdiv}><Text></Text></View>
                    <View style={styles.kor}>
                        {this.state.profIsLoad ? <ActivityIndicator size="large" color="rgb(1,194,154)" />
                            :
                            <TouchableOpacity onPress={() => this.modalmutat()}><Image source={{ uri: IP.ipcim + this.state.profkep }} style={{ width: width * 0.3, height: "100%", alignSelf: 'center', borderRadius: width * 0.3 / 2 }} />
                            </TouchableOpacity>}



                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: "rgb(18,18,18)" }}>
                    <Text style={{ fontSize: 16, color: "#FFFFFF", margin: 10, marginBottom: 15, borderBottomColor: "rgb(1,194,154)", borderBottomWidth: 1, width: "35%", fontWeight: "500" }}>Felhasználónév</Text>
                    <View style={{ margin: 10 }}>

                        <TextInput
                            cursorColor={"rgb(50,50,50)"}
                            onFocus={() => this.setState({ fokusz1: true })}
                            onBlur={() => this.setState({ fokusz1: false })}
                            placeholderTextColor="white"
                            fontStyle={this.state.felhasznalonevCsere.length == 0 ? 'italic' : 'normal'}
                            style={[this.state.fokusz1 ? styles.textinputfelhact : styles.textinputfelh]}
                            placeholder={this.state.felhasznalonev}
                            value={this.state.felhasznalonevCsere}
                            onChangeText={(felhasznalonev_szoveg) => this.setState({ felhasznalonevCsere: felhasznalonev_szoveg })}
                        >
                        </TextInput>

                    </View>
                    <View style={{ flex: 1 }}>

                        <Text style={{ fontWeight: "bold", color: "white", fontSize: 16, margin: 10, borderBottomColor: "rgb(1,194,154)", borderBottomWidth: 1, width: "35%", }}>Profil</Text>
                        <TouchableOpacity onPress={() => this.createTwoButtonAlert()} style={{ margin: 10, backgroundColor: "red", height: "10%", justifyContent: "center", borderRadius: 15, width: "50%", alignSelf: "flex-start" }}><Text style={{ color: "white", alignSelf: "center" }}>Profil törlése</Text></TouchableOpacity>

                    </View>

                    {this.state.felhasznalonevCsere.length > 0 ?
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
                            <View style={{ flex: 1, backgroundColor: "696969" }}>
                                <TouchableOpacity
                                    onPress={(this.mentes)}
                                    style={{ backgroundColor: "rgb(1,194,154)", width: 65, alignSelf: "flex-end", alignItems: "center", borderRadius: 150 / 2, height: 65, justifyContent: "center", zIndex: 1, }}>
                                    <Feather name="check" size={50} color="black" />
                                </TouchableOpacity>

                            </View>

                        </Animated.View>
                        : <Text></Text>}
                </View>

                <Modal
                    style={{ backgroundColor: "red" }}
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modal}>
                    <View style={styles.modalView}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ flex: 1, borderTopLeftRadius: 40, alignItems: "flex-start", justifyContent: "center" }}>
                                <Text style={{ color: "white", marginLeft: 20, fontSize: 15, fontWeight: "bold" }}>Válaszd ki profilképed.</Text>
                            </View>
                            <View style={{ flex: 0.1, borderTopRightRadius: 40, justifyContent: "center" }}>
                                <Pressable onPress={() => this.setState({ modal: false })}><MaterialIcons name="close" size={30} color="white" />
                                </Pressable>
                            </View>
                        </View>
                        <View style={{ flex: 5, flexDirection: "row" }}>

                            {this.state.kepek.map((item, key) => item.kepek_id > 1 ? <View key={key} style={{ flex: 1, marginTop: 20 }}>
                                <TouchableOpacity
                                    onPress={() => this.Profkepfrissites(item.kepek_id)}
                                >
                                    <View style={this.state.profkep[0] == item.kepek_id ? styles.activeprofdiv : styles.profdiv}>
                                        <Image key={key} source={{ uri: IP.ipcim + item.kepek_nev }} style={{ width: "70%", height: "85%", alignSelf: 'center', borderRadius: 40 }} />
                                    </View>
                                </TouchableOpacity>

                            </View>
                                : <View key={key}></View>)}
                        </View>

                    </View>
                </Modal>
                <Modal
                    style={{ backgroundColor: "red" }}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.sikeresModal}>
                    <View style={styles.modalView1}>
                        <View style={{ flex: 4.5 }}><Text style={{ color: "white", marginLeft: 10 }}>Sikeres mentés!</Text>
                        </View>
                        <View style={{ flex: 0.5, alignItems: "flex-end", }}>
                            <Pressable onPress={() => this.props.navigation.goBack()}><Feather name="arrow-left" size={24} color="rgb(1,194,154)" /></Pressable>
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <Pressable style={{ alignSelf: "flex-end" }} onPress={() => this.setState({ sikeresModal: false })}><MaterialIcons name="close" size={24} color="white" />
                            </Pressable></View>

                    </View>
                </Modal>
            </View>
        );
    }
};
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    button: {
        alignSelf: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: "blue",
        width: 180
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
    kor: {
        backgroundColor: "rgb(50,50,50)",
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: (width * 0.4) / 2,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        bottom: height * 0.02,
        position: "absolute",
        borderColor: "rgb(1,194,154)",
        borderWidth: 2.5
    },
    diszdiv: {
        backgroundColor: "rgb(18,18,18)",
        width: "100%",
        height: "30%",
        position: "absolute",
        bottom: 0,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderColor: "rgb(50,50,50)",
        borderTopWidth: 1,

    },
    countContainer: {
        alignItems: "center",
        padding: 10
    },
    textinputfelh: {
        backgroundColor: "rgb(50,50,50)",
        padding: 5,
        justifyContent: "center",
        height: height * 0.08,
        borderRadius: 10,
        color: "white"
    },
    textinputfelhact: {
        backgroundColor: "rgb(50,50,50)",
        padding: 5,
        justifyContent: "center",
        height: height * 0.08,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: "rgb(1,194,154)",
        color: "white",
    },
    activeprofdiv: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderColor: "rgb(1,194,154)",
        borderWidth: 2
    },
    profdiv: {
        alignItems: "center",
        justifyContent: "center"
    },
    modalView1: {
        flexDirection: "row",
        alignContent: "space-between",
        bottom: 50,
        position: "absolute",
        backgroundColor: '#181818',
        alignItems: 'center',
        width: "100%",
        height: "5%"
    },
});
