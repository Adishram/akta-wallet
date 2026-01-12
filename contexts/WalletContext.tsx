import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Alert, TextInput, Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface WalletContextType {
  address: string | undefined;
  balance: string;
  chainId: number | undefined;
  chainName: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  showAddressModal: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  setShowAddressModal: (show: boolean) => void;
  connectWithAddress: (address: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState<number | undefined>(1);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    const checkSavedSession = async () => {
      const savedAddress = await AsyncStorage.getItem('walletAddress');
      if (savedAddress) {
        setAddress(savedAddress);
        setIsConnected(true);
        fetchBalance(savedAddress);
      }
    };
    checkSavedSession();
  }, []);

  const fetchBalance = async (walletAddress: string) => {
    try {
      const rpcProvider = new ethers.providers.JsonRpcProvider(
        'https://eth.llamarpc.com'
      );
      const balanceWei = await rpcProvider.getBalance(walletAddress);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
      
      const network = await rpcProvider.getNetwork();
      setChainId(network.chainId);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('0');
    }
  };

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    
    // Try to open MetaMask via deep link
    const metamaskDeepLink = 'metamask://';
    const canOpen = await Linking.canOpenURL(metamaskDeepLink);
    
    if (canOpen) {
      Alert.alert(
        'Connect with MetaMask',
        'After connecting in MetaMask, come back and enter your wallet address to view your balance.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setIsConnecting(false) },
          { 
            text: 'Open MetaMask', 
            onPress: async () => {
              await Linking.openURL(metamaskDeepLink);
              setShowAddressModal(true);
              setIsConnecting(false);
            }
          },
          {
            text: 'Enter Address',
            onPress: () => {
              setShowAddressModal(true);
              setIsConnecting(false);
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'MetaMask Not Found',
        'MetaMask app is not installed. You can still view any wallet by entering its address.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setIsConnecting(false) },
          { 
            text: 'Install MetaMask', 
            onPress: () => {
              Linking.openURL('https://metamask.io/download/');
              setIsConnecting(false);
            }
          },
          {
            text: 'Enter Address',
            onPress: () => {
              setShowAddressModal(true);
              setIsConnecting(false);
            }
          }
        ]
      );
    }
  }, []);

  const connectWithAddress = useCallback(async (inputAddress: string) => {
    if (!ethers.utils.isAddress(inputAddress)) {
      Alert.alert('Invalid Address', 'Please enter a valid Ethereum address');
      return;
    }

    setAddress(inputAddress);
    setIsConnected(true);
    setShowAddressModal(false);
    await AsyncStorage.setItem('walletAddress', inputAddress);
    await fetchBalance(inputAddress);
  }, []);

  const disconnectWallet = useCallback(async () => {
    setAddress(undefined);
    setBalance('0');
    setChainId(undefined);
    setIsConnected(false);
    await AsyncStorage.removeItem('walletAddress');
  }, []);

  const refreshBalance = useCallback(async () => {
    if (address) {
      await fetchBalance(address);
    }
  }, [address]);

  const getChainName = (id: number | undefined) => {
    if (!id) return 'Ethereum';
    const names: Record<number, string> = {
      1: 'Ethereum',
      137: 'Polygon',
      56: 'BNB Chain',
      42161: 'Arbitrum',
      10: 'Optimism',
    };
    return names[id] || `Chain ${id}`;
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        chainId,
        chainName: getChainName(chainId),
        isConnected,
        isConnecting,
        showAddressModal,
        connectWallet,
        disconnectWallet,
        refreshBalance,
        setShowAddressModal,
        connectWithAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
