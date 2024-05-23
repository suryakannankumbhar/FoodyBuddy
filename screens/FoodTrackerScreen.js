import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Button,
    Alert,
    TouchableOpacity,
} from 'react-native';
import firebase, { firestore } from '../config/firebase';
import { Harris_Benedict_BMR } from '../components/BMRCalculator';

const FoodTrackerScreen = ({ route, navigation }) => {
    const { user, selectedItems } = route.params || {};
    const [trackedItems, setTrackedItems] = useState(selectedItems || []);
    const [savedItems, setSavedItems] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (Array.isArray(selectedItems) && selectedItems.length > 0) {
            setTrackedItems(selectedItems);
            setSavedItems([]); // Reset savedItems when selectedItems changes
        } else {
            setTrackedItems([]);
            setSavedItems([]); // Reset savedItems when selectedItems is empty
        }
    }, [selectedItems]);

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

    const getTotalMacros = () => {
        const totalCalories = trackedItems.reduce(
            (acc, item) => acc + item.calories * 1.5,
            0
        );
        const totalCarbs = trackedItems.reduce(
            (acc, item) => acc + item.carbs * 1.5,
            0
        );
        const totalProtein = trackedItems.reduce(
            (acc, item) => acc + item.protein * 1.5,
            0
        );
        const totalFat = trackedItems.reduce(
            (acc, item) => acc + item.fat * 1.5,
            0
        );

        return { totalCalories, totalCarbs, totalProtein, totalFat };
    };

    const calculateBMR = () => {
        if (
            userInfo &&
            userInfo.gender &&
            userInfo.height &&
            userInfo.weight &&
            userInfo.age
        ) {
            return Harris_Benedict_BMR(
                userInfo.gender,
                userInfo.height,
                userInfo.weight,
                userInfo.age
            );
        } else {
            return null;
        }
    };

    const handleSaveData = async () => {
        if (trackedItems.length === 0) {
            Alert.alert('Error', 'No items to save.');
            return;
        }

        try {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();

            // Get the existing 'foodLog' document for the user
            const userFoodLogRef = firestore
                .collection('users')
                .doc(user.uid)
                .collection('foodLog')
                .doc(user.uid);

            // Check if the 'foodLog' document exists
            const doc = await userFoodLogRef.get();

            // If the document doesn't exist, create a new one
            if (!doc.exists) {
                await userFoodLogRef.set({
                    items: trackedItems,
                    timestamp,
                });
            } else {
                // If the document exists, update the 'items' array
                const existingItems = doc.data().items || [];
                const updatedItems = [...existingItems, ...trackedItems];

                await userFoodLogRef.update({
                    items: updatedItems,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }

            // Store the saved items
            setSavedItems(doc.exists ? doc.data().items : trackedItems);

            // Clear the tracked items after saving
            setTrackedItems([]);

            Alert.alert('Success', 'Data has been uploaded successfully.');
        } catch (error) {
            console.error('Error saving data:', error);
            Alert.alert('Error', 'Failed to upload data. Please try again.');
        }
    };

    const removeItem = index => {
        setTrackedItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    const { totalCalories, totalCarbs, totalProtein, totalFat } =
        getTotalMacros();

    return (
        <View style={styles.container}>
            <FlatList
                data={trackedItems.length > 0 ? trackedItems : savedItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.foodItem}>
                        <View style={styles.foodDetails}>
                            <Text style={styles.foodName}>{item.name}</Text>
                            <Text>Calories: {item.calories}</Text>
                            <Text>Carbs: {item.carbs}g</Text>
                            <Text>Protein: {item.protein}g</Text>
                            <Text>Fat: {item.fat}g</Text>
                        </View>
                        {trackedItems.length > 0 && (
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeItem(index)}
                            >
                                <Text style={styles.removeButtonText}>
                                    Remove
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
            <View style={styles.macroContainer}>
                <Text style={styles.macroTitle}>
                    Recommended Calories: {calculateBMR()?.toFixed(2)}
                </Text>
                <Text style={styles.macroTitle}>Total Macros:</Text>
                <Text>Calories: {totalCalories}</Text>
                <Text>Carbs: {totalCarbs}g</Text>
                <Text>Protein: {totalProtein}g</Text>
                <Text>Fat: {totalFat}g</Text>
            </View>
            <Button
                style={styles.saveButton}
                title='Save Data'
                onPress={handleSaveData}
                color='#A1C6EA'
                disabled={trackedItems.length === 0}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E2F0F9', // Pastel Blue
    },
    foodItem: {
        backgroundColor: 'white', // White
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    foodDetails: {
        flex: 1,
    },
    foodName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black', // Black
    },
    macroContainer: {
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
    macroTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black', // Black
    },
    removeButton: {
        backgroundColor: '#A1C6EA',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    removeButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },

    macroContainer: {
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
    macroTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black', // Black
    },
});

export default FoodTrackerScreen;
