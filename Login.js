import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, Modal, Dimensions, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { ipcim } from "./IPcim";
const IP = require('./IPcim')

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toltes: false,
      data: false,
      felhasznalonev: "",
      jelszo: "",
      felhasznalonevtovabb: "",
      fokusz: false,
      fokusz1: false,
      rosszjelszo: false,
      rosszfelhasznalonev: false,
      lathatojelszo: true,
      modal: false,
    };
  }
  idLekeres=()=>{
    let id=0;
    var bemenet={
        bevitel1:this.state.felhasznalonev
      }
    fetch(IP.ipcim + 'idlekeres', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }
        )
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson)
              responseJson.map((item)=>id=item.felhasznalo_id)
              this.storeID(id)
             
            }).then((this.storeID(id)))
            .catch((error) =>{
            console.error(error);
            });
           

}
storeID = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@ID', jsonValue)
  } catch (e) {
    // saving error
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
    
    this.navFocusListener = this.props.navigation.addListener('focus', () => {
    })
  }
  fiokteszt = () => {
    if (this.state.data == true) {
      this.idLekeres();
      this.storeData(this.state.felhasznalonev)
      this.props.navigation.navigate('Home');
      this.setState({ felhasznalonev: "" })
      this.setState({ jelszo: "" })
    }
    else {
      this.modalMutat()
      this.setState({ rosszjelszo: true })
      this.setState({ rosszfelhasznalonev: true })
    }
    this.setState({ toltes: false })
  }

  bejelentkezes = () => {
    var bemenet = {
      bevitel1: this.state.felhasznalonev,
      bevitel2: this.state.jelszo

    }
    fetch(ipcim + 'login', {
      method: "POST",
      body: JSON.stringify(bemenet),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ data: responseJson })
      }).then(this.setState({ toltes: true })).then(this.fiokteszt)

  }
  JelszoLathato = () => {
    if (this.state.lathatojelszo == true) {
      this.setState({ lathatojelszo: false })
    }
    else if (this.state.lathatojelszo == false) {
      this.setState({ lathatojelszo: true })
    }
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
      <View style={{ flexDirection: 'column', flex: 1, }}>


        <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <View style={styles.divek}>
            <Text style={styles.szoveg}>Felhasználónév:</Text>
            <View style={[this.state.fokusz1 ? styles.felhaszmalodivfocus : styles.felhasznaloodiv, { backgroundColor: this.state.rosszfelhasznalonev ? "red" : "white" }]}>
              <FontAwesome style={{ marginLeft: 5 }} name="user" size={28} color="black" />
              <TextInput
                cursorColor={"rgb(50,50,50)"}
                onFocus={() => this.setState({ fokusz1: true })}
                onBlur={() => this.setState({ fokusz1: false })}
                style={styles.textinputfelh}
                placeholder="Felhasználónév"
                onChangeText={(felhasznalonev_szoveg) => this.setState({ felhasznalonev: felhasznalonev_szoveg })}
                onChange={() => this.setState({ rosszfelhasznalonev: false })}
                value={this.state.felhasznalonev}>
              </TextInput>

            </View>
          </View>
          <View style={styles.divek}>
            <Text style={styles.szoveg}>Jelszó:</Text>

            <View style={[this.state.fokusz ? styles.jelszodivfocus : styles.jelszodiv, { backgroundColor: this.state.rosszjelszo ? "red" : "white" }]}>
              <MaterialCommunityIcons name="lock" size={28} color="black" />
              <TextInput
                cursorColor={"rgb(50,50,50)"}
                onFocus={() => this.setState({ fokusz: true })}
                onBlur={() => this.setState({ fokusz: false })}
                style={styles.textinputjelsz}
                placeholder="Jelszó"
                secureTextEntry={this.state.lathatojelszo}
                onChangeText={(jelszoszoveg) => this.setState({ jelszo: jelszoszoveg })}
                onChange={() => this.setState({ rosszjelszo: false })}
                value={this.state.jelszo}>
              </TextInput>
              <TouchableOpacity onPress={this.JelszoLathato}><Ionicons style={{ justifyContent: "center", paddingRight: 10, alignItems: "center", paddingTop: 6 }} name={this.state.lathatojelszo ? "eye-outline" : "eye-off-outline"} size={24} color="black" /></TouchableOpacity>

            </View>
          </View>
          {this.state.toltes ?
            <View><ActivityIndicator size="large" color="#00ff00" /></View> : <Text></Text>}
        </View>
        <View style={{ flex: 2 }}>
          <View style={styles.buttondiv}>
            <Text style={{ alignSelf: "center", marginBottom: height * 0.01 }}>Még nincs fiókod?</Text>
            <Pressable onPress={() => this.props.navigation.navigate('Regisztráció')}
              style={{ alignSelf: "center", marginBottom: height * 0.03 }}>
              <Text style={{ fontSize: 18, color: '#01c29a' }}>Regisztrálok!</Text></Pressable>


            <TouchableOpacity
              onPress={this.bejelentkezes}
              style={styles.regisztracio}
            >
              <Text style={{ color: "white", fontSize: 20 }}>Bejelentkezés</Text>
            </TouchableOpacity>
          </View>

        </View>
        <Modal
          style={{ backgroundColor: "red" }}
          animationType="fade"
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({ modalVisible: !modalVisible });
          }}>
          <View style={styles.modalView}>
            <View style={{ flex: 6 }}><Text style={{ color: "white", alignSelf: "flex-start" }}>Helytelen jelszó vagy Felhasználónév</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Pressable style={{ alignSelf: "flex-end" }} onPress={() => this.setState({ modal: false })}><MaterialIcons name="close" size={24} color="white" />
              </Pressable></View>

          </View>
        </Modal>
      </View>
    );
  }
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  buttondiv: {
    width: width * 0.9,
    alignSelf: "center",
    marginTop: height * 0.4,

  },
  divek: {
    width: width * 0.9,
    alignSelf: "center",
    marginTop: height * 0.04,

  },
  szoveg: {
    marginBottom: 10,
    alignSelf: "flex-start",
    fontSize: 20
  },
  textinputjelsz: {
    flex: 1,
    padding: 10,
    justifyContent: "center"
  },
  textinputfelh: {
    flex: 1,
    padding: 10,
    justifyContent: "center"
  },
  jelszodiv: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: '#000',
    paddingBottom: 10,
  },
  jelszodivfocus: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 3,
    borderColor: '#01c29a',
    paddingBottom: 10,
  },
  felhasznaloodiv: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: '#000',
    paddingBottom: 10,
  },
  felhaszmalodivfocus:
  {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 3,
    borderColor: '#01c29a',
    paddingBottom: 10,
  },
  regisztracio: {
    backgroundColor: '#202020',
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9,
    height: height * 0.05,
    borderRadius: 10
  },
  modalView: {
    flexDirection: "row",
    bottom: 50,
    position: "absolute",
    backgroundColor: '#181818',
    alignItems: 'center',
    width: "100%",
    height: "5%"
  }
});