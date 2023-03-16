import React, { Component } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import ProgressBar from "react-native-animated-progress";
import DialogInput from "react-native-dialog-input";
import { ipcim } from "./IPcim";
import { ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const IP = require('./IPcim')


export default class Seged extends Component {
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
            data: [],
            tartalom_tomb: [],
            zsolt: "",
            adat: [],
            zoldseggyumolcs: ["Articsóka",
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
                "Káposzta (fejes)",
                "Káposzta, savanyított",
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
                "Tök, főző",
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
                "Füge, friss",
                "Füge, szárított",
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
                "Ribiszke, fekete",
                "Ribiszke, piros",
                "Szamóca, földieper",
                "Szeder",
                "Szilva, besztercei",
                "Szilva, vörös",
                "Szőlő", "Zöldringló"
            ],
            tejtermekek: ["Aludttej",
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
                "Vajkrém"
            ],
            pek: ["Abonett",
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
                "Zsemle"
            ],
            egyeb: [],
            zoldseggyumolcsTalal: [],
            tejtermekekTalal: [],
            pekTalal: [],
            valogatott: [],
            szam: 0,
            tombHossz: 0,
            megvasaroltElemek: 0,
            alertMutatasa: false,
            osszeslista: 0,
            felhasznaloid: 0
        };
    }
    storeListaElkezdve = async (value) => {
        try {
            
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem("listakezdve",jsonValue)
        } catch (e) {
            // saving error
        }
    }
    storeListaId = async (value) => {
        let a = String(this.props.route.params.aktid)
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(a, jsonValue)
        } catch (e) {
            // saving error
        }
    }
    getListaId = async () => {
        let a = String(this.props.route.params.aktid)
        try {
            const jsonValue = await AsyncStorage.getItem(a)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {

        }
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
            this.setState({ felhasznaloid: x })
        }
    }
    getListakszama(y) {
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
                        this.setState({ osszeslista: item.felhasznalo_keszlistakszama })
                    })
                );
            })
    }
    setOsszeslistakszama() {
        let noveles = this.state.osszeslista += 1
        var bemenet = {
            bevitel1: noveles,
            bevitel2: this.state.felhasznaloid
        }
        fetch(IP.ipcim + 'keszlistafrissites', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        }

        )
    }
    felvitel = (ar) => {
        try {
            var adatok = {
                bevitel3: ar,
                bevitel4: this.props.route.params.aktid
            }

            const response = fetch(IP.ipcim + 'listabefejezese', {
                method: "POST",
                body: JSON.stringify(adatok),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
        }
        catch (e) { console.log(e) }
        finally {

            this.setOsszeslistakszama();
            alert("Sikeres mentés")
            this.setState({ alertMutatasa: false })
        }

    }
    funckio = () => {
        let uj = [];
        this.state.zsolt = this.props.route.params.akttart;
        uj = this.state.zsolt?.split(',')
        this.setState({ data: uj })
        this.state.data = uj;
        let x = uj.length
        this.setState({ tombHossz: x })

        this.state.zoldseggyumolcs.map((item) => {
            this.state.data.map((item1) => {
                if (item1.includes(item)) {
                    let index = this.state.data.indexOf(item1)
                    this.state.data.splice(index, 1)
                    this.state.zoldseggyumolcsTalal.push(item1)
                }
            })
        })
        this.state.tejtermekek.map((item) => {
            this.state.data.map((item1) => {
                if (item1.includes(item)) {
                    let index = this.state.data.indexOf(item1)
                    this.state.data.splice(index, 1)
                    this.state.tejtermekekTalal.push(item1)
                }
            })
        })
        this.state.pek.map((item) => {
            this.state.data.map((item1) => {
                if (item1.includes(item)) {
                    let index = this.state.data.indexOf(item1)
                    this.state.data.splice(index, 1)
                    this.state.pekTalal.push(item1)
                }
            })
        })
        if (this.state.pekTalal.length > 0) {
            this.state.valogatott.push("Péksütemény")
            for (let i = 0; i < this.state.pekTalal.length; i++) {
                this.state.valogatott.push(this.state.pekTalal[i])
            }
        }

        if (this.state.zoldseggyumolcsTalal.length > 0) {
            this.state.valogatott.push("Zöldségek")
            for (let i = 0; i < this.state.zoldseggyumolcsTalal.length; i++) {
                this.state.valogatott.push(this.state.zoldseggyumolcsTalal[i])
            }
        }

        if (this.state.tejtermekekTalal.length > 0) {
            this.state.valogatott.push("Tejtermék")
            for (let i = 0; i < this.state.tejtermekekTalal.length; i++) {
                this.state.valogatott.push(this.state.tejtermekekTalal[i])
            }
        }

        if (this.state.data.length > 0) {
            this.state.valogatott.push("Egyéb")
            this.state.data.map((item) => {
                this.state.valogatott.push(item)
            })
        }


        for (let i = 0; i < this.state.valogatott.length; i++) {
            this.state.tartalom_tomb.push({
                id: i,
                isChecked: false,
                nev: this.state.valogatott[i]
            })
        }
    }
    
    handleChange = (id) => {
       
    
    
        let Noveltszam = this.state.szam
        let Megvasarolva = this.state.megvasaroltElemek
        let novelesErteke = (1 / this.state.tombHossz) * 100
        let zoldNoveles = (100 / 100) * novelesErteke


        let temp = this.state.tartalom_tomb.map((product) => {
            if (id === product.id) {
                return { ...product, isChecked: !product.isChecked };
            }
            return product;
        });

        this.setState({ tartalom_tomb: temp })

        temp.map((item) => {
            if (item.isChecked == true && id == item.id) {
                Noveltszam += zoldNoveles
                Megvasarolva += 1
            }
            else if (item.isChecked == false && id == item.id) {
                Megvasarolva -= 1
                Noveltszam -= zoldNoveles
            }
        })



        this.setState({ megvasaroltElemek: Megvasarolva })
        this.setState({ szam: Noveltszam })
      
    }
    componentDidMount() {
        this.getID();
        this.funckio();
        fetch(IP.ipcim + 'regilistatorles', { method: 'DELETE' })

        this.getListaId().then((vissza_adatok2) => {
            if (vissza_adatok2?.length > 0) {
                vissza_adatok2?.map((item) => {
                    if (item.id == this.props.route.params.aktid) {
                        this.setState({ tartalom_tomb: item.tartalom })
                        this.setState({ megvasaroltElemek: item.megvasarolva })
                        this.setState({ szam: item.haladas })
                    }
                })
            }
            else {
                let osszes = []
                osszes.push({
                    id: this.props.route.params.aktid,
                    tartalom: this.state.tartalom_tomb,
                    megvasarolva: this.state.megvasaroltElemek,
                    haladas: this.state.szam
                })
                this.storeListaId([])
                this.storeListaId(osszes)
            }
        });


    }
    componentWillUnmount() {
        let osszes = []
        osszes?.push({
            id: this.props.route.params.aktid,
            tartalom: this.state.tartalom_tomb,
            megvasarolva: this.state.megvasaroltElemek,
            haladas: this.state.szam
        })
        this.storeListaId(osszes)
        //this.storeListaId([])
    }

    render() {
        return (
            <ScrollView
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: "rgb(50,50,50)" }}>
                <View style={{ position: "relative", backgroundColor: "rgb(18,18,18)", borderBottomRadius: 5 }}>
                    <View style={{ position: "relative", flexDirection: "row", }}>
                        <View style={{ flex: 10 }}><Text style={{ color: "white", fontSize: 18, margin: 10 }}>Termékek megvásárolva:</Text></View>
                        <View style={{ flex: 2 }}><Text style={{ color: "white", margin: 10 }}>{this.state.tombHossz}/{this.state.megvasaroltElemek}</Text></View>
                    </View>
                    <View style={{ margin: 10 }}>
                        <ProgressBar
                            progress={this.state.szam}
                            height={8}
                            backgroundColor="rgb(1,194,154)"
                            trackColor="#505050" />
                    </View>
                </View>

                <View style={{ flex: 1, height: height * 1.1, flexDirection: "column" }}>
                    <View style={{ flex: 8 }}>
                        {this.state.tartalom_tomb.map((item, key) =>
                            <View key={key}>
                                <View style={styles.elemektrue}>
                                    {item.nev == "Péksütemény" ? <Text style={styles.kategorianev}>
                                        <MaterialCommunityIcons name="food-croissant" color="white" size={27} /> {item.nev}</Text>
                                        : item.nev == "Zöldségek" ? <Text style={styles.kategorianev}>
                                            <MaterialCommunityIcons name="food-apple-outline" color="white" size={27} /> Zöldség, Gyümölcs</Text>
                                            : item.nev == "Tejtermék" ? <Text style={styles.kategorianev}>
                                                <MaterialCommunityIcons name="cow" color="white" size={27} /> {item.nev}</Text>
                                                : item.nev == "Egyéb" ? <Text style={styles.kategorianev}>
                                                    <FontAwesome name="shopping-basket" color="white" size={20} /> {item.nev}</Text>
                                                    : <Pressable onPress={() => { this.handleChange(item.id); }}>
                                                        {item.isChecked ? <AntDesign name="check" size={27} color="rgb(1,194,154)" /> :
                                                            <MaterialIcons name="radio-button-unchecked" size={27} color="rgb(1,194,154)" />}
                                                    </Pressable>
                                    }
                                    {item.nev == "Péksütemény" || item.nev == "Zöldség" || item.nev == "Tejtermék" || item.nev == "Egyéb" ?
                                        <Text style={{ marginBottom: 15 }}></Text> : <Text style={item.isChecked ? styles.betutrue : styles.betufalse}> {item.nev}</Text>
                                    }

                                </View>
                            </View>)}

                    </View>

                    <View style={{ flex: 6 }}>
                        <Animated.View
                            style={{
                                zIndex: 2,
                                transform: [{ translateX: this.pan.x }, { translateY: this.pan.y }],
                            }}
                            {...this.panResponder.panHandlers}>
                            <View style={{ flex: 1, backgroundColor: "696969" }}>
                                <TouchableOpacity
                                    onPress={(() => this.setState({ alertMutatasa: true }))}
                                    style={{ backgroundColor: "rgb(1,194,154)", width: 65, alignSelf: "flex-end", alignItems: "center", borderRadius: 150 / 2, height: 65, justifyContent: "center", zIndex: 1, }}>
                                    <FontAwesome name="money" size={24} color="black" />
                                </TouchableOpacity>

                            </View>
                        </Animated.View>
                    </View>
                    <DialogInput
                        isDialogVisible={this.state.alertMutatasa}
                        title={"Fizetett összeg:"}
                        textInputProps={{keyboardType:'numeric'}}
                        submitInput={(fizetettosszeg) => {
                            this.felvitel(fizetettosszeg), this.props.navigation.navigate('Listák')
                        }}
                        closeDialog={() => this.setState({ alertMutatasa: false })}
                    ></DialogInput>

                </View>

            </ScrollView>
        );
    }
}
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    elemektrue: {
        backgroundColor: "rgb(50,50,50)",
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 20,
       
    },
    kategorianev: {
        alignSelf: "center",
        fontSize: 25,
        color: "white",
        width: "100%",
        textAlignVertical: "center",
        backgroundColor: "rgb(18,18,18)",
        borderRadius: 5,
        justifyContent:"center"
    },
    betutrue: {
        color: "grey",
        fontSize: 20
    },
    betufalse: {
        color: "white",
        fontSize: 20
    },
    blur: {
        width: width * 0.3,
        backgroundColor: "black",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "rgb(120, 130, 130)",
    },
    focus: {
        width: width * 0.3,
        backgroundColor: "black",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "rgb(1,194,154)",
    },
    mentesgomb: {
        width: width * 0.3,
        borderRadius: 5,
        backgroundColor: "rgb(1,194,154)",
    }
});
