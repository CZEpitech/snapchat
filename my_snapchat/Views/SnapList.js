import React, { useState, useEffect, useContext } from 'react';
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AuthContext from '../Contexts/AuthContext';
import appStyles from '../Style/app';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';

const SnapList = () => {
  const route = useRoute();
  const { token } = useContext(AuthContext);
  const [snaps, setSnaps] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(() => {
    fetchSnaps();
  });

  const fetchSnaps = async () => {
    try {
      const response = await axios.get('https://mysnapchat.epidoc.eu/snap', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedSnaps = response.data.data;

      const updatedSnaps = await Promise.all(
        fetchedSnaps.map(async (snap) => {
          const userName = await fetchUser(snap.from);
          snap.from = userName;
          return snap;
        })
      );

      setSnaps(updatedSnaps);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`https://mysnapchat.epidoc.eu/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data.username;
    } catch (error) {
      console.error(error);
      return '';
    }
  };

  const fetchSnap = async (snapId) => {
    try {
      const response = await axios.get(`https://mysnapchat.epidoc.eu/snap/${snapId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return '';
    }
  };

  const handleButtonPress = async (id) => {
    try {
      const snapData = await fetchSnap(id);
      navigation.navigate('SeeSnap', { snap: snapData.data });
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <SafeAreaView>
      <View>
        <Text>Liste des snaps :</Text>
        {snaps.length > 0 ? (
          snaps.map((item) => (
            <TouchableOpacity
              key={item._id}
              onPress={() => handleButtonPress(item._id)}
              style={appStyles.button}
            >
              <Text>{item.from}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Aucun snap.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SnapList;
