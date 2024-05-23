import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Platform,
} from 'react-native';
import firebase, { firestore } from '../config/firebase';
import { Picker } from '@react-native-picker/picker';

const UserInfoForm = ({ user, onSubmit, route, initialValues }) => {
    const [height, setHeight] = useState(initialValues?.height || '');
    const [weight, setWeight] = useState(initialValues?.weight || '');
    const [age, setAge] = useState(initialValues?.age || '');
    const [gender, setGender] = useState(initialValues?.gender || '');
    const [mealPreference, setMealPreference] = useState(
        initialValues?.mealPreference || ''
    );

    const isFormComplete = height && weight && age && gender && mealPreference;

    const handleSubmit = () => {
        const userData = {
            height,
            weight,
            age,
            gender,
            mealPreference,
            email: user.email, // Use the email from the user object
        };

        onSubmit(userData);
    };

    const pickerStyle = {
        inputIOS: {
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            color: 'black',
            paddingRight: 30,
        },
        inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 0.5,
            borderColor: 'gray',
            borderRadius: 8,
            color: 'black',
            paddingRight: 30,
        },
    };

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Update Your Information</Text>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
                style={styles.input}
                onChangeText={setHeight}
                value={height}
                keyboardType='numeric'
                placeholder='Enter your height'
                placeholderTextColor='#666'
            />
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
                style={styles.input}
                onChangeText={setWeight}
                value={weight}
                keyboardType='numeric'
                placeholder='Enter your weight'
                placeholderTextColor='#666'
            />
            <Text style={styles.label}>Age</Text>
            <TextInput
                style={styles.input}
                onChangeText={setAge}
                value={age}
                keyboardType='numeric'
                placeholder='Enter your age'
                placeholderTextColor='#666'
            />
            <Text style={styles.label}>Gender</Text>
            {Platform.OS === 'ios' ? (
                <Picker
                    selectedValue={gender || ''}
                    style={[pickerStyle.inputIOS, styles.picker]}
                    onValueChange={itemValue => setGender(itemValue)}
                >
                    <Picker.Item label='Select Gender' value='' />
                    <Picker.Item label='Male' value='male' />
                    <Picker.Item label='Female' value='female' />
                    <Picker.Item label='Other' value='other' />
                </Picker>
            ) : (
                <Picker
                    selectedValue={gender || ''}
                    style={[pickerStyle.inputAndroid, styles.picker]}
                    onValueChange={itemValue => setGender(itemValue)}
                >
                    <Picker.Item label='Select Gender' value='' />
                    <Picker.Item label='Male' value='male' />
                    <Picker.Item label='Female' value='female' />
                    <Picker.Item label='Other' value='other' />
                </Picker>
            )}
            <Text style={styles.label}>Meal Preference</Text>
            {Platform.OS === 'ios' ? (
                <Picker
                    selectedValue={mealPreference || ''}
                    style={[pickerStyle.inputIOS, styles.picker]}
                    onValueChange={itemValue => setMealPreference(itemValue)}
                >
                    <Picker.Item label='Select Meal Preference' value='' />
                    <Picker.Item label='Veg' value='veg' />
                    <Picker.Item label='Non-Veg' value='non-veg' />
                    <Picker.Item label='Vegan' value='vegan' />
                </Picker>
            ) : (
                <Picker
                    selectedValue={mealPreference || ''}
                    style={[pickerStyle.inputAndroid, styles.picker]}
                    onValueChange={itemValue => setMealPreference(itemValue)}
                >
                    <Picker.Item label='Select Meal Preference' value='' />
                    <Picker.Item label='Veg' value='veg' />
                    <Picker.Item label='Non-Veg' value='non-veg' />
                    <Picker.Item label='Vegan' value='vegan' />
                </Picker>
            )}
            <Button
                title='Submit'
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={!isFormComplete}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: '#333', // Dark Gray
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
    },
    picker: {
        width: '100%',
        marginBottom: 20,
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 4,
        paddingVertical: 12,
    },
    message: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black', // Black
        marginBottom: 20,
    },
});

export default UserInfoForm;
