import React, { useEffect, useContext } from 'react';
import { View, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AuthContext from '../Contexts/AuthContext';

const SeeSnap = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const snap = route.params.snap;
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSnapSeen(snap._id);
      console.log('Snap is over');
    }, snap.duration * 1000);

    return () => clearTimeout(timer); // Clear the timer on component unmount

  }, [snap, navigation]);

  const setSnapSeen = async (snapId) => {
    try {
      const response = await axios.put(
        `https://mysnapchat.epidoc.eu/snap/seen/${snapId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Image source={{ uri: snap.image }} style={{ width: '100%', height: '100%' }} />
    </View>
  );
};

export default SeeSnap;
