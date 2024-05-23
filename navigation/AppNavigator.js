import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import FoodTrackerScreen from '../screens/FoodTrackerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FoodTrackingHistoryScreen from '../screens/FoodTrackingHistoryScreen';
import StepTrackerScreen from '../screens/StepTrackerScreen';
import UserInfoForm from '../components/UserInfoForm';
import EditProfileScreen from '../screens/EditProfileScreen';
import TitleBar from '../components/TitleBar';
import Walking from '../screens/Walking';

const Stack = createStackNavigator();

const AppNavigator = ({ user }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        <Stack.Screen
                            name='Home'
                            component={HomeScreen}
                            initialParams={{ user }}
                        />
                        <Stack.Screen
                            name='FoodTracker'
                            component={FoodTrackerScreen}
                        />
                        <Stack.Screen
                            name='Profile'
                            component={ProfileScreen}
                        />
                        <Stack.Screen
                            name='FoodTrackingHistory'
                            component={FoodTrackingHistoryScreen}
                        />
                        <Stack.Screen
                            name='StepTracker'
                            component={StepTrackerScreen}
                        />
                        <Stack.Screen
                            name='EditProfileScreen'
                            component={EditProfileScreen}
                        />
                        <Stack.Screen name='TitleBar' component={TitleBar} />
                        <Stack.Screen name='Walking' component={Walking} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name='Login' component={LoginScreen} />
                        <Stack.Screen
                            name='Register'
                            component={RegisterScreen}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
