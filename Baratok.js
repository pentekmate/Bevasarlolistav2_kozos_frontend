import React, { Component } from "react";
import { StyleSheet, View,Dimensions,Image,TextInput,Text,Modal,Pressable} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from '@expo/vector-icons';

export default class Baratok extends Component {

    constructor(props) {
        super(props);
        this.state = {
            felhasznalonev:"",
            timePassed:false,
            txtinput:false
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
      
    componentDidMount() {
        
    }
    componentWillUnmount(){
       
       
   }


    render() {
        return (
        <View style={styles.container}>
           <View style={{flex:1,flexDirection:"row",marginTop:height*0.01,justifyContent:"center"}}>
                <View style={{borderRadius:5,flex:9,justifyContent:"center"}}>
                <Pressable
                onPress={()=>this.props.navigation.navigate('Barát keresése')}
                style={{height:"100%",widht:"100%",borderWidth:2,borderColor:"black",borderRadius:5}}>
                    <Text style={{height:"100%",widht:"100%",textAlignVertical:"center",marginLeft:10}}>Barát keresése</Text>
                </Pressable>
                </View>
            <View style={{flex:2}}>
                <TouchableOpacity><Text style={{width:"100%",height:"100%",textAlign:"center",textAlignVertical:"center"}}>Keresés</Text></TouchableOpacity>
            </View>
            </View>
            <View style={{flex:10,backgroundColor:"blue"}}>
            
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
});
