import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './button';
import { FileSystem } from 'react-native-unimodules';
import appStyles from "../Style/app";
import { useNavigation } from '@react-navigation/native';
import { Modal } from 'react-native';
import Profile from './profile';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';


const Snapshot = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const disableGestureOnSwipeBack = () => {
        if (Platform.OS === 'ios') {
          const handler = ({ nativeEvent }) => {
            if (nativeEvent.state === State.END) {
              BackHandler.exitApp(); // Quit the app
            }
          };

          const subscription = InteractionManager.runAfterInteractions(() => {
            const route = navigation.dangerouslyGetState().routes.find(
              (r) => r.key === navigation.dangerouslyGetState().routes[0].key
            );
            if (route) {
              const topScreenOptions = route?.options;
              topScreenOptions.gestureEnabled = true;
              topScreenOptions.gestureResponseDistance = { vertical: -1 };
              topScreenOptions.gestureDirection = 'vertical';
              topScreenOptions.cardStyleInterpolator = () => null;
            }
          });

          const panGestureHandler = InteractionManager.runAfterInteractions(() =>
            PanGestureHandler.addListener(handler)
          );

          return () => {
            panGestureHandler.remove();
            subscription();
          };
        }
      };

      disableGestureOnSwipeBack();
    }, [])
  );

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove;
  }, []);

  // Demander la permission d'accès à la caméra
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const convertToPNG = async (uri) => {
    try {
      const convertedImage = await manipulateAsync(
        uri,
        [{ format: 'png' }],
        { compress: 1, format: 'png', base64: false }
      );
      return convertedImage.uri;
    } catch (error) {
      console.log(error);
      return null;
    }
  };  

  const getImageSize = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileSizeInBytes = blob.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
  };  
  
  const getGallery = async () => {
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaType: ImagePicker.MediaTypeOptions.Photo,
        quality: 0.8,
      });
  
      console.log('Image sélectionnée:', response);
  
      if (!response.cancelled) {
        // Compression de l'image sélectionnée
        await compressImage(response.uri);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const compressImage = async (uri) => {
    try {
      const compressedImage = await manipulateAsync(
        uri,
        [{ resize: { width: 800, height: 800 } }],
        { format: 'jpeg', compress: 0.8 }
      );
      setImage(compressedImage.uri);
    } catch (error) {
      console.log(error);
    }
  };
  

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const codePicture = async () => {
    if (image) {
      try {
        const uri = image;

        const base64Image = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Naviguer vers la page UserList
        navigation.navigate('UserList', { base64Image });

      } catch (error) {
        console.log(error);
      }
    }
  };

  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        alert('Picture saved! 🎉');
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>Please grant us access to the camera first</Text>;
  }

  return (
    <View style={styles.container}>

{isProfileModalVisible && (
      <Modal
        isVisible={isProfileModalVisible}
        onBackdropPress={toggleProfileModal}
        backdropOpacity={0.5}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        style={styles.profileModal}
      >
        <TouchableOpacity
          style={styles.profileModalContent}
          onPress={toggleProfileModal}
        >
          <Profile />
        </TouchableOpacity>
      </Modal>
    )}

      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          flashMode={flash}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
            }}
          >


            <View>
              <Button
                title=""
                icon="retweet"
                onPress={() => {
                  setType(
                    type === CameraType.back ? CameraType.front : CameraType.back
                  );
                }}
              />
              <Button
                onPress={() =>
                  setFlash(
                    flash === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off
                  )
                }
                icon="flash"
                color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
              />
              <Button
                onPress={() =>
                  setFlash(
                    flash === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off
                  )
                }
                icon="comment"
                color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
              />
            </View>
            <Button
              onPress={() =>
                toggleProfileModal()
              }
              icon="gear"
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
            />
          </View>
        </Camera>
      ) : (
        image !== null && <Image source={{ uri: image }} style={styles.camera} />
      )}

      <View style={styles.controls}>
        {image ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 50,
            }}
          >
            <Button title="" onPress={() => setImage(null)} icon="close" />
            <Button title="" onPress={savePicture} icon="download" />
            <Button title="" onPress={codePicture} icon="send" />
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 50,
            }}
          >
            <Button title="" onPress={takePicture} icon="camera" />
            <Button title="" onPress={getGallery} icon="photo" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  controls: {
    flex: 0.5,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E9730F',
    marginLeft: 10,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
  },
  profileModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  profileModalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  profileModalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Snapshot;
