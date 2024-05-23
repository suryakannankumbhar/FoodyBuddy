import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MealTab = ({
    title,
    data,
    userPreference,
    userInfo,
    calculateBMI,
    trackedItems,
    setTrackedItems,
    onItemSelect,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [previouslyRecommendedItems, setPreviouslyRecommendedItems] =
        useState([]);

    const bmiConditions = {
        underweight: { calorieCond: 0, proteinCond: 10 },
        normal: { calorieCond: 0, proteinCond: 20 },
        overweight: { calorieCond: 1000, proteinCond: 30 },
        obese: { calorieCond: 1500, proteinCond: 40 },
    };

    const handleItemSelect = item => {
        onItemSelect(item); // Call the onItemSelect prop with the selected item
    };

    const userBMI = calculateBMI();

    if (!data) {
        return (
            <View style={styles.container}>
                <Text>No data available for {title}.</Text>
            </View>
        );
    }

    const filterFoodItems = (userBMI, previouslyRecommendedItems = []) => {
        let filteredItems = data;

        // First filter for user preference
        if (userPreference === 'vegan') {
            filteredItems = filteredItems.filter(item => item.type === 'vegan');
        } else if (userPreference === 'veg') {
            filteredItems = filteredItems.filter(
                item => item.type === 'veg' || item.type === 'vegan'
            );
        }
        // If preference is non-veg, no need to filter by type

        // Then filter for calorie conditions based on BMI
        if (userBMI < 18.5) {
            // Recommend high-calorie items for underweight
            filteredItems = filteredItems.filter(item => item.calories >= 1000);
        } else if (userBMI >= 25) {
            // Recommend low-calorie items for overweight and obese
            filteredItems = filteredItems.filter(item => item.calories <= 500);
        }
        // For normal weight, no need to filter by calories

        // Exclude previously recommended items
        filteredItems = filteredItems.filter(
            item =>
                !previouslyRecommendedItems.some(
                    prevItem => prevItem.name === item.name
                )
        );

        // Finally, filter for search text
        if (searchText) {
            filteredItems = filteredItems.filter(item =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        filteredItems = filteredItems.sort(() => Math.random() - 0.5);
        const recommendedItems = filteredItems.slice(0, 2);

        return recommendedItems;
    };

    const [recommendedItems, setRecommendedItems] = useState(
        filterFoodItems(userBMI, [])
    );

    const handleRefresh = () => {
        const newRecommendedItems = filterFoodItems(
            userBMI,
            previouslyRecommendedItems
        );
        setRecommendedItems(newRecommendedItems);
        setPreviouslyRecommendedItems(prevItems => [
            ...prevItems,
            ...newRecommendedItems,
        ]);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.tabContainer,
                    isExpanded && styles.expandedTabContainer,
                ]}
                onPress={() => setIsExpanded(!isExpanded)}
            >
                <Text style={styles.tabTitle}>{title}</Text>
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.recommendationsContainer}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder='Search food items'
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={handleRefresh}
                        >
                            <Icon name='search' size={18} color='black' />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={handleRefresh}
                        >
                            <Text style={styles.refreshButtonText}>
                                Refresh
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {recommendedItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.foodItem}
                            onPress={() => handleItemSelect(item)}
                        >
                            <Text style={styles.foodName}>{item.name}</Text>
                            <Text>Calories: {item.calories}</Text>
                            <Text>Carbs: {item.carbs}g</Text>
                            <Text>Protein: {item.protein}g</Text>
                            <Text>Fat: {item.fat}g</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    tabContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
    expandedTabContainer: {
        backgroundColor: '#d0d0d0', // Darker background for expanded tab
    },
    tabTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    recommendationsContainer: {
        marginTop: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        backgroundColor: 'white',
    },
    refreshButton: {
        backgroundColor: '#A1C6EA',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    searchButton: {
        backgroundColor: '#A1C6EA',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 30,
        marginRight: 10,
    },
    refreshButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },

    foodItem: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    foodName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default MealTab;
