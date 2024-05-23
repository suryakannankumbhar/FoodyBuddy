import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import TitleBar from '../components/TitleBar';
import firebase, { firestore } from '../config/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Harris_Benedict_BMR } from '../components/BMRCalculator';

const StepTrackerScreen = ({ route, navigation }) => {
    const { user, walkingData } = route.params || {};
    const [totalCalories, setTotalCalories] = useState(0);
    const [BMR, setBMR] = useState(0);
    const [excessCalories, setExcessCalories] = useState(0);
    const [stepsToburn, setStepsToburn] = useState(0);
    const [userInfo, setUserInfo] = useState(null);
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        if (user) {
            const fetchUserInfo = async () => {
                try {
                    const userInfoRef = firestore
                        .collection('users')
                        .doc(user.uid);
                    const doc = await userInfoRef.get();

                    if (doc.exists) {
                        setUserInfo(doc.data());
                        calculateBMR(doc.data());
                        calculateTotalCalories(doc.data());
                    } else {
                        setUserInfo(null);
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            };

            fetchUserInfo();
        } else {
            console.error('User object is undefined');
            Alert.alert(
                'Error',
                'User information is not available. Please try again.'
            );
            navigation.goBack();
        }
    }, [user]);

    useEffect(() => {
        if (walkingData) {
            const { time, steps, heartBeat } = walkingData;
            const formattedTimeString = formatTime(time);
            setFormattedTime(formattedTimeString);
            saveWalkingData(time, steps, heartBeat);
            console.log('Walking data:', {
                formattedTimeString,
                steps,
                heartBeat,
            });
        }
    }, [walkingData]);

    const saveWalkingData = async (time, steps, heartBeat) => {
        try {
            const userWalkingLogRef = firestore
                .collection('users')
                .doc(user.uid)
                .collection('walkingLog')
                .doc();
            await userWalkingLogRef.set({
                time,
                steps,
                heartBeat,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            console.log('Walking data saved to Firestore');
        } catch (error) {
            console.error('Error saving walking data to Firestore:', error);
        }
    };

    const calculateBMR = userData => {
        if (
            userData &&
            userData.gender &&
            userData.height &&
            userData.weight &&
            userData.age
        ) {
            const bmr = Harris_Benedict_BMR(
                userData.gender,
                userData.height,
                userData.weight,
                userData.age
            );
            setBMR(bmr);
        } else {
            setBMR(null);
        }
    };

    const calculateTotalCalories = async userData => {
        try {
            const userFoodLogRef = firestore
                .collection('users')
                .doc(user.uid)
                .collection('foodLog')
                .doc(user.uid);
            const doc = await userFoodLogRef.get();
            let totalCalories = 0;
            if (doc.exists) {
                const items = doc.data().items || [];
                totalCalories = items.reduce(
                    (acc, item) => acc + item.calories,
                    0
                );
            }
            setTotalCalories(totalCalories);
            calculateExcessCalories(
                totalCalories,
                userData.gender,
                userData.height,
                userData.weight,
                userData.age
            );
        } catch (error) {
            console.error('Error retrieving total calories:', error);
        }
    };

    const calculateExcessCalories = (
        totalCalories,
        gender,
        height,
        weight,
        age
    ) => {
        const bmr = Harris_Benedict_BMR(gender, height, weight, age);
        if (bmr !== null) {
            const excess = totalCalories - bmr;
            setExcessCalories(excess);

            const stepsToburn = excess * 20;
            setStepsToburn(stepsToburn);
        } else {
            console.error(
                'BMR is null, unable to calculate excess calories and steps'
            );
        }
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

    const handleWalkingScreenNavigation = () => {
        navigation.navigate('Walking', { user });
    };

    const formatTime = timeString => {
        const date = new Date(timeString);
        return date.toLocaleString();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.titleBarContainer}>
                <TitleBar handleLogout={handleLogout} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Step Tracker</Text>
                <Text style={styles.text}>
                    Total Calories Consumed: {totalCalories}
                </Text>
                {BMR !== null ? (
                    <Text style={styles.text}>BMR: {BMR.toFixed(2)}</Text>
                ) : (
                    <Text style={styles.text}>BMR: N/A</Text>
                )}
                {excessCalories !== null && excessCalories > 0 ? (
                    <Text style={styles.text}>
                        Excess Calories: {excessCalories.toFixed(2)}
                    </Text>
                ) : (
                    <Text style={styles.text}>
                        Excess Calories: Not Applicable
                    </Text>
                )}
                {stepsToburn !== null && stepsToburn > 0 ? (
                    <Text style={styles.text}>
                        Steps to Burn Excess Calories: {stepsToburn.toFixed(0)}
                    </Text>
                ) : (
                    <Text style={styles.text}>
                        Steps to Burn Excess Calories: Not Applicable
                    </Text>
                )}
                {walkingData && (
                    <>
                        <Text style={styles.text}>
                            Steps: {walkingData.steps}
                        </Text>
                        <Text style={styles.text}>
                            Heart Beat(BPM): {walkingData.heartBeat}
                        </Text>
                    </>
                )}
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={handleWalkingScreenNavigation}
            >
                <Text style={styles.buttonText}>Start Walking</Text>
            </TouchableOpacity>
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
                    <Icon name='person' size={24} color='gray' />
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
                    <Icon name='directions-walk' size={24} color='black' />
                    <Text style={styles.navButtonText}>Steps</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2F0F9',
    },
    titleBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    text: {
        fontSize: 16,
        marginVertical: 8,
        color: '#666',
    },
    button: {
        backgroundColor: '#A1C6EA',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 200,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#A1C6EA',
        padding: 8,
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    navButton: {
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#4D4D4D',
    },
});

export default StepTrackerScreen;
