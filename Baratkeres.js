import React, { Component } from "react";
import { StyleSheet, View,Dimensions,Image,TextInput,Text,Modal,Pressable,FlatList} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { ipcim } from "./IPcim";

const IP = require('./IPcim')
export default class BaratokKeres extends Component {

    constructor(props) {
        super(props);
        this.state = {
            felhasznalonev:"",
            timePassed:false,
            baratKeresesModal:false,
            txtinput:false,
            baratadatok:[],
            beirt:false,
            baratok: [],
            jelolesek:[],
            felhasznaloid:0,
            keresettid:""
        }
    }
   /*
   <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.baratKeresesModal}>
            <View style={styles.modalView}>
              <View style={{flex:1,flexDirection:"row",backgroundColor:"red",padding:10}}>
                    <View style={{flex:10}}><Text style={{width:"100%",textAlign:"center",color:"white",fontWeight:"bold",fontSize:19}}>Barát keresése</Text></View>
                    <View style={{flex:1,position:"absolute",right:0,padding:10}}>
                    <Pressable  onPress={() => this.setState({baratKeresesModal:false})}><MaterialIcons  style={{fontWeight:"bold"}} name="close" size={25} color="white" />
                    </Pressable>
                    </View>

              </View>
              <View style={{flex:12,flexDirection:"column"}}>
                <View style={{flex:1,backgroundColor:"green"}}>
                   <View style={{flex:1,borderWidth:2,borderRadius:5,borderColor:"black"}}>
                        <TextInput
                        onFocus={()=>this.setState({txtinput:true})}
                        onBlur={()=>this.setState({txtinput:false})}
                        placeholder="Barát azonsítója"
                        style={{width:"100%",height:"100%"}}
                        >
                
                        </TextInput>
                   </View>
                 
                </View>

                <View style={{flex:9}}></View>
              </View>
              
            </View>
        
        </Modal>
   */
      
  getID = async () => {
          try {
              const jsonValue = await AsyncStorage.getItem('@ID')
              return jsonValue != null ? JSON.parse(jsonValue) : null;
             
          } catch (e) {
  
          }
      }
  componentDidMount() {
        this.getID().then((x)=>{
          this.setState({felhasznaloid:x})
        }).then(
          this.baratlekeres
        )
      
       

    }
  componentWillUnmount(){
       
       

   }
   baratlekeres=()=>{
    let baratokTomb=[]
    let baratjelolesekTomb=[]
    var bemenet = {
      bevitel1: this.state.felhasznaloid
  }
  fetch(IP.ipcim + 'baratokinfo', {
      method: "POST",
      body: JSON.stringify(bemenet),
      headers: { 
      "Content-type": "application/json; charset=UTF-8",
  }
  }
  ).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        responseJson.map((item)=>{
          if(item.fhb_baratok_id!=0)
          {
            baratokTomb.push(item.fhb_baratok_id)
          }
          console.log("bar",baratokTomb)
          if(item.fhb_baratjelolesek_id!=0)
          {
            baratjelolesekTomb.push(item.fhb_baratjelolesek_id)
          }
        
        })
      }).then(this.setState({baratok:baratokTomb}),
      this.setState({jelolesek:baratjelolesekTomb}),
    )
      
      
  
  
  }


  baratkereses=(id)=>{
    if(id.length>0){
      this.setState({beirt:true})
    }
    else{
      this.setState({beirt:false})
    }
   
    var bemenet = {
      bevitel1: id
  }
  fetch(IP.ipcim + 'baratkereses', {
      method: "POST",
      body: JSON.stringify(bemenet),
      headers: { 
      "Content-type": "application/json; charset=UTF-8",
  }
  }
  ).then((response) => response.json())
      .then((responseJson) => {
        this.setState({baratadatok:responseJson})
      })  
   }
  barathozzaad=(id)=>{
    var bemenet = {
      bevitel1: this.state.felhasznaloid,
      bevitel2:id
  }
  fetch(IP.ipcim + 'baratjeloles', {
      method: "POST",
      body: JSON.stringify(bemenet),
      headers: { 
      "Content-type": "application/json; charset=UTF-8",
  }
  }).then(this.baratlekeres)
  
  }
   


    render() {
        return (
        <View style={styles.container}>
            <View style={{flex:1,flexDirection:"row"}}>
        
                  <View style={{flex:10}}>
                    <View style={this.state.txtinput?styles.txtinputfocus:styles.txtinputnemfocus}>
                          <TextInput
                          onFocus={()=>this.setState({txtinput:true})}
                          onBlur={()=>this.setState({txtinput:false})}
                          placeholder="Barát azonsítója"
                          placeholderTextColor={"white"}
                          onChangeText={(id)=>this.baratkereses(id)}
                          style={{width:"100%",height:"100%",color:"white"}}
                          >
                  
                          </TextInput>
                    </View>
                  </View>
            </View>  
          <View style={{flex:10}}>
            {this.state.beirt?
            this.state.baratadatok.length<1?
              <Text style={{color:"white",justifyContent:"center",width:"100%",height:"100%",textAlign:"center",textAlignVertical:"center"}}>Nincs ilyen azonosítójú Felhasználó</Text>:
              <FlatList
              style={{marginTop:20}}
              data={this.state.baratadatok}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, key }) => (
               
                  <View style={styles.fhview} key={key}>
                    
                    <View style={{flex:2,justifyContent:"center",flexDirection:"row",justifyContent:"center"}}>
                      <View style={{flex:1,justifyContent:"center"}}>
                        <Image
                          source={{uri: IP.ipcim + item.felhasznalo_kep_id+".png"}}
                          style={{width:80,height:80,borderRadius:width*0.8/2,backgroundColor:"rgb(50,50,50)",position:"absolute",left:0}}
                      />
                      </View>
                      <View style={{flex:2}}>
                      <Text style={{color:"white",textAlign:"left",fontSize:20,marginLeft:"5%",fontWeight:"500"}}>{item.felhasznalo_nev}</Text>
                      </View>
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                      <Pressable
                      onPress={()=>this.barathozzaad(item.felhasznalo_id)}
                      style={{padding:5}}>
                         {this.state.baratok.includes(item.felhasznalo_id)? 
                         <Text style={{color:"white",fontSize:16,fontWeight:"bold"}}><Feather name="user-check" size={20} color="rgb(1,194,154)" />Barát</Text>
                         :this.state.jelolesek.includes(item.felhasznalo_id)?
                         <Text style={{color:"white",fontSize:16,fontWeight:"bold"}}><MaterialIcons name="pending" size={20} color="rgb(1,194,154)" />Jelölve</Text>
                        : <Text style={{color:"white",fontSize:16,fontWeight:"bold"}}><Feather name="user-plus" size={20} color="rgb(1,194,154)" />Jelölés</Text>
                        }
                       
                    </Pressable>
                    </View>
                 
                 
                  </View>
                 
    
              )}
          />:<Text></Text>}
          

          </View>
        


            

          
        </View>
        );
    }
}
const { width,height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flexDirection:"column",
        flex: 1,
        justifyContent: "center",
        backgroundColor:"rgb(50,50,50)"

    },
      modalView: {
        flexDirection:"column",
        flex:1,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 1,
        position:"absolute",
        bottom:0,
        width:"100%",
        height:"70%"
      },
      txtinputnemfocus:{
        flex:1,
        borderWidth:2,
        borderRadius:5,
        borderColor: "rgb(120, 130, 130)",
        backgroundColor:"black",
        color:"white"
      },
      txtinputfocus:{
        flex:1,
        borderWidth:2,
        borderRadius:5,
        borderColor:"rgb(1,194,154)",
        borderWidth:3,
        backgroundColor:"black",
        color:"white"
      },
      fhview:{
        flex:1,
        flexDirection:"row",
        height:height*0.15,
        backgroundColor:"black",
        marginTop:10,
        borderWidth:2,
        borderRadius:15,
        borderColor: "rgb(120, 130, 130)",
      }
});
