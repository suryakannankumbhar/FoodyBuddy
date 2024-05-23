import firebase from './firebase';
import 'firebase/auth';
import { firestore } from './firebase';

export const createUserWithEmailAndPassword = async (email, password, name) => {
    try {
        const userCredential = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password);

        if (!userCredential || !userCredential.user) {
            console.error('Registration failed, no user object returned');
            throw new Error('Registration failed, no user object returned');
        }

        const user = userCredential.user;
        console.log('User created:', user);

        await user.updateProfile({
            displayName: name,
        });

        const userDocRef = await firestore
            .collection('users')
            .doc(user.uid)
            .set({
                name,
                email,
            });

        return { user, userDocRef };
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const signInWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
