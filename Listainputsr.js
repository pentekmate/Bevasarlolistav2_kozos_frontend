import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Dimensions, FlatList, Image, Animated, PanResponder } from "react-native";
import CounterInput from "react-native-counter-input";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { ImagesAssets } from "./Kepek/kepek";



export default class ButtonBasics extends Component {
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

            tomb: [],
            listaelem: "",
            filteredDataSource: ["Articsóka",
                "Bimbós kel",
                "Brokkoli",
                "Burgonya (nyári)",
                "Burgonya (téli)",
                "Céklarépa",
                "Cikória",
                "Csicsóka",
                "Cukkini",
                "Édes kömény",
                "Endívia saláta",
                "Fejes saláta",
                "Fekete retek",
                "Fokhagyma",
                "Halványító zeller",
                "Jégcsapsaláta",
                "Káposzta",
                "Káposzta savanyított",
                "Karalábé",
                "Karfiol",
                "Kelkáposzta",
                "Kínai kel",
                "Kukorica tejes",
                "Mangold",
                "Olívabogyó",
                "Padlizsán",
                "Paradicsom",
                "Paraj (spenót)",
                "Pasztinák",
                "Patisszon",
                "Petrezselyem zöldje",
                "Petrezselyemgyökér",
                "Póréhagyma",
                "Rebarbara",
                "Retek, hónapos",
                "Sárgarépa",
                "Sóska",
                "Spárga",
                "Sütőtök",
                "Torma",
                "Tök főző",
                "Uborka",
                "Újhagyma",
                "Vöröshagyma",
                "Zellergumó",
                "Zöldbab",
                "Zöldborsó",
                "Zöldpaprika",
                "Név",
                "Alma",
                "Ananász",
                "Banán",
                "Birsalma",
                "Citrom",
                "Cseresznye",
                "Csipkebogyó, friss",
                "Cukordinnye/sárgadinnye",
                "Datolya",
                "Egres",
                "Eper, fa",
                "Füge friss",
                "Füge szárított",
                "Gránátalma",
                "Grapefruit",
                "Görögdinnye",
                "Kajszibarack",
                "Kivi",
                "Körte",
                "Licsi",
                "Málna",
                "Mandarin",
                "Mangó",
                "Mazsola",
                "Meggy",
                "Mirabella",
                "Narancs",
                "Naspolya",
                "Nektarin",
                "Őszibarack",
                "Papaya",
                "Ribiszke fekete",
                "Ribiszke piros",
                "Szamóca földieper",
                "Szeder",
                "Szilva besztercei",
                "Szilva vörös",
                "Szőlő",
                "Zöldringló",
                "Aludttej",
                "Bivalytej",
                "Brick sajt",
                "Brie sajt",
                "Camembert sajt",
                "Cheddar sajt",
                "Cheshire sajt",
                "Colby sajt",
                "Edámi sajt",
                "Ementáli sajt",
                "Fagylalt",
                "Feta sajt",
                "Fontina sajt",
                "Főzőtejszín 10%-os",
                "Főzőtejszín 20%-os",
                "Gomolya sajt",
                "Gomolyatúró",
                "Gorgonzola sajt",
                "Gouda sajt",
                "Görög joghurt",
                "Gruyere sajt",
                "Habtejszín 30%-os",
                "Halloumi sajt",
                "Havarti sajt",
                "Író",
                "Jégkrém",
                "Joghurt",
                "Juhsajt",
                "Juhtej",
                "Juhtúró",
                "Kávétejszín",
                "Kecskesajt",
                "Kecsketej",
                "Kefir",
                "Kéksajt",
                "Köményes sajt",
                "Körözött",
                "Krémsajt",
                "Krémtúró",
                "Limburger sajt",
                "Márványsajt",
                "Mascarpone sajt",
                "Monterey sajt",
                "Mozzarella sajt",
                "Muenster sajt",
                "Neufchatel sajt",
                "Óvári sajt",
                "Pálpusztai sajt",
                "Parenyica sajt",
                "Parmezán sajt",
                "Provolone sajt",
                "Puding",
                "Ricotta sajt",
                "Rokfort sajt",
                "Romano sajt",
                "Sűrített tej",
                "Tehéntej (0,1%-os)",
                "Tehéntej (1,5%-os)",
                "Tehéntej (2,8%-os)",
                "Tehéntej (3,5%-os)",
                "Tehéntej (3,6%-os)",
                "Tehéntúró (félzsíros)",
                "Tehéntúró (sovány)",
                "Tejföl (12%-os)",
                "Tejföl (20%-os)",
                "Tejpor (sovány)",
                "Tejpor (zsíros)",
                "Tejszínhab",
                "Tilsiti sajt",
                "Trappista sajt",
                "Túró Rudi",
                "Vaj",
                "Vajkrém", "Abonett",
                "Alföldi kenyér",
                "Bakonyi barna kenyér",
                "Briós",
                "Burgonyás kenyér",
                "Búzacsírás kenyér",
                "Búzakorpás kenyér",
                "Diós csiga",
                "Erzsébet kenyér",
                "Fánk",
                "Fehér kenyér",
                "Félbarna kenyér",
                "Francia kenyér",
                "Gofri",
                "Graham kenyér",
                "Kakaós csiga",
                "Kalács",
                "Kétszersült",
                "Kifli",
                "Kuglóf",
                "Kukoricás kenyér",
                "Lekváros bukta",
                "Lenmagos barnakenyér",
                "Magos kenyér",
                "Magvas barnakenyér",
                "Mazsolás kenyér",
                "Muffin",
                "Olasz kenyér",
                "Palacsinta",
                "Pirítós",
                "Piskótatekercs",
                "Pita (fehér lisztből)",
                "Pita (teljes kiőrlésű)",
                "Pogácsa (tepertős)",
                "Pogácsa (vajas)",
                "Pumpernickel",
                "Rozskenyér",
                "Teljes kiőrlésű kenyér",
                "Teljes kiőrlésű kifli",
                "Teljes kiőrlésű zsemle",
                "Tökmagos kenyér",
                "Túrós batyu",
                "Zabkorpás kenyér",
                "Zsemle",
            ],
            masterDataSource: ["Articsóka",
                "Bimbós kel",
                "Brokkoli",
                "Burgonya (nyári)",
                "Burgonya (téli)",
                "Céklarépa",
                "Cikória",
                "Csicsóka",
                "Cukkini",
                "Édes kömény",
                "Endívia saláta",
                "Fejes saláta",
                "Fekete retek",
                "Fokhagyma",
                "Halványító zeller",
                "Jégcsapsaláta",
                "Káposzta",
                "Káposzta savanyított",
                "Karalábé",
                "Karfiol",
                "Kelkáposzta",
                "Kínai kel",
                "Kukorica tejes",
                "Mangold",
                "Olívabogyó",
                "Padlizsán",
                "Paradicsom",
                "Paraj (spenót)",
                "Pasztinák",
                "Patisszon",
                "Petrezselyem zöldje",
                "Petrezselyemgyökér",
                "Póréhagyma",
                "Rebarbara",
                "Retek, hónapos",
                "Sárgarépa",
                "Sóska",
                "Spárga",
                "Sütőtök",
                "Torma",
                "Tök főző",
                "Uborka",
                "Újhagyma",
                "Vöröshagyma",
                "Zellergumó",
                "Zöldbab",
                "Zöldborsó",
                "Zöldpaprika",
                "Név",
                "Alma",
                "Ananász",
                "Banán",
                "Birsalma",
                "Citrom",
                "Cseresznye",
                "Csipkebogyó, friss",
                "Cukordinnye/sárgadinnye",
                "Datolya",
                "Egres",
                "Eper, fa",
                "Füge friss",
                "Füge szárított",
                "Gránátalma",
                "Grapefruit",
                "Görögdinnye",
                "Kajszibarack",
                "Kivi",
                "Körte",
                "Licsi",
                "Málna",
                "Mandarin",
                "Mangó",
                "Mazsola",
                "Meggy",
                "Mirabella",
                "Narancs",
                "Naspolya",
                "Nektarin",
                "Őszibarack",
                "Papaya",
                "Ribiszke fekete",
                "Ribiszke piros",
                "Szamóca földieper",
                "Szeder",
                "Szilva besztercei",
                "Szilva vörös",
                "Szőlő",
                "Zöldringló",
                "Aludttej",
                "Bivalytej",
                "Brick sajt",
                "Brie sajt",
                "Camembert sajt",
                "Cheddar sajt",
                "Cheshire sajt",
                "Colby sajt",
                "Edámi sajt",
                "Ementáli sajt",
                "Fagylalt",
                "Feta sajt",
                "Fontina sajt",
                "Főzőtejszín 10%-os",
                "Főzőtejszín 20%-os",
                "Gomolya sajt",
                "Gomolyatúró",
                "Gorgonzola sajt",
                "Gouda sajt",
                "Görög joghurt",
                "Gruyere sajt",
                "Habtejszín 30%-os",
                "Halloumi sajt",
                "Havarti sajt",
                "Író",
                "Jégkrém",
                "Joghurt",
                "Juhsajt",
                "Juhtej",
                "Juhtúró",
                "Kávétejszín",
                "Kecskesajt",
                "Kecsketej",
                "Kefir",
                "Kéksajt",
                "Köményes sajt",
                "Körözött",
                "Krémsajt",
                "Krémtúró",
                "Limburger sajt",
                "Márványsajt",
                "Mascarpone sajt",
                "Monterey sajt",
                "Mozzarella sajt",
                "Muenster sajt",
                "Neufchatel sajt",
                "Óvári sajt",
                "Pálpusztai sajt",
                "Parenyica sajt",
                "Parmezán sajt",
                "Provolone sajt",
                "Puding",
                "Ricotta sajt",
                "Rokfort sajt",
                "Romano sajt",
                "Sűrített tej",
                "Tehéntej (0,1%-os)",
                "Tehéntej (1,5%-os)",
                "Tehéntej (2,8%-os)",
                "Tehéntej (3,5%-os)",
                "Tehéntej (3,6%-os)",
                "Tehéntúró (félzsíros)",
                "Tehéntúró (sovány)",
                "Tejföl (12%-os)",
                "Tejföl (20%-os)",
                "Tejpor (sovány)",
                "Tejpor (zsíros)",
                "Tejszínhab",
                "Tilsiti sajt",
                "Trappista sajt",
                "Túró Rudi",
                "Vaj",
                "Vajkrém", "Abonett",
                "Alföldi kenyér",
                "Bakonyi barna kenyér",
                "Briós",
                "Burgonyás kenyér",
                "Búzacsírás kenyér",
                "Búzakorpás kenyér",
                "Diós csiga",
                "Erzsébet kenyér",
                "Fánk",
                "Fehér kenyér",
                "Félbarna kenyér",
                "Francia kenyér",
                "Gofri",
                "Graham kenyér",
                "Kakaós csiga",
                "Kalács",
                "Kétszersült",
                "Kifli",
                "Kuglóf",
                "Kukoricás kenyér",
                "Lekváros bukta",
                "Lenmagos barnakenyér",
                "Magos kenyér",
                "Magvas barnakenyér",
                "Mazsolás kenyér",
                "Muffin",
                "Olasz kenyér",
                "Palacsinta",
                "Pirítós",
                "Piskótatekercs",
                "Pita (fehér lisztből)",
                "Pita (teljes kiőrlésű)",
                "Pogácsa (tepertős)",
                "Pogácsa (vajas)",
                "Pumpernickel",
                "Rozskenyér",
                "Teljes kiőrlésű kenyér",
                "Teljes kiőrlésű kifli",
                "Teljes kiőrlésű zsemle",
                "Tökmagos kenyér",
                "Túrós batyu",
                "Zabkorpás kenyér",
                "Zsemle",
            ],
            latszodik: false,
            darab: 0,
            fokusz1: false
        };
    }

    componentDidMount() {
        this.getData().then((vissza_adatok2) => {

            this.setState({ tomb: vissza_adatok2 })
        });
    }
    componentWillUnmount() {
        try {
            this.storeData(this.state.tomb)
        }
        catch (err) { }
        finally {
            console.log("Sikeres felvitel")
        }

    }

    getItem = (item) => {

        if (this.state.darab == 0) {
            alert("Adj hozzá legalább egy darab terméket.")
        }
        else {
            console.log("counter:", this.state.darab, item)

            this.state.tomb?.push({

                megnevezes: this.state.darab + " " + item

            })

            this.state.listaelem = "";

            this.setState({ listaelem: "" })
            this.setState({ darab: 0 })
            this.setState({ latszodik: false })

        }

    };

    searchFilterFunction = (text) => {
        this.state.latszodik = true

        if (text) {
            const newData = this.state.masterDataSource.filter(
                function (item) {
                    const itemData = item
                        ? item.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            this.setState({ filteredDataSource: newData });
            this.setState({ listaelem: text })
        } else {
            this.state.filteredDataSource = this.state.masterDataSource
            this.setState({ listaelem: text })
        }

        if (this.state.listaelem.length < 2) {
            this.setState({ latszodik: false })
        }

    };
    getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@listaelemek')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    }

    storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@listaelemek', jsonValue)
        } catch (e) {
            // saving error
        }
    }
    //adatok mentése asyncstorageba majd képernyő visszaugratása
    tarol = () => {

        this.props.navigation.navigate('Listalétrehozás')
        try {
            this.storeData(this.state.tomb)
        }
        catch (err) { }
        finally {
            console.log("Sikeres felvitel")
        }

    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: "column", flex: 1, backgroundColor: "rgb(50,50,50)", }}>

                    {/*------------------------------------------------------------------VIEW RENDEZÉSE SEARCHBAR---------------------------------------------------------------------------------------------------------*/}
                    <View style={[this.state.fokusz1 ? styles.keresedfocus : styles.keresesdiv, { flexDirection: "row", height: height * 0.06, backgroundColor: "rgb(18,18,18)", }]}>
                        <Feather style={{ paddingTop: 5, }} name="search" size={28} color="white" />
                        <TextInput
                            onFocus={() => this.setState({ fokusz1: true })}
                            onBlur={() => this.setState({ fokusz1: false })}
                            autoFocus={true}
                            cursorColor={"white"}
                            style={styles.textInputStyle}
                            onChangeText={(text) => this.searchFilterFunction(text)}
                            value={this.state.listaelem}
                            placeholderTextColor="white"
                            placeholder="Termék keresése.."
                        ></TextInput>
                    </View>

                    <Animated.View
                        style={{
                            transform: [{ translateX: this.pan.x }, { translateY: this.pan.y }],
                        }}
                        {...this.panResponder.panHandlers}>
                        <View style={{ flex: 1, backgroundColor: "696969" }}>
                            {this.state.tomb?.length > 0 ?
                                <TouchableOpacity
                                    onPress={(this.tarol)}
                                    style={{ backgroundColor: "rgb(1,194,154)", width: 65, alignSelf: "flex-end", alignItems: "center", borderRadius: 150 / 2, height: 65, justifyContent: "center", zIndex: 2, bottom: -width * 1.57, left: -width * 0.03 }}>
                                   <Feather name="save" size={40} color="white" />
                                </TouchableOpacity> : <Text></Text>}

                        </View>
                    </Animated.View>




                    <View style={{ flex: 9 }}>
                        {this.state.latszodik == true ?
                            <FlatList
                                data={this.state.filteredDataSource}
                                keyExtractor={(item, index) => String(index)}
                                renderItem={({ item, key }) => (

                                    <View style={styles.listaelemek} key={key}>

                                        <View key={key} style={styles.listaelemektext} >
                                            <Image
                                                source={ImagesAssets.kep3}
                                                style={{ width: 23, height: 23 }}
                                            />
                                            <Text key={key} style={{ fontSize: 20, color: "white", fontWeight: "bold", position: "absolute", paddingLeft: 35 }}>{item}</Text>

                                        </View>
                                        <View style={styles.pluszjel}>
                                            <CounterInput
                                                min={0}
                                                horizontal={true}
                                                backgroundColor="rgb(50,50,50)"
                                                increaseButtonBackgroundColor="rgb(1,194,154)"
                                                decreaseButtonBackgroundColor="rgb(1,194,154)"
                                                style={{ height: height * 0.01, width: width * 0.45, backgroundColor: "white", color: "red" }}
                                                onChange={(counter) => this.setState({ darab: counter })}
                                            />
                                        </View>
                                        <TouchableOpacity style={styles.hozzaadas} onPress={() => this.getItem(item)}><AntDesign name="check" size={30} color="rgb(1,194,154)" /></TouchableOpacity>
                                    </View>

                                )}
                            />
                            : <Text style={{ textAlign: "center", textAlignVertical: "center" }}></Text>}
                    </View>


                </View>


            </View>
        );
    }
}
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",

    },
    textInputStyle: {
        backgroundColor: "rgb(18,18,18)",
        textAlignVertical: "top",
        borderRadius: 10,
        textAlignVertical: "auto",
        fontStyle: "italic",
        color: "white",
        fontWeight: "500",
        padding: 5
    }
    ,
    image: {
        backgroundColor: "#808080",
        width: 30,
        height: 55,
        width: width * 0.1,
        justifyContent: "center"
    }, listaelemek: {
        margin: 10,
        backgroundColor: "rgb(18,18,18)",
        borderRadius: 15,
        height: 150,
        borderColor: "rgb(120, 130, 130)",
        borderWidth: 1

    },
    listaelemektext: {
        margin: 20,
        height: 40,
        width: width * 0.5


    },
    segedview: {
        marginTop: 20,
        backgroundColor: "green",
        width: width * 0.7,
        borderBottomWidth: 1,
        borderBottomColor: "rgb(50,50,50)",
    },
    pluszjel: {
        width: width * 0.01,
        alignSelf: "flex-start",
        marginLeft: 10
    },
    keresesdiv: {
        alignItems: "center",
        borderRadius: 10,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "black",
        borderWidth: 2,
        marginTop: 5,
        borderWidth: 1,
        borderColor: "rgb(120, 130, 130)"
    },
    hozzaadas: {
        alignSelf: "flex-end",
        width: 50,
        height: 50,
        backgroundColor: "rgb(50,50,50)",
        borderRadius: 75 / 2,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    keresedfocus: {
        alignItems: "center",
        borderRadius: 10,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "black",
        borderWidth: 2,
        marginTop: 5,
        borderWidth: 2,
        borderColor: "rgb(1,194,154)"
    }

});
