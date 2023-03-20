import React, { useState } from 'react';
import { Button, View, Text, TextInput, Alert, NativeEventEmitter, } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


import Baratok from './Baratok';
import BaratokKeres from './Baratkeres.js';
import CustomDrawer from './CustomDrawer';
import ProfilEdit from './Profszerkesztes';
import Kiir from './Elso'
import Listaad from './Lista_input';
import Listainputsr from './Listainputsr';
import Login from './Login'
import Regisztracio from './Regisztracio';
import Profil from './Profilom';
import Toltokep from './Tolto'
import Fooldal from './Home';
import Seged from './Seged';
import Felvitel from './felvitel';
import Szerkeszt from './Szerkeszt';

function HomeScreen({ navigation }) {

  return (
    <Fooldal navigation={navigation}></Fooldal>
  );
}

function SzerkesztScreen({ navigation }) {

  return (
    <Szerkeszt navigation={navigation}></Szerkeszt>
  );
}


function Listafel({ navigation }) {
  return (
    <Felvitel navigation={navigation}></Felvitel>
  );
}

function Segedkep({ navigation }) {
  return (
    <Seged navigation={navigation}></Seged>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "rgb(50,50,50)" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

function Elso_lap({ navigation }) {
  return (
    <Listaad navigation={navigation}></Listaad>
  );
}
//Szia
function Toltes({ navigation }) {
  return (
    <Toltokep navigation={navigation}></Toltokep>
  );
}

function Masodik_lap({ navigation }) {
  return (
    <Kiir navigation={navigation}></Kiir>
  );
}
function Bejelentkezes({ navigation }) {
  return (
    <Login navigation={navigation}></Login>);
}

function Regisztr({ navigation }) {
  return (
    <Regisztracio navigation={navigation}></Regisztracio>);
}
function Prof({ navigation }) {
  return (
    <Profil navigation={navigation}></Profil>);
}

function ProfSzerkesztes({ navigation }) {
  return (
    <Profil navigation={navigation}></Profil>);
}

function BaratokLap({ navigation }) {
  return (
    <Baratok navigation={navigation}></Baratok>);
}

function Root({ navigation }) {

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      initialRouteName="Toltokep"
      screenOptions=
      {{ lazy: true, headerStyle: { backgroundColor: 'rgb(18,18,18)' }, headerTintColor: 'white', drawerStyle: { backgroundColor: 'rgb(32,32,32)' }, drawerActiveBackgroundColor: "rgb(18,18,18)", drawerActiveTintColor: "white", drawerInactiveTintColor: "white", headerTitleAlign: "center" }} >


      <Drawer.Screen name="Home" component={HomeScreen} options={{
        title: "Bevásárlólistám",
        headerTintColor: "white",
        drawerIcon: ({ color }) => (<Ionicons name="home-outline" size={22} color={color} />)


      }} />

      <Drawer.Screen name="Toltokep" component={Toltes} options={{
        drawerItemStyle: { height: 0 }, headerShown: false,
      }} />

      <Drawer.Screen name="Meglévő listák" component={Listafel}
        options={{ drawerIcon: ({ color }) => (<Ionicons name="file-tray-stacked-outline" size={22} color={color} />) }}
      />

      <Drawer.Screen name="Listalétrehozás" component={Elso_lap} options={{
        title: 'Listalétrehozása',
        drawerIcon: ({ color }) => (<Ionicons name="create-outline" size={22} color={color} />)
      }} />
      <Drawer.Screen name="Listák" component={Masodik_lap} options={{
        title: 'Listák',
        drawerIcon: ({ color }) => (<Ionicons name="ios-clipboard-outline" size={22} color={color} />)
      }} />
      <Drawer.Screen name="Profilom" component={Prof} options={{
        title: 'Profilom',
        drawerIcon: ({ }) => (
          <AntDesign name="user" size={24} color="white" />
        ),
        headerRightContainerStyle: { marginRight: 10 },

      }} />
        <Drawer.Screen name="Barátaim" component={BaratokLap} options={{
        title: 'Barátaim',
        drawerIcon: ({ }) => (
          <AntDesign name="user" size={24} color="white" />
        ),
        headerRightContainerStyle: { marginRight: 10 },

      }} />


    </Drawer.Navigator>
  )


}

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator()

const menu = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator  >
        <Stack.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Bejelentkezes" options={{
          headerShown: false, swipeEnabled: false,
          drawerItemStyle: { height: 0 }, headerShown: false, swipeEdgeWidth: 0
        }} component={Bejelentkezes} />
        <Stack.Screen name="Listalétrehozása" component={Listainputsr} options={{ headerStyle: { backgroundColor: 'rgb(18,18,18)' }, headerTitleAlign: "center", headerTintColor: "white", headerTitle: "Keresés" }} />
        <Stack.Screen name="Regisztráció" options={{ headerStyle: { headerTintColor: "black" } }} component={Regisztracio} />
        <Stack.Screen name="Seged" component={Seged} options={{ headerStyle: { backgroundColor: 'rgb(18,18,18)' }, headerTintColor: "white", title: "Tartalom", headerTitleAlign: "center" }} />
        <Stack.Screen name="Szerkeszt" component={Szerkeszt} options={{ headerStyle: { backgroundColor: 'rgb(18,18,18)' }, headerTintColor: "white", headerTitle: "Lista módosítása" }} />
        <Stack.Screen name="Profilom szerkesztése" component={ProfilEdit} options={{ headerStyle: { backgroundColor: 'rgb(18,18,18)' }, headerTintColor: "white", headerTitle: "Profilom szerkesztése", headerTitleAlign: "center" }} />
        <Stack.Screen name="Barát keresése" component={BaratokKeres} options={{ headerStyle: { backgroundColor: 'rgb(18,18,18)' }, headerTintColor: "white", headerTitle: "Profilom szerkesztése", headerTitleAlign: "center" }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}


export default menu;