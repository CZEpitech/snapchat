import React, { useState, useEffect, useContext } from 'react';
import { Text, View, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AuthContext from '../Contexts/AuthContext';
import appStyles from '../Style/app';
import { useNavigation, useRoute } from '@react-navigation/native';

const UserList = () => {
    const route = useRoute();
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
    const { base64Image } = route.params;
    const [duration, setDuration] = useState(5);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://mysnapchat.epidoc.eu/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userList = response.data;
            // console.log('User List:', userList);
            setUsers(userList.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDurationChange = (value) => {
        setDuration(value);
        sendPhoto(selectedUserId);
    };

    const sendPhoto = async (userId) => {
        if (base64Image) {
            try {
                const response = await axios.post(
                    `https://mysnapchat.epidoc.eu/snap`,
                    { image: "data:image/png;base64," + base64Image, to: userId, duration },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log('Photo envoyée avec succès !', response.data);
                route.params.onNavigateBack();
                navigation.goBack();
            } catch (error) {
                console.log('Erreur lors de l\'envoi de la photo :', error?.response?.data?.data ?? error);
            }
        }
    };

    const handleSendPhoto = (userId) => {
        axios
            .post('https://mysnapchat.epidoc.eu/snap', {
                to: userId,
                image: base64Image,
                duration: 5,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });

        console.log(`Envoyer une photo à l'utilisateur avec l'ID ${userId}`);
        
    };

    const renderItem = ({ item }) => {
        return (
            <View key={item.id}>
                <Text>Nom: {item.username}</Text>
                <TouchableOpacity
                    style={[appStyles.button, appStyles.sendButton]}
                    onPress={() => handleSendPhoto(item._id)}
                >
                    <Text style={[appStyles.buttonText, appStyles.center]}>Envoyer</Text>
                </TouchableOpacity>
                {selectedUserId === item._id && (
                    <View>
                        <Text>Choisir la durée :</Text>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <TouchableOpacity
                                key={value}
                                style={[appStyles.button, duration === value && appStyles.selectedButton]}
                                onPress={() => handleDurationChange(value)}
                            >
                                <Text style={appStyles.buttonText}>{value} seconde{value > 1 ? 's' : ''}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView>
            <View>
                <Text>Liste des utilisateurs :</Text>
                {users.length > 0 ? (
                    <FlatList data={users} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
                ) : (
                    <Text>Aucun utilisateur trouvé.</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default UserList;
