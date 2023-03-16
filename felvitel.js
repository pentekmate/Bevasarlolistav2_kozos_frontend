import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Constants from 'expo-constants';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'
import { Entypo } from '@expo/vector-icons';
import { List, Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipcim } from "./IPcim";
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { color, set } from 'react-native-reanimated';
const IP = require('./IPcim')
import { Feather } from '@expo/vector-icons';

const App = () => {
    const navigation = useNavigation();
    const szavak = ["Ár szerint csökkenő", "Ár szerint növekvő", "Legújabb", "Legrégebbi"];
    const [listaszam, setListaszam] = useState(0);
    const [adatok, setAdatok] = useState("");
    const [tartalom, setTartalom] = useState([]);
    const [azonosito, setAzonosito] = useState(0)
    const [isLoading, setisLoading] = useState(true)
    const [listanevek, setListanevek] = useState([])



    const getID = async () => {
        let x = 0
        try {
            const jsonValue = await AsyncStorage.getItem('@ID')
            await jsonValue != null ? JSON.parse(jsonValue) : null;
            x = jsonValue


        } catch (e) {

        }
        finally {
            setAzonosito(x)
            getLista(x)
            setisLoading(false)
        }
    }
    const getLista = (y) => {
        var bemenet = {
            bevitel1: y
        }
        fetch(IP.ipcim + 'felhasznalolistaikesz', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }
        ).then((response) => response.json())
            .then((responseJson) => {
                responseJson.reverse()
                setAdatok(responseJson)
            })
            .catch((error) => {
                console.error(error);
            });


    }
    useFocusEffect(
        React.useCallback(() => {
            getID()

        }, [])
    );

    useEffect(() => {
        let tomb = [];
        getID()
        let tartalomSplitelve = "";
        for (let i = 0; i < adatok.length; i++) {
            tartalomSplitelve = adatok[i].listak_tartalom.split(',');
            adatok[i].listak_tartalom = tartalomSplitelve
            adatok[i].kinyitott = false
        }
        for (let j = 0; j < adatok.length; j++) {
            tomb.push(adatok[j].listak_nev)
        }
        setListanevek(tomb)
        console.log(listanevek)


    }, []);

    let row = [];
    let prevOpenedRow;

    const getParsedDate = (strDate) => {
        var strSplitDate = String(strDate).split(' ');
        var date = new Date(strSplitDate[0]);
        var dd = date.getDate() + 1;
        var mm = date.getMonth();

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

    const _handlePress = (id) => {
        let tombmentese = adatok
        for (let i = 0; i < adatok.length; i++) {
            if (adatok[i].listak_id == id) {
                tombmentese[i].kinyitott = !tombmentese[i].kinyitott

            }
            else {
                tombmentese[i].kinyitott = false
            }
            setAdatok(tombmentese)
            //console.log(JSON.stringify(tombmentese))

        }
        
    }

    const getlistakid = (id) => {
        let uj = [];
        let megujabb = [];
        adatok.map((item) => {
            if (item.listak_id == id) {
                megujabb = item.listak_tartalom.split(',')
            }
        });
        for (let i = 0; i < megujabb.length; i++) {
            uj.push({ nev: megujabb[i], isChecked: false, id: i })
            setTartalom(uj)
        }

    }

    const rendezett = (rend) => {

        var bemenet = {
            bevitel1: azonosito
        }
        fetch(IP.ipcim + rend, {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }
        ).then((response) => response.json())
            .then((responseJson) => {
                setAdatok(responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const renderItem = ({ item, index }, onClick) => {
        //
        const closeRow = (index) => {
            //console.log('closerow');
            if (prevOpenedRow && prevOpenedRow !== row[index]) {
                prevOpenedRow.close();
            }
            prevOpenedRow = row[index];
        };

        const renderRightActions = (progress, dragX, onClick) => {
            return (
                <View
                    style={{
                        margin: 0,
                        alignContent: 'center',
                        justifyContent: 'center',
                        backgroundColor: "red",
                        borderRadius: 10,
                        marginTop: 9,
                        height: width * 0.17,
                        width: width * 0.17,
                    }}>
                    <TouchableOpacity onPress={onClick} ><Text style={{ color: "white", fontSize: 18, textAlign: "center" }}><Ionicons name="trash-outline" size={22} color="white" /></Text>

                    </TouchableOpacity>
                </View>
            );
        };

        return (

            <View style={{ marginTop: 10 }}>
                <Swipeable
                    renderRightActions={(progress, dragX) =>
                        renderRightActions(progress, dragX, onClick)
                    }
                    onSwipeableOpen={() => closeRow(index)}
                    ref={(ref) => (row[index] = ref)}
                    rightOpenValue={-100}>
                    <List.Section  >
                        <List.Accordion
                            right={props =>item.kinyitott==true?<AntDesign name="caretup" size={20} color="rgb(1,194,154)" />:<AntDesign name="caretdown" size={20} color="rgb(1,194,154)" /> }
                            theme={{ colors: { background: 'rgb(50,50,50)' } }}
                            title={<Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{item.listak_nev}</Text>}
                            description={<Text style={{ color: "rgb(1,194,154)" }}>{getParsedDate(item.listak_keszdatum)}</Text >}
                            style={{ backgroundColor: "rgb(32,32,32)", height: height * 0.1, borderTopRightRadius: 15, margin: 3 }}
                            expanded={item.kinyitott}
                            onPress={() => { _handlePress(item.listak_id); getlistakid(item.listak_id); }}>
                            {tartalom.map((item, key) =>
                                <List.Item key={key} title={item.nev} titleStyle={{ color: "white" }}></List.Item>
                            )}
                            <View>
                                <Text style={{ fontSize: 20, textAlign: "right", marginRight: 10, color: "white" }}>{item.listak_ar} Ft</Text>
                            </View>
                        </List.Accordion>
                    </List.Section>
                </Swipeable>
            </View>


        );
    };

    const removeItem = (id) => {
        setAdatok((current) =>
            current.filter((data) => data.listak_id != id))
    }

    const deleteItem = (id) => {
        var adatok = {
            bevitel5: id
        }
        try {
            fetch(IP.ipcim + 'listatorles', {
                method: 'DELETE',
                body: JSON.stringify(adatok),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
        }
        catch (e) {

        }
        finally {
            removeItem(id)

        }
    };
    const DefButtonTxt = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Entypo name="select-arrows" size={20} color={"white"} />
            </View>
        );
    };
    const DefButtonTxt1 = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                <Feather style={{ paddingTop: 5, }} name="search" size={20} color="white" />
            </View>
        );
    };

    const rendezes = (index) => {
        if (index == 0) {
            rendezett("listakarszerintcsokk")
        }
        if (index == 1) {
            rendezett("listakarszerintnov")
        }
        if (index == 2) {
            rendezett("listakdatumszerintcsokk")
        }
        if (index == 3) {
            rendezett("listakdatumszerintnov")
        }
    }
    const textinput = (x) => {
        let tomb = adatok
        for (let i = 0; i < adatok.length; i++) {
            if (adatok[i].listak_nev == x) {
                tomb = adatok[i]
                setAdatok(tomb)
            }

        }
    }

    return (
        <View style={styles.container}>
            {isLoading == true ? <ActivityIndicator size="large" color="rgb(1,194,154)"></ActivityIndicator> :
                adatok.length > 0 ?
                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: "rgb(18,18,18)", top: 0, height: height * 0.05, justifyContent: "center", flexDirection: "row" }}>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <SelectDropdown
                                    dropdownIconPosition={"left"}
                                    defaultButtonText={"Rendezes"}
                                    renderDropdownIcon={DefButtonTxt}
                                    rowStyle={{ backgroundColor: "rgb(50,50,50)", borderRadius: 10, borderBottomColor: "black", borderWidth: 2 }}
                                    rowTextStyle={{ color: "white" }}
                                    dropdownStyle={{ backgroundColor: 'transparent', width: 200 }}
                                    buttonStyle={{ borderRadius: 20, backgroundColor: "rgb(50,50,50)", width: 150, height: 35, borderColor: "white", borderWidth: 2 }}
                                    data={szavak}
                                    onSelect={(selectedItem, index) => {
                                        setListaszam(index)
                                        console.log(selectedItem, index)
                                        rendezes(index)
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return <View style={{ flexDirection: 'row' }}>
                                            <Entypo name="select-arrows" size={22} color={"white"} /><Text style={{ color: "white" }}>Rendezés</Text>
                                        </View>
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <SelectDropdown
                                    dropdownIconPosition={"left"}
                                    defaultButtonText={"kereses"}
                                    searchPlaceHolder="Keresés"
                                    renderDropdownIcon={DefButtonTxt1}
                                    buttonStyle={{ borderRadius: 20, backgroundColor: "rgb(50,50,50)", width: "100%", height: 35, borderColor: "white", borderWidth: 2 }}
                                    data={listanevek}
                                    search
                                    onChangeSearchInputText={(text) => textinput(text)}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return <View style={{ flexDirection: 'row' }}>
                                            <Entypo name="select-arrows" size={22} color={"white"} /><Text style={{ color: "white" }}>Rendezés</Text>
                                        </View>
                                    }}

                                />
                            </View>
                        </View>

                        <FlatList
                            data={adatok}
                            renderItem={(v) =>
                                renderItem(v, () => {
                                    deleteItem(v.item.listak_id);
                                })
                            }
                            keyExtractor={(item) => item.listak_id}></FlatList>
                    </View>
                    :
                    <View style={{ alignSelf: "center", flex: 1, justifyContent: "center" }}>
                        <Text style={{ color: "white", fontSize: 15, margin: 10 }}>Úgy tűnik jelenleg nem fejeztél be egy listát sem.</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Listák")}>
                            <Text style={{ alignSelf: "center", color: "rgb(1,194,154)", fontSize: 20 }}>Listáim megtekintése!</Text>
                        </TouchableOpacity>
                    </View>
            }


        </View>
    );
};


export default App;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(50,50,50)',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});