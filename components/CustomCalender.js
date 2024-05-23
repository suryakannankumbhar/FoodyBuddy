import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

const CustomCalendar = ({ foodLog, onDateSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(moment());

    const renderDays = () => {
        const daysInMonth = currentMonth.daysInMonth();
        const firstDayOfMonth = moment(currentMonth).startOf('month').day();
        const days = [];

        // Add empty days for the beginning of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<View key={`empty-${i}`} style={styles.day} />);
        }

        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = moment(currentMonth).date(i);
            const hasData = foodLog.some(
                log =>
                    log.timestamp.toDate().toDateString() ===
                    date.toDate().toDateString()
            );

            days.push(
                <TouchableOpacity
                    key={`day-${i}`}
                    style={[styles.day, hasData && styles.dayWithData]}
                    onPress={() => onDateSelect(date)}
                >
                    <Text style={styles.dayText}>{i}</Text>
                </TouchableOpacity>
            );
        }

        return days;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() =>
                        setCurrentMonth(
                            currentMonth.clone().subtract(1, 'months')
                        )
                    }
                >
                    <Text style={styles.headerText}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    {currentMonth.format('MMMM YYYY')}
                </Text>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() =>
                        setCurrentMonth(currentMonth.clone().add(1, 'months'))
                    }
                >
                    <Text style={styles.headerText}>{'>'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.calendar}>{renderDays()}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E2F0F9', // Pastel Blue
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#A1C6EA', // Pastel Blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black', // Black
    },
    calendar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center', // Center the calendar horizontally
        width: '100%',
    },
    day: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
        backgroundColor: '#A1C6EA', // Pastel Blue
        borderRadius: 20,
    },
    dayWithData: {
        backgroundColor: '#87CEFA', // Light Sky Blue
    },
    dayText: {
        color: 'black', // Black
        fontWeight: 'bold',
    },
});

export default CustomCalendar;
