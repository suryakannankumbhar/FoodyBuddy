import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import firebase, { firestore } from '../config/firebase';
import CustomCalendar from '../components/CustomCalender';
import TitleBar from '../components/TitleBar';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const FoodTrackingHistoryScreen = ({ route, navigation }) => {
    const { user } = route.params || {};
    const [foodLog, setFoodLog] = useState([]);
    const [walkingLog, setWalkingLog] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPanel, setCurrentPanel] = useState('food');

    useEffect(() => {
        const fetchFoodLog = async () => {
            try {
                if (user) {
                    const foodLogSnapshot = await firestore
                        .collection('users')
                        .doc(user.uid)
                        .collection('foodLog')
                        .orderBy('timestamp', 'desc')
                        .get();

                    const foodLogData = foodLogSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setFoodLog(foodLogData);
                } else {
                    console.error('User object is undefined');
                }
            } catch (error) {
                console.error('Error fetching food log:', error);
            }
        };

        const fetchWalkingLog = async () => {
            try {
                if (user) {
                    const walkingLogSnapshot = await firestore
                        .collection('users')
                        .doc(user.uid)
                        .collection('walkingLog')
                        .orderBy('timestamp', 'desc')
                        .get();

                    const walkingLogData = walkingLogSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setWalkingLog(walkingLogData);
                } else {
                    console.error('User object is undefined');
                }
            } catch (error) {
                console.error('Error fetching walking log:', error);
            }
        };

        fetchFoodLog();
        fetchWalkingLog();
    }, [user]);

    const handleDateSelect = date => {
        setSelectedDate(date);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedDate(null);
    };

    const getTotalMacros = items => {
        const totalCalories = items.reduce(
            (acc, item) => acc + item.calories,
            0
        );
        const totalCarbs = items.reduce((acc, item) => acc + item.carbs, 0);
        const totalProtein = items.reduce((acc, item) => acc + item.protein, 0);
        const totalFat = items.reduce((acc, item) => acc + item.fat, 0);

        return { totalCalories, totalCarbs, totalProtein, totalFat };
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

    const getSelectedDateFoodLog = () => {
        return foodLog.find(
            log =>
                log.timestamp &&
                log.timestamp.toDate().toDateString() ===
                    selectedDate?.toDate().toDateString()
        );
    };

    const getSelectedDateWalkingLog = () => {
        return walkingLog.find(
            log =>
                log.timestamp &&
                log.timestamp.toDate().toDateString() ===
                    selectedDate?.toDate().toDateString()
        );
    };

    const formatTime = timeString => {
        const date = new Date(timeString);
        return date.toLocaleString();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleBarContainer}>
                <TitleBar handleLogout={handleLogout} />
            </View>
            <Text style={styles.title}>
                Food Consumption and Walking History
            </Text>
            <View style={styles.calendarContainer}>
                <CustomCalendar
                    foodLog={foodLog}
                    walkingLog={walkingLog}
                    onDateSelect={handleDateSelect}
                />
            </View>
            <Modal visible={modalVisible} animationType='slide'>
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeModal}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <View style={styles.panelSwitchContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.panelSwitchButton,
                                    currentPanel === 'food'
                                        ? styles.activeButton
                                        : null,
                                ]}
                                onPress={() => setCurrentPanel('food')}
                            >
                                <Text style={styles.panelSwitchButtonText}>
                                    Food
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.panelSwitchButton,
                                    currentPanel === 'walk'
                                        ? styles.activeButton
                                        : null,
                                ]}
                                onPress={() => setCurrentPanel('walk')}
                            >
                                <Text style={styles.panelSwitchButtonText}>
                                    Walk
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalContent}>
                            {currentPanel === 'food' ? (
                                <View style={styles.leftPanel}>
                                    {getSelectedDateFoodLog() ? (
                                        <FlatList
                                            data={
                                                getSelectedDateFoodLog().items
                                            }
                                            keyExtractor={(foodItem, index) =>
                                                `${
                                                    getSelectedDateFoodLog().id
                                                }-${index}`
                                            }
                                            renderItem={({
                                                item: foodItem,
                                            }) => (
                                                <View style={styles.foodItem}>
                                                    <Text
                                                        style={styles.foodName}
                                                    >
                                                        {foodItem.name}
                                                    </Text>
                                                    <Text>
                                                        Calories:{' '}
                                                        {foodItem.calories}
                                                    </Text>
                                                    <Text>
                                                        Carbs: {foodItem.carbs}g
                                                    </Text>
                                                    <Text>
                                                        Protein:{' '}
                                                        {foodItem.protein}g
                                                    </Text>
                                                    <Text>
                                                        Fat: {foodItem.fat}g
                                                    </Text>
                                                </View>
                                            )}
                                        />
                                    ) : (
                                        <Text style={styles.noDataText}>
                                            No food log for the selected date.
                                        </Text>
                                    )}
                                </View>
                            ) : (
                                <View style={styles.leftPanel}>
                                    {getSelectedDateWalkingLog() ? (
                                        <FlatList
                                            data={[getSelectedDateWalkingLog()]}
                                            keyExtractor={item => item.id}
                                            renderItem={({ item }) => (
                                                <View
                                                    style={
                                                        styles.walkingLogItem
                                                    }
                                                >
                                                    <Text>
                                                        Steps: {item.steps}
                                                    </Text>
                                                    <Text>
                                                        Heart Beat (BPM):{' '}
                                                        {item.heartBeat}
                                                    </Text>
                                                    <Text>
                                                        Calories Burned:{' '}
                                                        {item.steps * 0.05}
                                                    </Text>
                                                </View>
                                            )}
                                        />
                                    ) : (
                                        <Text style={styles.noDataText}>
                                            No walking log for the selected
                                            date.
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                        <View
                            style={[
                                styles.macroContainer,
                                { marginTop: 'auto' },
                            ]}
                        >
                            <Text style={styles.macroTitle}>Total Macros:</Text>
                            {getSelectedDateFoodLog() && (
                                <>
                                    <Text>
                                        Calories:{' '}
                                        {
                                            getTotalMacros(
                                                getSelectedDateFoodLog().items
                                            ).totalCalories
                                        }
                                    </Text>
                                    <Text>
                                        Carbs:{' '}
                                        {
                                            getTotalMacros(
                                                getSelectedDateFoodLog().items
                                            ).totalCarbs
                                        }
                                        g
                                    </Text>
                                    <Text>
                                        Protein:{' '}
                                        {
                                            getTotalMacros(
                                                getSelectedDateFoodLog().items
                                            ).totalProtein
                                        }
                                        g
                                    </Text>
                                    <Text>
                                        Fat:{' '}
                                        {
                                            getTotalMacros(
                                                getSelectedDateFoodLog().items
                                            ).totalFat
                                        }
                                        g
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
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
                    <Icon name='history' size={24} color='black' />
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
        backgroundColor: '#A1C6EA', // Pastel Blue
        padding: 8,
        width: '100%',
    },
    navButton: {
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#4D4D4D', // Dark Gray
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333', // Dark Gray
    },
    titleBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#E2F0F9', // Pastel Blue
    },
    calendarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // White
        padding: 20,
    },
    closeButton: {
        marginBottom: 25,
        //     position: 'absolute',
        //     top: 20,
        //     right: 20,
        //     backgroundColor: '#FF5A5F', // Red
        //     paddingHorizontal: 20,
        //     paddingVertical: 10,
        //     borderRadius: 5,
    },
    closeButtonText: {
        color: '#FFFFFF', // White
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    modalContent: {
        flexDirection: 'row',
        width: '100%',
        height: '80%',
    },
    leftPanel: {
        flex: 1,
        backgroundColor: '#f0f0f0', // Light Gray
        padding: 20,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    rightPanel: {
        flex: 1,
        backgroundColor: '#f0f0f0', // Light Gray
        padding: 20,
    },
    foodItem: {
        backgroundColor: '#ffffff', // White
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    walkingLogItem: {
        backgroundColor: '#ffffff', // White
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    foodName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    macroContainer: {
        backgroundColor: '#f0f0f0', // Light Gray
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
    },
    macroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    noDataText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 50,
    },
    panelSwitchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    panelSwitchButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 5,
    },
    activeButton: {
        backgroundColor: '#A1C6EA',
    },
    panelSwitchButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    closeButton: {
        backgroundColor: '#FF5A5F',
        padding: 10,
        borderRadius: 5,
    },
});

export default FoodTrackingHistoryScreen;
