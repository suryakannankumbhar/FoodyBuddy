// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from '../config/firebase.utils';
import AuthBottomStrip from '../components/AuthBottomStrip';
import AppName from '../components/AppName';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const { user, displayName } = await signInWithEmailAndPassword(
                email,
                password
            );
            console.log('Logged in user:', user);
            navigation.navigate('Home', { displayName });
        } catch (error) {
            console.error('Login error:', error);
            // Handle login error
        }
    };

    const handleSwitchAuthScreen = (navigation, isRegister) => {
        if (!isRegister) {
            navigation.navigate('Register');
        }
    };

    return (
        <View style={styles.container}>
            <AppName />
            <TextInput
                style={styles.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title='Login' onPress={handleLogin} />
            <AuthBottomStrip
                isLogin={true}
                onSwitchAuthScreen={handleSwitchAuthScreen}
                navigation={navigation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E2F0F9', // Pastel Blue
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#333', // Dark Gray
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF', // White
    },
});

export default LoginScreen;
