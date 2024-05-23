import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import firebase, { firestore } from '../config/firebase';
import TitleBar from '../components/TitleBar';
import wavingGif from '../assets/wave.gif';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ route, navigation }) => {
    const [userInfo, setUserInfo] = useState(null);
    const { user } = route.params || {};

    console.log('User object=>', user);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (user) {
                    const displayName = user.displayName;

                    const userInfoRef = firestore
                        .collection('users')
                        .doc(user.uid);
                    const doc = await userInfoRef.get();

                    if (doc.exists) {
                        const userData = doc.data();
                        setUserInfo({ ...userData, name: displayName });
                    } else {
                        setUserInfo({ name: displayName });
                    }
                } else {
                    console.error('User object is undefined');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [user]);

    const handleEditProfile = () => {
        navigation.navigate('EditProfileScreen', {
            user,
            updateUserInfoInHomeScreen: updateUserInfoInHomeScreen,
        });
    };

    const updateUserInfoInHomeScreen = updatedUserInfo => {
        navigation.navigate('Home', { updatedUserInfo });
    };
    const handleLogout = async () => {
        try {
            await firebase.auth().signOut();
            navigation.navigate('Login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleMenuOptionPress = option => {
        switch (option) {
            case 'Home':
                console.log('User object in HomeScreen:', user);
                navigation.navigate('Home', { user });
                break;
            case 'Profile':
                console.log('User object in HomeScreen:', user);
                navigation.navigate('Profile', { user });
                break;
            case 'FoodTrackingHistory':
                navigation.navigate('FoodTrackingHistory', { user });
                break;
            case 'StepTracker':
                navigation.navigate('StepTracker', { user });
                break;
            case 'Logout':
                handleLogout();
                break;
            default:
                break;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleBarContainer}>
                <TitleBar handleLogout={handleLogout} />
            </View>
            <View style={styles.contentContainer}>
                {userInfo ? (
                    <>
                        <View style={styles.wavingGifContainer}>
                            <Image
                                source={wavingGif}
                                style={styles.wavingGif}
                            />
                        </View>
                        <Text style={styles.name}>{userInfo.name}</Text>
                        <Text style={styles.email}>{userInfo.email}</Text>
                        <Text style={styles.info}>
                            Gender: {userInfo.gender.toUpperCase()}
                        </Text>
                        <Text style={styles.info}>
                            Height: {userInfo.height} cm
                        </Text>
                        <Text style={styles.info}>
                            Weight: {userInfo.weight} kg
                        </Text>
                        <Text style={styles.info}>
                            Preference: {userInfo.mealPreference.toUpperCase()}
                        </Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={handleEditProfile}
                        >
                            <Text style={styles.editButtonText}>
                                Edit Profile
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text>Loading...</Text>
                )}
            </View>
            <View style={styles.bottomNavigation}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleMenuOptionPress('Home')}
                >
                    <Icon name='home' size={24} color='gray' />
                    <Text style={styles.navButtonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleMenuOptionPress('Profile')}
                >
                    <Icon name='person' size={24} color='black' />
                    <Text style={styles.navButtonText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleMenuOptionPress('FoodTrackingHistory')}
                >
                    <Icon name='history' size={24} color='gray' />
                    <Text style={styles.navButtonText}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleMenuOptionPress('StepTracker')}
                >
                    <Icon name='directions-walk' size={24} color='gray' />
                    <Text style={styles.navButtonText}>Steps</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#A1C6EA',
        padding: 8,
    },
    navButton: {
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#4D4D4D',
    },
    container: {
        flex: 1,
        backgroundColor: '#E2F0F9',
    },
    titleBarContainer: {
        // marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wavingGifContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#E2F0F9',
    },
    wavingGif: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontWeight: '900',
        fontSize: 24,
        color: 'black',
    },
    email: {
        fontSize: 15,
        marginBottom: 20,
        color: '#4D4D4D',
    },
    info: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    editButton: {
        backgroundColor: '#A1C6EA',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    editButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
export default ProfileScreen;
