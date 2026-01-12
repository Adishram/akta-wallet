import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useWallet } from '../contexts/WalletContext';

export default function SignupScreen() {
  const router = useRouter();
  const { connectWallet, isConnecting, isConnected } = useWallet();
  const [username, setUsername] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  React.useEffect(() => {
    if (isConnected) {
      router.replace('/(tabs)');
    }
  }, [isConnected]);

  const handleCreateAccount = async () => {
    if (!username.trim()) {
      return;
    }
    await connectWallet();
  };

  return (
    <LinearGradient
      colors={['#0052CC', '#0066FF', '#4DA6FF', '#B3D9FF', '#E8F4FF']}
      locations={[0, 0.15, 0.4, 0.65, 0.85]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create Account 🚀</Text>
            <Text style={styles.subtitle}>Join Äkta and start managing crypto</Text>
          </View>

          {/* Signup Card */}
          <View style={styles.card}>
            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username 👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* Features */}
            <View style={styles.features}>
              <Text style={styles.featuresTitle}>What you'll get:</Text>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💳</Text>
                <Text style={styles.featureText}>Split payments with friends</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📴</Text>
                <Text style={styles.featureText}>Offline payment capabilities</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📷</Text>
                <Text style={styles.featureText}>QR code payments</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🔐</Text>
                <Text style={styles.featureText}>Secure blockchain transactions</Text>
              </View>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity 
              style={styles.termsRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the Terms of Service and Privacy Policy
              </Text>
            </TouchableOpacity>

            {/* Create Button */}
            <TouchableOpacity 
              style={[styles.createButton, (!username || !agreedToTerms) && styles.buttonDisabled]}
              onPress={handleCreateAccount}
              disabled={!username || !agreedToTerms || isConnecting}
            >
              <Text style={styles.createButtonText}>
                {isConnecting ? 'Connecting...' : 'Connect Wallet & Create Account 🦊'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>
                Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  backBtn: { marginBottom: 20 },
  backText: { color: '#FFFFFF', fontSize: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 40,
  },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A2E',
  },
  features: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  featuresTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureIcon: { fontSize: 20, marginRight: 12 },
  featureText: { fontSize: 14, color: '#374151' },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#0066FF', borderColor: '#0066FF' },
  checkmark: { color: '#FFFFFF', fontWeight: '700' },
  termsText: { flex: 1, fontSize: 13, color: '#6B7280' },
  createButton: {
    backgroundColor: '#0066FF',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.5 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  loginLink: { textAlign: 'center', fontSize: 14, color: '#6B7280' },
  loginLinkBold: { color: '#0066FF', fontWeight: '600' },
});
