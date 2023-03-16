import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions, ActivityIndicator} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ipcim } from "./IPcim";
const IP = require('./IPcim')
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons'; 
const App = () => {
  const [listData, setListData] = useState(data);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(true);
  const [forgat,setForgat]=useState();
  const getID = async () => {
    let x = 0
    try {
      const jsonValue = await AsyncStorage.getItem('@ID')
      await jsonValue != null ? JSON.parse(jsonValue) : null;
      x = jsonValue


    } catch (e) {

    }
    finally {

      adatLekeres(x)

    }
  }

  const adatLekeres = (y) => {
    
    try {
      var bemenet = {
        bevitel1: y
      }
      //szűrt adatok lefetchelése backendről
      fetch(IP.ipcim + 'felhasznalolistainincskesz', {
        method: "POST",
        body: JSON.stringify(bemenet),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      }
      ).then((response) => response.json())
        .then((responseJson) => {
          responseJson.reverse()
          setData(responseJson)
          //console.log(responseJson)
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) { console.log(e) }
    finally {
      setisLoading(false)
    }

  }
  useFocusEffect(
    React.useCallback(() => {
      getID()
     

    }, [])
  );
  


  useEffect(() => {
    getID();

  }, []);

  let x=[];
  let row = [];
  let prevOpenedRow;
  let opened;
  const getParsedDate = (strDate) => {
    var strSplitDate = String(strDate).split(' ');
    var date = new Date(strSplitDate[0]);
    var dd = date.getDate();
    var mm = date.getMonth() + 1;

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



  const renderItem = ({ item, index }, onClick) => {
    
   
    const forgatas=(index)=>{
      closeRow(index)
      setForgat(index)
    }
    const closeRow = (index) => {
  
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
            marginTop: 15,
            height: width * 0.18,
            width: width * 0.18,
          }}>
          <TouchableOpacity onPress={onClick} >
            <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>
              <Ionicons name="trash-outline" size={22} color="white" /></Text>

          </TouchableOpacity>
        </View>
      );
    };

    return (

      <TouchableOpacity onPress={() => navigation.navigate('Seged', { aktid: item.listak_id, akttart: item.listak_tartalom })}>
        <Swipeable
          onSwipeableWillOpen={()=>forgatas(index)}
          onSwipeableWillClose={()=>setForgat()}
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, onClick)
          }
         
          onSwipeableOpen={() => closeRow(index)}
          ref={(ref) => (row[index] = ref)}
          rightOpenValue={-100}>
          <LinearGradient
            start={{ x: 0.3, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            colors={forgat==index?["white","red",'transparent']:["rgb(18,18,18)","white", "rgb(1,194,154)",'transparent']}
            style={{
              padding: 1,
              marginTop: 15,
              height: height * 0.135,
              justifyContent: "center",
              borderRadius: 15,
            }} >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                margin: 1,
                backgroundColor: "rgb(32,32,32)",
                padding: 10,
                height: height * 0.13,
                borderRadius: 15
              }}>
              
              <View style={{ flex: 8 }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{item.listak_nev}</Text>
                <Text style={{ marginTop: 10, fontSize: 15, color: "rgb(1,194,154)" }}>{getParsedDate(item.listak_datum)}</Text>
              </View>
             
              <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
             
              {forgat==index? <TouchableOpacity onPress={()=>row[index].close()}><AntDesign name="caretright" size={26} color="white" /></TouchableOpacity>: <TouchableOpacity onPress={()=>row[index].openRight()}><AntDesign name="caretleft" size={26} color="white" /></TouchableOpacity>}
              </View>
              
             
            </View>
          </LinearGradient>
          
        </Swipeable>
      </TouchableOpacity >



    );
  };

  const removeItem = (id) => {
    setData((current) =>
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
      //console.log(e)
    }
    finally {
      removeItem(id)

    }
  };

  return (
    <View style={styles.container}>
      {isLoading == true ? <ActivityIndicator size="large" color="rgb(1,194,154)" /> : data.length > 0 ?
        <FlatList
          data={data}
          renderItem={(v) =>
            renderItem(v, () => {
              deleteItem(v.item.listak_id);
            })
          }
          keyExtractor={(item) => item.listak_id}></FlatList>
        : <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "white", fontSize: 15, margin: 10 }}>Úgy tűnik jelenleg nem hoztál létre egy listát sem.</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Listalétrehozás')}>
            <Text style={{ alignSelf: "center", color: "rgb(1,194,154)", fontSize: 20 }}>Listalétrehozása!</Text>
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
    justifyContent: 'center',
    backgroundColor: 'rgb(50,50,50)',


  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});