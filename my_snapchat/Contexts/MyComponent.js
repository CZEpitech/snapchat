import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import AuthContext from './AuthContext';

const MyComponent = () => {
    const { token } = useContext(AuthContext);

    return (
        <View>
            <Text>Token: {token}</Text>
        </View>
    );
};

export default MyComponent;
