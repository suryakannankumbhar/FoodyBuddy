import React, { useState, useEffect } from 'react';
import firebase from './config/firebase';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setInitializing(false);
        });

        return unsubscribe;
    }, []);

    if (initializing) {
        return null; // or render a loading screen
    }

    return <AppNavigator user={user} />;
};

export default App;
