import React, { Component } from "react";
import { StyleSheet, View,Dimensions,Image} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ImagesAssets } from "./Kepek/kepek";

export default class Toltokep extends Component {

    constructor(props) {
        super(props);
        this.state = {
            felhasznalonev:"",
            timePassed:false
        }
    }
    kepernyoDobas()
    {
        this.getData().then((vissza_adatok2) => {
            this.setState({ felhasznalonev: vissza_adatok2 })
            if(this.state.felhasznalonev?.length>0)
            {
                this.props.navigation.navigate('Home')
            }
            else{
                this.props.navigation.navigate('Bejelentkezes')
            }
        });
    }
      
    componentDidMount() {
      this.timeoutHandle = setTimeout(()=>{
              this.kepernyoDobas();  
         }, 1000);
       
    }
    componentWillUnmount(){
        clearTimeout(this.timeoutHandle); 
       
   }

   
   

    getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@felhasznalo')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    }

    render() {
        return (
            <View style={styles.container}>
            
            <Image
                source={ImagesAssets.kep1} 
                style={{alignSelf:"center",width:'80%',height:'50%'}}
            />
            
          </View>
        );
    }
}
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor:"rgb(50,50,50)"

    },
    box: {
        height: 150,
        width: 150,
        backgroundColor: 'blue',
        borderRadius: 5,
      },
});
