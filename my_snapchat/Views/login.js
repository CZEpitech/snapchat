import React, { useState, useContext } from 'react';
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import axios from 'axios';
import AuthContext from '../Contexts/AuthContext';
import appStyles from '../Style/app';
import { useNavigation } from '@react-navigation/native';
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setToken } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        axios
            .put('https://mysnapchat.epidoc.eu/user', {
                email,
                password,
            })
            .then(response => {
                const { token } = response.data.data;
                setToken(token);
                navigation.navigate('Snapshot');
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleBack = () => {
        navigation.navigate('SplashScreen');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar backgroundColor="black" />
            <View style={appStyles.innerContainer}>
                <Image source={require('../Assets/logo.png')} style={appStyles.logo} />



                <View style={[appStyles.inputContainer, appStyles.inputSpacing]}>
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={appStyles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                    <View style={appStyles.iconContainer}>
                        <FontAwesomeIcon icon={faEnvelope} size={20} color="white" />
                    </View>
                </View>

                <View style={[appStyles.inputContainer, appStyles.inputSpacing]}>
                    <TextInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                        style={appStyles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                    <View style={appStyles.iconContainer}>
                        <FontAwesomeIcon icon={faLock} size={20} color="white" />
                    </View>
                </View>

                <TouchableOpacity style={[appStyles.button, appStyles.register]} onPress={handleLogin}>
                    <Text style={[appStyles.buttonText, appStyles.center]}>Connexion</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[appStyles.button, appStyles.register]} onPress={handleBack}>
                    <Text style={[appStyles.buttonText, appStyles.center]}>Retour</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Login;
