import React, { useState } from 'react';
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, TextInput, Image } from 'react-native';
import axios from 'axios';
import appStyles from '../Style/app';
import { useNavigation } from '@react-navigation/native';
import { faLock, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigation = useNavigation();
    const handleBack = () => {
        navigation.navigate('SplashScreen');
    };

    const handleRegister = () => {
        if (!email || !password || !username) {
            alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }


        axios
            .post('https://mysnapchat.epidoc.eu/user', {
                email,
                password,
                username,
            })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
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
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChangeText={text => setUsername(text)}
                        style={appStyles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                    <View style={appStyles.iconContainer}>
                        <FontAwesomeIcon icon={faUser} size={20} color="white" />
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

                <TouchableOpacity style={[appStyles.button, appStyles.register]} onPress={handleRegister}>
                    <Text style={[appStyles.buttonText, appStyles.center]}>Inscription</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[appStyles.button, appStyles.register]} onPress={handleBack}>
                    <Text style={[appStyles.buttonText, appStyles.center]}>Retour</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Register;
