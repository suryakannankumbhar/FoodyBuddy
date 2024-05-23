// components/AppName.js
import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import wavingGif from '../assets/eating.gif';

const AppName = () => {
    return (
        <View>
            <View style={styles.wavingGifContainer}>
                <Image source={wavingGif} style={styles.wavingGif} />
            </View>
            <Text style={styles.appName}>FoodyBuddy</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    appName: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Dark Gray
    },
    wavingGifContainer: {
        width: 200,
        height: 200,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#E2F0F9',
    },
    wavingGif: {
        width: '100%',
        height: '100%',
    },
});

export default AppName;
