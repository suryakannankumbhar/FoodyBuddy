import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';

const NavigationBar = ({ navigation }) => {
    const handleNavigation = screen => {
        navigation.navigate(screen);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => handleNavigation('Home')}
            >
                <Icon name='home' size={24} color='black' />
                <Text style={styles.navButtonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => handleNavigation('Profile')}
            >
                <Icon name='person' size={24} color='black' />
                <Text style={styles.navButtonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => handleNavigation('FoodTrackingHistory')}
            >
                <Icon name='history' size={24} color='black' />
                <Text style={styles.navButtonText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => handleNavigation('StepTracker')}
            >
                <Icon name='directions-walk' size={24} color='black' />
                <Text style={styles.navButtonText}>Steps</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#A1C6EA',
        padding: 10,
        width: '100%',
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

export default NavigationBar;
