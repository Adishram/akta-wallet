import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import CurvedLinesGraphic from '../components/CurvedLinesGraphic';
import LoginCard from '../components/LoginCard';
import { useWallet } from '../contexts/WalletContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { connectWallet, isConnecting, isConnected } = useWallet();

  React.useEffect(() => {
    if (isConnected) {
      router.replace('/(tabs)');
    }
  }, [isConnected]);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#0052CC', '#0066FF', '#4DA6FF', '#B3D9FF', '#E8F4FF']}
      locations={[0, 0.15, 0.4, 0.65, 0.85]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <CurvedLinesGraphic style={styles.graphic} />

        <View style={styles.brandingContainer}>
          <Text style={styles.brandName}>Äkta</Text>
          <Text style={styles.brandTagline}>Your Gateway to Web3</Text>
        </View>

        <View style={styles.cardWrapper}>
          <LoginCard onConnectPress={handleConnect} loading={isConnecting} />
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  graphic: {
    top: height * 0.02,
    left: -width * 0.15,
  },
  brandingContainer: {
    position: 'absolute',
    top: height * 0.08,
    width: '100%',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  brandTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 8,
    fontWeight: '500',
  },
  cardWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
