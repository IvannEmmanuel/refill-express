import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import loadFonts from '../LoadFonts/load';

const StartingPage = () => {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                await loadFonts();
                setFontsLoaded(true);
            } catch (error) {
                console.error("Error loading fonts:", error);
            }
        };

        load();
    }, []);

    if (!fontsLoaded) {
        return null; // Render nothing while fonts are loading
    }

    const handlePress = () => {
        navigation.navigate('LoginPage');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../Images/Logo.png')} style={{ alignSelf: 'center', marginVertical: 250, height: 65, width: 300 }}/>
            <TouchableOpacity style={styles.getStarted} onPress={handlePress}>
                <Text style={styles.textStarted}>GET STARTED</Text>
            </TouchableOpacity>
        </View>
    );
};

export default StartingPage;

const styles = StyleSheet.create({
    textStarted: {
        textAlign: 'center',
        fontSize: 21,
        fontFamily: 'Jakarta-Semibold',
    },
    getStarted: {
        justifyContent: 'center',
        alignSelf: 'center',
        bottom: 125,
        borderRadius: 15,
        width: 200,
        height: 70,
        backgroundColor: '#339bfd'
    },
    container: {
        backgroundColor: '#162a40',
        flex: 1,
    },
});
