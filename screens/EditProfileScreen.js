import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserInfoForm from '../components/UserInfoForm';
import { firestore } from '../config/firebase';
import firebase from '../config/firebase';

const EditProfileScreen = ({ route, navigation }) => {
    const { user, updateUserInfoInHomeScreen } = route.params;
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfoRef = firestore.collection('users').doc(user.uid);
                const doc = await userInfoRef.get();

                if (doc.exists) {
                    setUserInfo(doc.data());
                } else {
                    setUserInfo(null);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [user]);

    const handleSubmit = async userData => {
        try {
            const updatedUserData = {
                ...userData,
                email: user.email,
            };

            await firestore
                .collection('users')
                .doc(user.uid)
                .set(updatedUserData);

            // Call the updateUserInfoInHomeScreen function with the updated data
            updateUserInfoInHomeScreen(updatedUserData);
        } catch (error) {
            console.error('Error saving user info:', error);
        }
    };

    return (
        <View style={styles.container}>
            {userInfo ? (
                <UserInfoForm
                    user={user}
                    onSubmit={handleSubmit}
                    route={route}
                    initialValues={userInfo}
                />
            ) : (
                <Text style={styles.loadingText}>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2F0F9', // Pastel Blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: 'black', // Black
    },
    message: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black', // Black
        top: 190,
    },
});

export default EditProfileScreen;
