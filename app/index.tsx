import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import CurvedLinesGraphic from '../components/CurvedLinesGraphic';
import LoginCard from '../components/LoginCard';
import { useWallet } from '../contexts/WalletContext';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const { isConnected, connectWallet, isConnecting } = useWallet();
  const [showLogin, setShowLogin] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (isConnected) {
      router.replace('/(tabs)');
    }
  }, [isConnected]);

  const handleGetStarted = () => {
    setShowLogin(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 10,
    }).start();
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#0052CC', '#0066FF', '#4DA6FF', '#B3D9FF', '#E8F4FF']}
      locations={[0, 0.2, 0.5, 0.75, 1]}
      style={styles.container}
    >
      {/* Brand Name - Top Left */}
      <Text style={styles.brandName}>Äkta</Text>

      {/* Curved Lines Graphic */}
      <CurvedLinesGraphic style={styles.graphic} />

      {/* Tagline - Bottom Left */}
      <View style={styles.taglineContainer}>
        <Text style={styles.taglineMain}>
          Your Secure{'\n'}
          Crypto Wallet
        </Text>
      </View>

      {/* Get Started Button - Only show if login not visible */}
      {!showLogin && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.9}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Animated Login Card */}
      <Animated.View
        style={[
          styles.loginCardWrapper,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LoginCard onConnectPress={handleConnect} loading={isConnecting} />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brandName: {
    position: 'absolute',
    top: 80,
    left: 24,
    fontSize: 72,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  graphic: {
    top: height * 0.15,
    left: -width * 0.1,
  },
  taglineContainer: {
    position: 'absolute',
    bottom: height * 0.18,
    left: 24,
    right: 24,
  },
  taglineMain: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0052CC',
    lineHeight: 44,
    fontFamily: 'Montserrat_700Bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    right: 24,
  },
  getStartedButton: {
    backgroundColor: '#0066FF',
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'Montserrat_700Bold',
  },
  loginCardWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
