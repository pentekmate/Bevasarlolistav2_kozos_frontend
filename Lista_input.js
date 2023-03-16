import React, { Component } from "react";
import { Feather } from '@expo/vector-icons';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Animated,
  PanResponder,
  Modal
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DialogInput from "react-native-dialog-input";
import { Entypo } from '@expo/vector-icons';

import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { Row } from "native-base";
import { ipcim } from "./IPcim";
const IP = require('./IPcim')


export default class Listaad extends Component {
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

      alertMutatasa: false,
      data: [],
      segeddata: [],
      listanev: "",
      termekektomb: [
        { id: 0, megnevezes: "Cukor", isChecked: false },
        { id: 1, megnevezes: "Liszt", isChecked: false },
        { id: 2, megnevezes: "Alföldi Kenyér", isChecked: false },
        { id: 3, megnevezes: "Kávé", isChecked: false },
        { id: 4, megnevezes: "Cola", isChecked: false },
        { id: 5, megnevezes: "Wc-papír", isChecked: false },
        { id: 6, megnevezes: "Túró", isChecked: false },
        
      ],
      visible: false,
      setVisible: false,
      bevittadat: "",
      felhasznalonev: "",
      modal: false

    };
  }
  adatatad = () => {

    if (this.state.data?.length == 0 && this.state.segeddata?.length == 0) {
      this.setState({ alertMutatasa: true })
    } else {
      this.setState({ visible: true });
    }
  };
  getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    return year + "-" + month + "-" + date + ". napi lista";
  };

  listaNevEllenorzes(nev) {

    if (!nev) {

      this.state.listanev = this.getCurrentDate();
      //console.log("a")
    }
    else {
      this.state.listanev = nev
    }
  }

  submit_atad(input) {
    this.listaNevEllenorzes(input)

    var tartalom = [];
    this.state.data?.map((item) => tartalom.push(item.megnevezes));
    this.state.segeddata?.map((item) => tartalom.push(item.megnevezes));

    var adatok = {
      bevitel1: this.state.listanev,
      bevitel2: tartalom,
      bevitel3: this.state.id
    };
    try {
      const response = fetch(IP.ipcim + 'tartalomfel', {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
    } catch (err) {
      alert("Sikertelen feltöltés");
    } finally {
      this.modalMutat()
    }
    this.setState({ visible: false });
    this.state.termekektomb.map((item) => {
      item.isChecked = false
    })
    this.setState({ data: [] })
    this.setState({ segeddata: [] })
    this.storeData([])
    this.storeData2([])

  };


  getLocaladatok = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@localadatok')
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
  storeData2 = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@localadatok', jsonValue)
    } catch (e) {
      // saving error
    }
  }
  getListainputsr = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@listaelemek')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  }
  getID = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@ID')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  }


  componentDidMount() {
    this.getID().then((vissza_adatok2) => {
      this.setState({ id: vissza_adatok2 })
    });
    this.getListainputsr().then((vissza_adatok2) => {
      this.setState({ segeddata: vissza_adatok2 })
    });

    this.navFocusListener = this.props.navigation.addListener('focus', () => {
      this.getLocaladatok().then((vissza_adatok2) => {
        this.setState({ data: vissza_adatok2 })
      });
      this.getID().then((vissza_adatok2) => {
        this.setState({ id: vissza_adatok2 })
      });

      this.getListainputsr().then((vissza_adatok2) => {
        this.setState({ segeddata: vissza_adatok2 })
      });

    });

  }
  componentWillUnmount() {
    this.navFocusListener();
    this.storeData(this.state.data)

  }

  handleChange = (id, nev) => {
    var tomb = this.state.data;
    let temp = this.state.termekektomb.map((product) => {
      if (id === product.id) {
        return { ...product, isChecked: !product.isChecked };
      }

      return product;
    });
    let x = this.state.data?.length;
    this.setState({ termekektomb: temp });

    x = this.state.data?.length
    this.state.termekektomb.map((termek) => {
      if (id === termek.id && termek.isChecked == false) {
        this.state.data?.push({
          id: x,
          megnevezes: termek.megnevezes,
          isChecked: false,
        });
      }

    });
   // console.log(this.state.data)
    this.state.termekektomb.map((termek) => {
      if (nev == termek.megnevezes && termek.isChecked == true) {
        let index = this.state.data?.findIndex((item) => item.megnevezes == nev)
        if (index !== -1) {
          tomb?.splice(index, 1);
          this.setState({ data: tomb });
          //console.log(this.state.data)
        }
      }
    })


  };
  ListaelemTorles = (termeknev) => {
   // console.log(this.state.data)
    let tomb = this.state.data
    let tomb1 = this.state.termekektomb
    let tomb2 = this.state.segeddata
    //fenti checklist elemeinek vissza állítása------------
    this.state.termekektomb.map((termekvissza) => {
      if (termeknev == termekvissza.megnevezes) {
        termekvissza.isChecked = false
        this.setState({ termekektomb: tomb1 })
        //this.setState({ data: tomb1 });
      }
    })
    //

    this.state.termekektomb.map((termek) => {
      if (termeknev == termek.megnevezes) {
        let index = this.state.data?.findIndex((item) => item.megnevezes == termeknev)
        if (index !== -1) {
          tomb?.splice(index, 1);
          this.setState({ data: tomb });
        }
      }
    })
    this.state.data?.map((termek) => {
      if (termeknev == termek.megnevezes) {
        let index = this.state.data?.findIndex((item) => item.megnevezes == termeknev)
        if (index !== -1) {
          tomb?.splice(index, 1);
          this.setState({ data: tomb });
        }
      }
    })

    this.state.segeddata?.map((termek) => {
      if (termeknev == termek.megnevezes) {
        let index = this.state.segeddata?.findIndex((item) => item.megnevezes == termeknev)
        if (index !== -1) {
          tomb2.splice(index, 1);
          this.setState({ segeddata: tomb2 });
        }
      }
    })
    this.storeData([])
    this.storeData(this.state.data)

  }
  Ugras = () => {
    this.storeData2(this.state.data).then(this.props.navigation.navigate('Listalétrehozása'))
  }
  modalMutat = () => {
    this.setState({ modal: true })
    setTimeout(() => {
      this.setState({
        modal: false
      });
    }, 2000);

  }
  render() {
    return (

      <View style={styles.container}>
        <ScrollView style={{ flexDirection: "column", backgroundColor: "rgb(50,50,50)" }}>
          <View style={[styles.keresesdiv, { flex: 1, flexDirection: "row", backgroundColor: "rgb(18,18,18)" }]}>
            <Feather style={{ paddingTop: 5, }} name="search" size={28} color="white" />
            <TouchableOpacity
              onPress={this.Ugras}
              style={styles.textInputStyle} >
              <Text style={{ fontStyle: "italic", color: "white" }}>Termék keresése..</Text>
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: "brown" }}>
            <DialogInput
              title={"Nevezed el a listádat!"}
              textInputProps={{ maxLength: 12,autoCapitalize:true }}
              isDialogVisible={this.state.visible}
              submitInput={(text) => {
                this.submit_atad(text);
              }}

              closeDialog={() => this.setState({ visible: false })}
            ></DialogInput>
          </View>
          {/*----FELSŐ CHECKBOX ELEMEI----*/}
          <View style={{ flex: 11, backgroundColor: "rgb(50,50,50)", marginTop: 20 }}>

          {this.state.termekektomb.map((item, key) =>
              <View key={key} style={{ flexDirection: "row", flex: 1 }}>
                {item.id%2==0?
                <View style={{width:"50%",right:0,position:"absolute"}}>
                    <Pressable onPress={() => this.handleChange(item.id, item.megnevezes)}>
                <View
                    style={styles.felsocheck}
                  >
                    <View style={styles.icon}>
                    
                        <MaterialCommunityIcons
                          name={
                            item.isChecked
                              ? "check"
                              : "plus"
                          }
                          size={24}
                          color="rgb(1,194,154)"
                        />
                   
                    </View>
                    <Text style={{ color: "white", fontSize: 15 }}>{item.megnevezes}</Text>
                  </View>
                  </Pressable>
                </View>
              : <View style={{width:"50%"}}>
                  <Pressable onPress={() => this.handleChange(item.id, item.megnevezes)}>
                <View
                    style={styles.felsocheck}
                  >
                    <View style={styles.icon}>
                    
                        <MaterialCommunityIcons
                          name={
                            item.isChecked
                              ? "check"
                              : "plus"
                          }
                          size={24}
                          color="rgb(1,194,154)"
                        />
                     
                    </View>
                    <Text style={{ color: "white", fontSize: 15 }}>{item.megnevezes}</Text>
                  </View>
                
                  </Pressable>
                </View>}
               

              </View>

            )}
           </View>

          {/*----lISTA ELEMEINEK MUTATÁSA----*/}
          <View style={{ flex: 1, backgroundColor: "rgb(50,50,50)", paddingTop: 50 }}>


            {this.state.data?.map((item, key) => <View key={key} style={styles.listatartalom}>

              <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Entypo style={{ marginLeft: 10 }} name="shop" size={25} color="white" />
                </View>
                <View style={{ flex: 13, justifyContent: "center" }}>
                  <Text style={{ color: "white", marginLeft: 10 }}>{item.megnevezes}</Text>
                </View>
                <View style={styles.torlesgomb}>
                  <TouchableOpacity onPress={() => this.ListaelemTorles(item.megnevezes)}>
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>)}
            {this.state.segeddata?.length > 0 ?
              this.state.segeddata?.map((item, key) =>
                <View key={key} style={styles.listatartalom}>
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <Entypo style={{ marginLeft: 10 }} name="shop" size={25} color="white" />
                    </View>
                    <View style={{ flex: 13, justifyContent: "center" }}>
                      <Text style={{ color: "white", marginLeft: 10 }}>{item.megnevezes}</Text>
                    </View>
                    <View style={styles.torlesgomb}>
                      <TouchableOpacity onPress={() => this.ListaelemTorles(item.megnevezes)}>
                        <Ionicons
                          name="trash-outline"
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>) :
              <Text></Text>}


          </View>

          <Modal
            style={{ backgroundColor: "red" }}
            animationType="fade"
            transparent={true}
            visible={this.state.modal}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              this.setState({ modalVisible: !modalVisible });
            }}>
            <View style={styles.modalView}>
              <View style={{ flex: 4.5 }}><Text style={{ color: "white", marginLeft: 10 }}>A listád mentésre került!</Text>
              </View>
              <View style={{ flex: 0.5, alignItems: "flex-end", }}>
                <Pressable onPress={() => this.props.navigation.navigate('Listák')}><Feather name="arrow-right" size={24} color="rgb(1,194,154)" /></Pressable>
              </View>
              <View style={{ flex: 0.5 }}>
                <Pressable style={{ alignSelf: "flex-end" }} onPress={() => this.setState({ modal: false })}><MaterialIcons name="close" size={24} color="white" />
                </Pressable></View>

            </View>
          </Modal>

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
          <View style={{ flex: 1, backgroundColor: "696969" }}>
            {this.state.data?.length > 0 || this.state.segeddata?.length > 0 ?
              <TouchableOpacity
                onPress={(this.adatatad)}
                style={{ backgroundColor: "rgb(1,194,154)", width: 65, alignSelf: "flex-end", alignItems: "center", borderRadius: 150 / 2, height: 65, justifyContent: "center", zIndex: 1, }}>
                <Feather name="check" size={50} color="black" />
              </TouchableOpacity> : <Text></Text>}

          </View>
        </Animated.View>
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
  listatartalom: {
    backgroundColor: "rgb(18,18,18)",
    height: height * 0.06,
    width: width * 1,
    alignSelf: "center",
    borderRadius: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: "rgb(120, 130, 130)"

  },
  text: { textAlign: "center", fontSize: 18 },
  listaneve: {
    height: 40,
    alignSelf: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    width: width * 0.8,
  },
  mentes: {
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    // width: width * 0.2,
    textAlignVertical: "center",
  },
  felsocheck: {
    flexDirection: "row",
    margin: 5,
    backgroundColor: "#505050",
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6C8389"
  },
  icon: {
    backgroundColor: "rgb(50,50,50)",
    borderRadius: 50,
    margin: 5,
    width: '13%',

  },
  torlesgomb:
  {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: 30,
    height: 30,
    marginRight: 5,
    borderRadius: 5
  },
  keresesdiv: {
    marginTop: 10,
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 1,
    paddingBottom: 10,
    borderColor: "rgb(120, 130, 130)",
    borderWidth: 2
  },
  textInputStyle: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  modalView: {
    flexDirection: "row",
    alignContent: "space-between",
    bottom: 50,
    position: "absolute",
    backgroundColor: '#181818',
    alignItems: 'center',
    width: "100%",
    height: "5%"
  }
});
