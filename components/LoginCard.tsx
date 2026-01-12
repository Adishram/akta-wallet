import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useWallet } from '../contexts/WalletContext';

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

  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      
      <Text style={styles.title}>Connect Your Wallet</Text>
      
      <Text style={styles.subtitle}>
        Connect with MetaMask or enter your wallet{'\n'}
        address to view your crypto assets
      </Text>
      
      <TouchableOpacity 
        style={[styles.primaryButton, loading && styles.buttonDisabled]} 
        onPress={onConnectPress}
        disabled={loading}
      >
        <View style={styles.buttonContent}>
          <View style={styles.metamaskIcon}>
            <Text style={styles.metamaskLetter}>M</Text>
          </View>
          <Text style={styles.primaryButtonText}>
            {loading ? 'Connecting...' : 'Connect with MetaMask'}
          </Text>
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
      
      <View style={styles.walletOptions}>
        <View style={styles.walletOption}>
          <View style={[styles.walletIcon, { backgroundColor: '#F6851B20' }]}>
            <Text style={styles.walletInitial}>M</Text>
          </View>
          <Text style={styles.walletName}>MetaMask</Text>
        </View>
        <View style={styles.walletOption}>
          <View style={[styles.walletIcon, { backgroundColor: '#0052FF20' }]}>
            <Text style={styles.walletInitial}>C</Text>
          </View>
          <Text style={styles.walletName}>Coinbase</Text>
        </View>
        <View style={styles.walletOption}>
          <View style={[styles.walletIcon, { backgroundColor: '#3396FF20' }]}>
            <Text style={styles.walletInitial}>T</Text>
          </View>
          <Text style={styles.walletName}>Trust</Text>
        </View>
      </View>
      
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
          </View>
        </View>
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
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  primaryButton: {
    backgroundColor: '#F6851B',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metamaskIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metamaskLetter: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F6851B',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  },
  walletOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 20,
  },
  walletOption: {
    alignItems: 'center',
  },
  walletIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  walletInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  walletName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  termsText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
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
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
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
  },
});

export default LoginCard;
