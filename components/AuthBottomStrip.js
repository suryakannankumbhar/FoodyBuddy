// components/AuthBottomStrip.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AuthBottomStrip = ({ isLogin, onSwitchAuthScreen, navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => onSwitchAuthScreen(navigation, !isLogin)}
            >
                <Text style={styles.text}>
                    {isLogin
                        ? "Don't have an account? Register"
                        : 'Already have an account? Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f2f2f2',
        padding: 16,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});

export default AuthBottomStrip;
