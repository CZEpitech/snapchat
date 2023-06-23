import { StyleSheet } from 'react-native';

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#404040',
        justifyContent: 'center',
    },
    innerContainer: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#404040',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },


    button: {
        marginBottom: 6,
        backgroundColor: '#8c52ff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    register: {
        width: 150,
        textAlign: 'center',
    },
    center: {
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 15,
        width: 300,
        backgroundColor: '#242323',
        borderRadius: 50,
    },
    input: {
        flex: 1,
        color: 'white',
        height: 40,
        color: "#FFFFFF",
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
    },
    inputSpacing: {
        marginBottom: 10,
    }
});

export default appStyles;
