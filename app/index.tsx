import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import CurvedLinesGraphic from '../components/CurvedLinesGraphic';
import { useWallet } from '../contexts/WalletContext';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const { isConnected } = useWallet();

  React.useEffect(() => {
    if (isConnected) {
      router.replace('/(tabs)');
    }
  }, [isConnected]);

  const handleGetStarted = () => {
    router.push('/login');
  };

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

      {/* Get Started Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.9}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brandName: {
    position: 'absolute',
    top: 60,
    left: 24,
    fontSize: 32,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: 1,
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
  },
});
