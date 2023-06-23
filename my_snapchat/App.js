import React, { useState } from 'react';
import { Text, View, SafeAreaView, StatusBar, TouchableHighlight, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Views/login';
import Register from './Views/register';
import appStyles from './Style/app';
import Snapshot from './Views/snapshot';
import UserList from './Views/UserList';
import Profile from './Views/profile';
import SnapList from './Views/SnapList';
import SeeSnap from './Views/SeeSnap';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCamera, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AuthProvider } from "./Contexts/AuthContext";

library.add(faCamera, faUser, faLock);

const Stack = createStackNavigator();

const SplashScreen = ({ navigation }) => {
    const handleLogin = () => {
        navigation.navigate('Login');
    };
    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={appStyles.innerContainer}>
            <Image source={require('./Assets/logo.png')} style={appStyles.logo} />
            <TouchableHighlight style={appStyles.button} underlayColor="#DDDDDD" onPress={handleLogin}>
                <Text style={appStyles.buttonText}>
                    Se connecter <FontAwesomeIcon icon="user" size={20} color="white" />
                </Text>
            </TouchableHighlight>
            <TouchableHighlight style={appStyles.button} underlayColor="#DDDDDD" onPress={handleRegister}>
                <Text style={appStyles.buttonText}>
                    S'enregistrer <FontAwesomeIcon icon="lock" size={20} color="white" />
                </Text>
            </TouchableHighlight>
        </View>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <SafeAreaView style={appStyles.container}>
                <StatusBar backgroundColor="black" />
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="SplashScreen" options={{ headerShown: false }} component={SplashScreen} />
                        <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
                        <Stack.Screen name="Register" options={{ headerShown: false }} component={Register} />
                        <Stack.Screen name="Snapshot" options={{ headerShown: false }} component={Snapshot} />
                        <Stack.Screen name="UserList" options={{ headerShown: false }} component={UserList} />
                        <Stack.Screen name="Profile" options={{ headerShown: false }} component={Profile} />
                        <Stack.Screen name="SnapList" options={{ headerShown: false }} component={SnapList} />
                        <Stack.Screen name="SeeSnap" options={{ headerShown: false }} component={SeeSnap} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </AuthProvider>
    );
};

export default App;
