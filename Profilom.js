import React, { Component } from 'react';
import { Text, StyleSheet, View,Dimensions,TouchableOpacity,Modal,Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


import { ScrollView } from 'react-native-gesture-handler';

import { ipcim } from "./IPcim";
const IP = require('./IPcim')

export default class Profil extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id:0,
            maxKiadas:[],
            atlagKiadas:[],
            osszlista: [],
            regisztrdatum:"",
            felhasznalonev: "",
            latszodik: false,
            erkezo: [],
            data:[ {value:50}, {value:80}, {value:90}, {value:70} ],
        };
    }
    getMaxkiadas(){
        var bemenet = {
            bevitel1: this.state.id
        }
        fetch(IP.ipcim + 'maxkoltes', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { 
            "Content-type": "application/json; charset=UTF-8",
        }
        }

        ).then((response) => response.json())
            .then((responseJson) => {
                (
                    
                    this.setState({maxKiadas:responseJson})
                );
            })  
    }
    getAtlagkiadas(){
        var bemenet = {
            bevitel1: this.state.id
        }
        fetch(IP.ipcim + 'atlagkoltes', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { 
            "Content-type": "application/json; charset=UTF-8",
        }
        }

        ).then((response) => response.json())
            .then((responseJson) => {
                (
                    console.log("response22:",responseJson),
                    this.setState({atlagKiadas:responseJson})
                );
            })  
    }

    
    getRegisztracioDatum() {
     
        let ev=""
        let honap=""
        let nap=""
        var bemenet = {
            bevitel1: this.state.id
        }
        fetch(IP.ipcim + 'regisztraciodatum', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }

        ).then((response) => response.json())
            .then((responseJson) => {
                (
                   
                    responseJson.map((item)=>{
                        ev=item.datum
                        if(item.honap<10){
                         honap+="0"+item.honap
                        }
                        if(item.nap<10){
                            nap+="0"+item.nap
                        }
                        else{
                            nap=item.nap
                        }
                        this.setState({regisztrdatum:ev+"-"+honap+"-"+nap})
                       
                    } 
                ))
            })
            //console.log(this.state.regisztrdatum)  
    }
    getID = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@ID')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {

        }
    }

    storeData3 = async (value) => {
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
    Szamolas = () => {
        let seged = this.state.data;
    
        for (let i = 0; i < this.state.data.length; i++) {
          for (let j = 0; j < this.state.erkezo.length; j++) {
            if (this.state.data[i].label == this.state.erkezo[j].honap) {
    
              seged[i].value = this.state.erkezo[j].ar
    
              console.log(JSON.stringify(this.state.data))
              this.setState({ data: seged })
              break
            }
          }
        }
      }
    getListakszama() {
        var bemenet = {
            bevitel1: this.state.id
        }
        fetch(IP.ipcim + 'felhasznaloossz', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { 
            "Content-type": "application/json; charset=UTF-8",
        }
        }

        ).then((response) => response.json())
            .then((responseJson) => {
                (
                    console.log("response:",responseJson),
                    this.setState({osszlista:responseJson})
                );
            })  
    }
    getLista() {
        var bemenet = {
            bevitel1: this.state.felhasznalonev
        }
        fetch(IP.ipcim + 'honapok', {
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { 
            "Content-type": "application/json; charset=UTF-8",
        }
        }

        ).then((response) => response.json())
            .then((responseJson) => {
                (
                    console.log("response1:",responseJson),
                    this.setState({erkezo:responseJson})
                );
            })  
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
        this.getID().then((vissza_adatok2) => {
            this.setState({id:vissza_adatok2})
            this.getListakszama();
            this.getRegisztracioDatum();
            this.getAtlagkiadas();
            this.getMaxkiadas();
        });
        this.getData().then((vissza_adatok2) => {
            this.setState({ felhasznalonev: vissza_adatok2 })
            this.state.felhasznalonev = vissza_adatok2
        });
        this.navFocusListener = this.props.navigation.addListener('focus', () => {
            this.getData().then((vissza_adatok2) => {
                this.setState({ felhasznalonev: vissza_adatok2 }) 
            });
            this.getID().then((vissza_adatok2) => {
                this.setState({id:vissza_adatok2})
                this.getListakszama();
                this.getRegisztracioDatum();
                this.getAtlagkiadas();
                this.getMaxkiadas();
            });
        })

    }
    componentWillUnmount() {
        this.navFocusListener()
    }

    kilepes = () => {
        this.storeData([])
        this.storeData2([])
        this.storeData3([])
        this.props.navigation.navigate('Bejelentkezes');
    }


    render() {

        return (
            <View style={{ flexDirection: 'column', flex: 1,backgroundColor:"rgb(50,50,50)"}}>
                <ScrollView
                 stickyHeaderIndices={[0, 2, 4,6]}
                 showsVerticalScrollIndicator={false}
                >


               
                    <View style={{height:height*0.09,backgroundColor:"rgb(18,18,18)",marginTop:height*0.020,borderTopEndRadius:20,borderTopLeftRadius:20}}>
                    <Text style={{fontSize:20,alignSelf:"center",fontWeight:"bold",color:"white",position:"absolute",bottom:width*0.05}}>Felhasználó adatai</Text>
                        <View style={{marginLeft:5,left:0,backgroundColor:"rgb(1,192,154)",position:"absolute",borderRadius:50,width:width*0.1,alignItems:"center",height:width*0.1,justifyContent:"center"}}><AntDesign name="user" size={25} color="white"/></View>   
                    </View>
                    <View style={{height:height*0.2,justifyContent:"center",flexDirection:"column",backgroundColor:"rgb(32,32,32)",borderBottomLeftRadius:20,borderBottomRightRadius:20,borderBottomWidth:3,borderBottomColor:"rgb(1,194,154)"}}>
                        <View style={{flex:1,flexDirection:"row",backgroundColor:""}}>
                                <View style={{flex:2,justifyContent:"center"}}><Text style={{fontSize:18,margin:10,color:"white"}}>Felhasználónév:</Text></View>
                                <View style={{flex:1,justifyContent:"center"}}><Text style={{fontSize:18,margin:10,color:"white"}}>{this.state.felhasznalonev}</Text>
                                    <View style={{justifyContent:"center",position:"absolute",left:width*0.16}}><TouchableOpacity onPress={()=>this.props.navigation.navigate('Profilom szerkesztése')}><Feather name="edit-2" size={15} color="rgb(1,194,154)" style={{marginBottom:height*0.03}} /></TouchableOpacity></View>
                                </View>  
                        </View>
                        <View style={{flex:1,flexDirection:"row",backgroundColor:""}}>
                                <View style={{flex:2,justifyContent:"center"}}><Text style={{fontSize:18,margin:10,color:"white"}}>Profil azonosítód</Text></View>
                                <View style={{flex:1,justifyContent:"center"}}><Text  style={{fontSize:18,margin:10,color:"white"}}>{this.state.id}</Text></View>
                        </View>
                    </View>


                    <View style={{height:height*0.09,backgroundColor:"rgb(18,18,18)",marginTop:height*0.020,borderTopEndRadius:20,borderTopLeftRadius:20}}>
                    <Text style={{fontSize:20,alignSelf:"center",fontWeight:"bold",color:"white",position:"absolute",bottom:width*0.05}}>Barátok</Text>
                        <View style={{marginLeft:5,left:0,backgroundColor:"rgb(1,192,154)",position:"absolute",borderRadius:50,width:width*0.1,alignItems:"center",height:width*0.1,justifyContent:"center"}}><FontAwesome5 name="user-friends" size={25} color="white" /></View>   
                    </View>
                    <View style={{height:height*0.1,justifyContent:"center",flexDirection:"row",backgroundColor:"rgb(32,32,32)",borderBottomLeftRadius:20,borderBottomRightRadius:20,borderBottomWidth:3,borderBottomColor:"rgb(1,194,154)"}}>
                       <View style={{flex:2,justifyContent:"center"}}><Text style={{fontSize:18,margin:10,color:"white"}}>Összes barátod:</Text></View>
                        <View style={{flex:1,justifyContent:"center"}}><Text style={{fontSize:18,margin:10,color:"white"}}>0</Text>
                        <View style={{justifyContent:"center",position:"absolute",left:width*0.16}}><TouchableOpacity onPress={()=>this.props.navigation.navigate('Barátaim')}><FontAwesome5 name="plus" size={25} color="rgb(1,194,154)"/></TouchableOpacity></View>
                    </View>  
                    </View>

                    <View style={{height:height*0.1,backgroundColor:"rgb(18,18,18)",marginTop:height*0.050,justifyContent:"center",borderTopEndRadius:20,borderTopLeftRadius:20}}>
                        <Text style={{fontSize:20,alignSelf:"center",fontWeight:"bold",color:"white",position:"absolute",bottom:width*0.05}}>Információk</Text>
                        <View style={{marginLeft:5,left:0,backgroundColor:"rgb(1,192,154)",position:"absolute",borderRadius:100,width:width*0.1,alignItems:"center",height:width*0.1,justifyContent:"center"}}><Ionicons name="information" size={25} color="white" /></View>   
                     
                    </View>
                    <View style={{height:height*0.2,justifyContent:"center",flexDirection:"column",backgroundColor:"rgb(32,32,32)",borderBottomLeftRadius:20,borderBottomRightRadius:20,borderBottomWidth:3,borderBottomColor:"rgb(1,194,154)"}}>
                        <View style={{flex:1,flexDirection:"row",backgroundColor:""}}>
                                <View style={{flex:2,justifyContent:"center"}}><Text style={{fontSize:18,margin:10,color:"white"}}>Regisztrációd dátuma:</Text></View>
                                <View style={{flex:1,justifyContent:"center"}}><Text style={{fontSize:18,color:"white"}}>{this.state.regisztrdatum}</Text></View>
                        </View>
                        <View style={{flex:1,flexDirection:"row",backgroundColor:""}}>
                                <View style={{flex:2,justifyContent:"center"}}><Text style={{fontSize:18,margin:10,color:"white"}}>Összes listád:</Text></View>
                                <View style={{flex:1,justifyContent:"center"}}>{this.state.osszlista.map((item,key)=><Text key={key} style={{fontSize:18,color:"white"}}>{item.osszes}</Text>)}</View>
                        </View>
                    </View>



                    
                    <View style={{height:height*0.1,backgroundColor:"rgb(18,18,18)",marginTop:height*0.050,justifyContent:"center",borderTopEndRadius:20,borderTopLeftRadius:20}}>
                        <Text style={{fontSize:20,alignSelf:"center",fontWeight:"bold",color:"white",position:"absolute",bottom:width*0.05}}>Kiadások</Text>
                        <View style={{marginLeft:5,left:0,backgroundColor:"rgb(1,192,154)",position:"absolute",borderRadius:50,width:width*0.1,alignItems:"center",height:width*0.1,justifyContent:"center"}}><FontAwesome5 name="money-bill-alt" size={25} color="white" /></View>   
                     
                    </View>
                    <View style={{height:height*0.2,justifyContent:"center",flexDirection:"column",backgroundColor:"rgb(32,32,32)",borderBottomLeftRadius:20,borderBottomRightRadius:20,borderBottomWidth:3,borderBottomColor:"rgb(1,194,154)"}}>
                        <View style={{flex:1,flexDirection:"row",backgroundColor:""}}>
                                    <View style={{flex:2,justifyContent:"center"}}><Text style={{fontSize:18,margin:10,color:"white"}}>Átlagos havi kiadásod:</Text></View>
                                    <View style={{flex:1,justifyContent:"center"}}>{this.state.atlagKiadas.map((item,key)=><Text key={key} style={{fontSize:18,color:"white"}}>{item.atlag} ft</Text>)}</View>
                        </View>
                        <View style={{flex:1,flexDirection:"row",backgroundColor:""}}>
                                    <View style={{flex:2,justifyContent:"center"}}><Text style={{fontSize:18,margin:10,color:"white"}}>Legdrágább listád:</Text></View>
                                    <View style={{flex:1,justifyContent:"center"}}>{this.state.maxKiadas.map((item,key)=><Text key={key} style={{fontSize:18,color:"white"}}>{item.max} ft</Text>)}</View>
                        </View>
                       
                    </View>


                    <View style={{height:height*0.1,backgroundColor:"rgb(18,18,18)",marginTop:height*0.050,justifyContent:"center",borderTopEndRadius:20,borderTopLeftRadius:20}}>
                        <Text style={{fontSize:20,alignSelf:"center",fontWeight:"bold",color:"white",position:"absolute",bottom:width*0.05}}>Fiók</Text>
                        <View style={{marginLeft:5,left:0,backgroundColor:"rgb(1,192,154)",position:"absolute",borderRadius:50,width:width*0.1,alignItems:"center",height:width*0.1,justifyContent:"center"}}><MaterialCommunityIcons name="account-settings-outline" size={25} color="white" /></View>   
                     
                    </View>
                    <View style={{height:height*0.2,justifyContent:"center",flexDirection:"column",backgroundColor:"rgb(32,32,32)",borderBottomLeftRadius:20,borderBottomRightRadius:20,borderBottomWidth:3,borderBottomColor:"rgb(1,194,154)"}}>
                        <View style={{flex:1,flexDirection:"row",backgroundColor:""}}>
                                    <View style={{flex:2,justifyContent:"center"}}>
                                        <TouchableOpacity style={{backgroundColor:"red",width:"40%",borderRadius:15}} onPress={()=>this.kilepes()}>
                                        <Text style={{fontSize:18,margin:10,color:"white"}}>
                                        <Text><Feather name="log-out" size={24} color="white" /></Text>
                                        Kijelentkezés
                                        </Text>
                                        </TouchableOpacity>
                                        
                                    </View>
                        </View>
                       
                       
                    </View>
                  

                    


                    
                    


                  
                </ScrollView>
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
    countContainer: {
        alignItems: "center",
        padding: 10
    },
});
