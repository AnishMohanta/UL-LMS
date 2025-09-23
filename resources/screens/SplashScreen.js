import { View, Text, TouchableOpacity, StyleSheet,Dimensions } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
const { width } = Dimensions.get('window');
const SplashScreen = ({ navigation }) => {
    return (
      <LinearGradient
            colors={['#E0F7FA', '#6200EE']} // light sky to dark blue gradient
            style={styles.container}
        >
                 {/* Middle Section: App Name */}
                <View style={styles.middleSection}>
                    <Text style={styles.appName}>UL LMS</Text>
                </View>
             {/* Rounded capsule button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate("Login")}
                    activeOpacity={0.8}
                >
                    <Text style={styles.loginButtonText}>Go to Login</Text>
                </TouchableOpacity>
            <View style={styles.btnGroup}>
                <Text style={styles.subHeading1}
                    allowFontScaling={true}
                >Do not have an account?</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("ProfileCreation")} >
                    <Text style={styles.subHeading2}> Register Now</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', // push content to the bottom
        alignItems: 'center',       // center horizontally
        paddingBottom: 30,          // add some spacing from the bottom
        backgroundColor: "white ",

    },
   middleSection: {
        position: 'absolute',
        top: '40%', // roughly middle of the screen
        alignItems: 'center',
    },
    appName: {
        fontSize: width * 0.12, // responsive font size
        fontWeight: 'bold',
        color: 'black',
    },
  loginButton: {
    backgroundColor: '#6200EE', // prominent color
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 50, // capsule shape
    marginBottom: 20, // space between button and registration text

    // Android elevation
    elevation: 5,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
},
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnGroup: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    subHeading1: {
        fontSize: 13,
        color: "white",
    },
    subHeading2: {
        fontSize: 13,
        color: "white",
    },
})