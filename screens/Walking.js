import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
} from 'react-native';

import walking from '../assets/walk.gif';

const WalkingScreen = ({ route, navigation }) => {
    const [walkingData, setWalkingData] = useState(null);
    const { user } = route.params || {};

    const handleFinishWalk = async () => {
        try {
            const response = await fetch(
                'https://api.thingspeak.com/channels/2105556/feeds.json?results=1'
            );
            const data = await response.json();
            const time = data.feeds[0].created_at;
            const steps = data.feeds[0].field1;
            const heartBeat = data.feeds[0].field2;
            const walkingData = { time, steps, heartBeat };
            navigation.navigate('StepTracker', { user, walkingData });
        } catch (error) {
            console.error('Error fetching walking data:', error);
            Alert.alert(
                'Error',
                'Failed to fetch walking data. Please try again.'
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <Image source={walking} style={styles.image} />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleFinishWalk}
                >
                    <Text style={styles.buttonText}>Finish Walk</Text>
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#A1C6EA',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    image: {
        // width: 200,
        // height: 200,
        marginBottom: 20,
    },
});

export default WalkingScreen;
