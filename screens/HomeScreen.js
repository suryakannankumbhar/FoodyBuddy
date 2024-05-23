import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import firebase, { firestore } from '../config/firebase';
import {
    breakfastData,
    lunchData,
    snacksData,
    dinnerData,
    dessertData,
} from '../assets/foodData';
import MealTab from '../components/MealTab';
import FoodTrackerScreen from './FoodTrackerScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    useFonts,
    Poppins_400Regular,
    Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import TitleBar from '../components/TitleBar';

const HomeScreen = ({ route, navigation }) => {
    const { user: initialUser, updatedUserInfo } = route.params || {};
    const [user, setUser] = useState(initialUser);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mealTabKey, setMealTabKey] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [trackedItems, setTrackedItems] = useState([]);
    const [selectedItemsFromHome, setSelectedItemsFromHome] = useState([]);

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setIsLoading(true);
                const userInfoRef = firestore.collection('users').doc(user.uid);
                const doc = await userInfoRef.get();

                if (doc.exists) {
                    setUserInfo(doc.data());
                } else {
                    setUserInfo(null);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, [user]);

    useEffect(() => {
        if (updatedUserInfo) {
            setUserInfo(updatedUserInfo);
        }
    }, [updatedUserInfo]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSelectedItems([]);
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (userInfo) {
            setMealTabKey(prevKey => prevKey + 1);
        }
    }, [userInfo]);

    const handleLogout = async () => {
        try {
            await firebase.auth().signOut();
            navigation.navigate('Login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const calculateBMI = () => {
        if (userInfo && userInfo.height && userInfo.weight) {
            const heightInMeters = userInfo.height / 100;
            const bmi = userInfo.weight / (heightInMeters * heightInMeters);
            return bmi.toFixed(2);
        } else {
            return null;
        }
    };

    const userBMI = calculateBMI();

    const handleFoodItemSelect = item => {
        setSelectedItemsFromHome(prevItems => [...prevItems, item]);
    };

    const addItem = item => {
        setTrackedItems(prevItems => [...prevItems, item]);
    };

    const handleGoToFoodTracker = () => {
        navigation.navigate('FoodTracker', {
            user,
            selectedItems: selectedItemsFromHome,
        });
        setSelectedItemsFromHome([]);
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
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            {isLoading ? (
                <ActivityIndicator size='large' color='black' />
            ) : userInfo ? (
                <SafeAreaView style={styles.container}>
                    <View style={styles.contentContainer}>
                        <TitleBar handleLogout={handleLogout} />
                        <ScrollView
                            contentContainerStyle={styles.scrollContainer}
                        >
                            <Text style={styles.bmiValue}>
                                Current BMI: {calculateBMI()}
                            </Text>
                            <Text style={styles.message}>
                                Food Recommendations:
                            </Text>
                            <MealTab
                                key={`breakfast-${mealTabKey}`}
                                style={styles.mealTab}
                                title='Breakfast'
                                data={breakfastData}
                                userPreference={userInfo.mealPreference}
                                userInfo={userInfo}
                                calculateBMI={calculateBMI}
                                trackedItems={trackedItems}
                                setTrackedItems={setTrackedItems}
                                onItemSelect={handleFoodItemSelect}
                            />
                            <MealTab
                                key={`lunch-${mealTabKey}`}
                                style={styles.mealTab}
                                title='Lunch'
                                data={lunchData}
                                userPreference={userInfo.mealPreference}
                                userInfo={userInfo}
                                calculateBMI={calculateBMI}
                                trackedItems={trackedItems}
                                setTrackedItems={setTrackedItems}
                                onItemSelect={handleFoodItemSelect}
                            />
                            <MealTab
                                key={`snacks-${mealTabKey}`}
                                style={styles.mealTab}
                                title='Snacks'
                                data={snacksData}
                                userPreference={userInfo.mealPreference}
                                userInfo={userInfo}
                                calculateBMI={calculateBMI}
                                trackedItems={trackedItems}
                                setTrackedItems={setTrackedItems}
                                onItemSelect={handleFoodItemSelect}
                            />
                            <MealTab
                                key={`dinner-${mealTabKey}`}
                                style={styles.mealTab}
                                title='Dinner'
                                data={dinnerData}
                                userPreference={userInfo.mealPreference}
                                userInfo={userInfo}
                                calculateBMI={calculateBMI}
                                trackedItems={trackedItems}
                                setTrackedItems={setTrackedItems}
                                onItemSelect={handleFoodItemSelect}
                            />
                            <MealTab
                                key={`dessert-${mealTabKey}`}
                                style={styles.mealTab}
                                title='Dessert'
                                data={dessertData}
                                userPreference={userInfo.mealPreference}
                                userInfo={userInfo}
                                calculateBMI={calculateBMI}
                                trackedItems={trackedItems}
                                setTrackedItems={setTrackedItems}
                                onItemSelect={handleFoodItemSelect}
                            />
                        </ScrollView>
                        {/* <TouchableOpacity
                            style={styles.floatingButton}
                            onPress={() =>
                                navigation.navigate('FoodTracker', { user })
                            }
                        >
                            <Icon name='add' size={24} color='black' />
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            style={styles.navigateToFoodTrackerButton}
                            onPress={handleGoToFoodTracker}
                        >
                            <Text style={styles.navigateToFoodTrackerText}>
                                Go to Food Tracker
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomNavigation}>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => handleMenuOptionPress('Home')}
                            color='green'
                        >
                            <Icon name='home' size={24} color='black' />
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
                            onPress={() =>
                                handleMenuOptionPress('FoodTrackingHistory')
                            }
                        >
                            <Icon name='history' size={24} color='gray' />
                            <Text style={styles.navButtonText}>History</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => handleMenuOptionPress('StepTracker')}
                        >
                            <Icon
                                name='directions-walk'
                                size={24}
                                color='gray'
                            />
                            <Text style={styles.navButtonText}>Steps</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            ) : (
                <Text>No Info Available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2F0F9',
        width: '100%',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#E2F0F9',
        borderRadius: 10,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Poppins_700Bold',
        marginVertical: 15,
    },
    bmiValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4D4D4D',
        fontFamily: 'Poppins_400Regular',
    },
    message: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4D4D4D',
        fontFamily: 'Poppins_400Regular',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#A1C6EA',
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#A1C6EA',
        padding: 10,
    },
    navButton: {
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#4D4D4D',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 15,
        backgroundColor: '#A1C6EA',
        elevation: 4,
    },
    navigateToFoodTrackerButton: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#A1C6EA',
        margin: 20,
    },
    navigateToFoodTrackerText: {
        fontSize: 20,
        padding: 15,
    },
});

export default HomeScreen;
