export const Harris_Benedict_BMR = (gender, height, weight, age) => {
    if (gender === 'male') {
        return 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
    } else if (gender === 'female') {
        return 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
    } else {
        return null; // Return null for other gender options
    }
};
