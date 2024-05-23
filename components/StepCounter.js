// StepCounter.js
import { NativeModules } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { useEffect, useState } from 'react';
import * as Sensors from 'expo-sensors';

const useStepCounter = () => {
    const [stepCount, setStepCount] = useState(0);
    const [lastPeak, setLastPeak] = useState(0);
    const [peakThreshold, setPeakThreshold] = useState(0.3);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const bleManager = new BleManager();
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const startStepTracking = async () => {
            try {
                // Request Bluetooth permissions
                await bleManager.requestDevice();
                await bleManager.requestMultiplePermissions(['location']);

                // Scan for the ESP32 device
                await connectToESP32();
                startAccelerometerUpdates();
            } catch (error) {
                console.error('Error starting step counter:', error);
            }
        };

        startStepTracking();

        return () => {
            stopAccelerometerUpdates();
        };
    }, []);

    const connectToESP32 = async () => {
        try {
            const { devices } = await bleManager.startDeviceScan(
                null,
                null,
                (error, device) => {
                    if (error) {
                        console.error('Error scanning for devices:', error);
                        return;
                    }

                    // Check if the scanned device is the ESP32
                    if (device.name === 'ESP32') {
                        bleManager.stopDeviceScan();
                        connectToDevice(device);
                    }
                }
            );
        } catch (error) {
            console.error('Error connecting to ESP32:', error);
        }
    };

    const connectToDevice = async device => {
        try {
            // Connect to the ESP32 device
            setConnectedDevice(await device.connect());

            // Discover all the available services and characteristics
            await connectedDevice.discoverAllServicesAndCharacteristics();

            // You can now interact with the discovered services and characteristics
            // to communicate with the ESP32 board
            console.log('Connected to ESP32:', connectedDevice);
        } catch (error) {
            console.error('Error connecting to device:', error);
        }
    };

    const startAccelerometerUpdates = () => {
        // Start receiving accelerometer updates
        setSubscription(
            Sensors.accelerometerUpdatesAsync(
                data => {
                    updateStepCount(data.x, data.y, data.z);
                },
                {
                    interval: 100, // Update interval in milliseconds
                }
            )
        );
    };

    const stopAccelerometerUpdates = () => {
        if (subscription) {
            subscription.remove();
            setSubscription(null);
        }
    };

    const updateStepCount = (x, y, z) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        if (magnitude > lastPeak + peakThreshold) {
            setStepCount(stepCount + 1);
            setLastPeak(magnitude);
        }
    };

    return [stepCount, connectedDevice];
};

export default useStepCounter;
