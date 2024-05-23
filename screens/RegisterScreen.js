// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from '../config/firebase.utils';
import AuthBottomStrip from '../components/AuthBottomStrip';
import firebase from '../config/firebase';
import AppName from '../components/AppName';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleRegistration = async () => {
        try {
            const { user, userDocRef } = await createUserWithEmailAndPassword(
                email,
                password,
                name
            );

            if (user) {
                console.log('Registered user:', user);
                navigation.navigate('EditProfileScreen', {
                    user,
                    email,
                    name,
                    updateUserInfoInHomeScreen: updatedUserInfo => {
                        // Navigate to the HomeScreen with the updated data
                        navigation.navigate('Home', { updatedUserInfo });
                    },
                });
            } else {
                console.error('Registration failed, no user object returned');
                // Handle registration failure
            }
        } catch (error) {
            console.error('Registration error:', error);
            // Handle registration error
        }
    };

    const handleSwitchAuthScreen = (navigation, isLogin) => {
        if (isLogin) {
            navigation.navigate('Login');
        }
    };

    return (
        <View style={styles.container}>
            <AppName />
            <TextInput
                style={styles.input}
                placeholder='Name'
                value={name}
                onChangeText={setName}
            />
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
            <Button title='Register' onPress={handleRegistration} />
            <AuthBottomStrip
                isLogin={false}
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
        borderColor: '#4D4D4D', // Dark Gray
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF', // White
    },
});

export default RegisterScreen;
