import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions, ActivityIndicator, Pressable} from 'react-native';
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
import { useRoute } from "@react-navigation/native"
const ListaEdit = ({navigation}) => {
    const route = useRoute()

    const id = route.params?.aktid;
    const tartalom = route.params?.akttart;

       
    let tomb1 = []
       tomb1 = tartalom.split(',')
    console.log(tomb1)
    
    return(
        <FlatList
          data={tomb1}
          renderItem={({item}) => 
            <View>
                <Text>{item}</Text>
            </View>
        }/>
    );
};


export default ListaEdit;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  
});
