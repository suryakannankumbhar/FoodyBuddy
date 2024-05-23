import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';

const TitleBar = ({ handleLogout }) => {
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FoodyBuddy</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Icon name='logout' size={24} color='black' />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 15,
        backgroundColor: '#A1C6EA',
        elevation: 4,
        minWidth: '100%',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Poppins_700Bold',
        paddingVertical: 15,
    },
});

export default TitleBar;
