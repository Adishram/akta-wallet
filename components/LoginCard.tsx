import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { useWallet } from '../contexts/WalletContext';
import { MetaMaskIcon, CoreWalletIcon } from './Icons';

interface LoginCardProps {
  onConnectPress: () => void;
  loading?: boolean;
}

const LoginCard: React.FC<LoginCardProps> = ({ onConnectPress, loading = false }) => {
  const { showAddressModal, setShowAddressModal, connectWithAddress } = useWallet();
  const [inputAddress, setInputAddress] = useState('');

  const handleSubmitAddress = () => {
    if (inputAddress.trim()) {
      connectWithAddress(inputAddress.trim());
      setInputAddress('');
    }
  };

  const handleMetaMaskConnect = async () => {
    try {
      // Use the official MetaMask deep link format for iOS
      const metamaskDeepLink = 'metamask://';
      
      const canOpen = await Linking.canOpenURL(metamaskDeepLink);
      console.log('Can open MetaMask:', canOpen);
      
      if (canOpen) {
        // Open MetaMask directly
        await Linking.openURL(metamaskDeepLink);
        
        // After opening MetaMask, prompt user to enter their address
        setTimeout(() => {
          Alert.alert(
            'Connect Wallet',
            'After connecting in MetaMask, copy your wallet address and paste it here.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Enter Address', onPress: () => setShowAddressModal(true) },
            ]
          );
        }, 2000);
      } else {
        // Try alternate deep link formats
        const alternateLinks = [
          'https://metamask.app.link/',
          'wc://',
        ];
        
        let opened = false;
        for (const link of alternateLinks) {
          if (await Linking.canOpenURL(link)) {
            await Linking.openURL(link);
            opened = true;
            break;
          }
        }
        
        if (!opened) {
          // MetaMask not installed
          Alert.alert(
            'MetaMask Not Found',
            'MetaMask wallet app is not detected. Would you like to install it or enter your address manually?',
            [
              { 
                text: 'Install MetaMask', 
                onPress: () => Linking.openURL('https://metamask.io/download/') 
              },
              { text: 'Enter Address', onPress: () => setShowAddressModal(true) },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        } else {
          setTimeout(() => {
            Alert.alert(
              'Connect Wallet',
              'Copy your wallet address from MetaMask and paste it here.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Enter Address', onPress: () => setShowAddressModal(true) },
              ]
            );
          }, 2000);
        }
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      Alert.alert('Error', 'Failed to open MetaMask. Please enter your address manually.');
      setShowAddressModal(true);
    }
  };

  const handleCoreWalletConnect = async () => {
    try {
      // Try to open Core Wallet deep link
      const coreUrl = 'core://';
      const canOpen = await Linking.canOpenURL(coreUrl);
      
      if (canOpen) {
        await Linking.openURL(coreUrl);
        
        // After opening Core, prompt user to enter their address
        setTimeout(() => {
          Alert.alert(
            'Connect Wallet',
            'After connecting in Core Wallet, paste your wallet address here.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Enter Address', onPress: () => setShowAddressModal(true) },
            ]
          );
        }, 1000);
      } else {
        // Core Wallet not installed
        Alert.alert(
          'Core Wallet Not Found',
          'Core Wallet is not installed on this device. Would you like to install it or enter your address manually?',
          [
            { 
              text: 'Install Core', 
              onPress: () => Linking.openURL('https://core.app/') 
            },
            { text: 'Enter Address', onPress: () => setShowAddressModal(true) },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }
    } catch (error) {
      console.error('Core Wallet connection error:', error);
      setShowAddressModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      
      <Text style={styles.title}>Connect Your Wallet</Text>
      
      <Text style={styles.subtitle}>
        Connect with MetaMask or Core Wallet{'\n'}
        to view your crypto assets
      </Text>
      
      {/* MetaMask Button */}
      <TouchableOpacity 
        style={[styles.primaryButton, loading && styles.buttonDisabled]} 
        onPress={handleMetaMaskConnect}
        disabled={loading}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconWrapper}>
            <MetaMaskIcon size={28} />
          </View>
          <Text style={styles.primaryButtonText}>
            {loading ? 'Connecting...' : 'Connect with MetaMask'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Core Wallet Button - Black */}
      <TouchableOpacity 
        style={styles.coreWalletButton} 
        onPress={handleCoreWalletConnect}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconWrapper}>
            <CoreWalletIcon size={28} />
          </View>
          <Text style={styles.coreButtonText}>Connect with Core Wallet</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>
      
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={() => setShowAddressModal(true)}
      >
        <Text style={styles.secondaryButtonText}>Enter Wallet Address</Text>
      </TouchableOpacity>
      
      <Text style={styles.termsText}>
        By connecting, you agree to our{' '}
        <Text style={styles.linkText}>Terms of Service</Text>
      </Text>

      {/* Address Input Modal */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <ScrollView 
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalScrollContent}
            >
              <Text style={styles.modalTitle}>Enter Wallet Address</Text>
              <Text style={styles.modalSubtitle}>
                Paste your Ethereum wallet address to view your balance
              </Text>
              <TextInput
                style={styles.addressInput}
                placeholder="0x..."
                placeholderTextColor="#9CA3AF"
                value={inputAddress}
                onChangeText={setInputAddress}
                autoCapitalize="none"
                autoCorrect={false}
                multiline={false}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowAddressModal(false);
                    setInputAddress('');
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmButton}
                  onPress={handleSubmitAddress}
                >
                  <Text style={styles.modalConfirmText}>Connect</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Montserrat_700Bold',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    fontFamily: 'Montserrat_400Regular',
  },
  primaryButton: {
    backgroundColor: '#F6851B',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  coreWalletButton: {
    backgroundColor: '#1A1A2E',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
  },
  coreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#0066FF',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0066FF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
  },
  termsText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
    fontFamily: 'Montserrat_400Regular',
  },
  linkText: {
    color: '#0066FF',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalScrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Montserrat_700Bold',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Montserrat_400Regular',
  },
  addressInput: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A2E',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
  },
});

export default LoginCard;
