import React, { useContext, useEffect, useState } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import AuthContext from '../Contexts/AuthContext';
import appStyles from "../Style/app";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const Profile = () => {
    const { token, setToken } = useContext(AuthContext);
    const navigation = useNavigation();
    const [receivedPhotos, setReceivedPhotos] = useState([]);


    useEffect(() => {
        fetchReceivedPhotos();
    }, []);

    const fetchReceivedPhotos = async () => {
        try {
            const response = await axios.get('https://mysnapchat.epidoc.eu/snap/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const photos = response.data;
            console.log('Received Photos:', photos);
            setReceivedPhotos(photos.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        setToken('');
        navigation.navigate('Login');
        console.log('Déconnecté');
    };

    const handleReturn = () => {
        navigation.navigate('Snapshot');
    };
    const handleSnaps = () => {
        navigation.navigate('SnapList');
    };

    return (
        <SafeAreaView>
            <View>
                <TouchableOpacity style={[appStyles.button, appStyles.logoutButton]} onPress={handleLogout}>
                    <Text style={[appStyles.buttonText, appStyles.center]}>Déconnexion</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[appStyles.button, appStyles.logoutButton]} onPress={handleSnaps}>
                    <Text style={[appStyles.buttonText, appStyles.center]}>Snaps</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[appStyles.button, appStyles.returnButton]} onPress={handleReturn}>
                    <Text style={[appStyles.buttonText, appStyles.center]}>Retour</Text>
                </TouchableOpacity>

                {receivedPhotos.length > 0 ? (
                    <View>
                        <Text>Photos reçues :</Text>
                        {receivedPhotos.map((photo) => (
                            <View key={photo.id}>
                                <Image source={{ uri: photo.image }} style={{ width: 200, height: 200 }} />
                                <Text>Expéditeur: {photo.from}</Text>
                                <Text>Durée: {photo.duration} seconde{photo.duration > 1 ? 's' : ''}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text>Aucune snap reçue.</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Profile;
