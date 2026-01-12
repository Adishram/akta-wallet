import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';

interface WalletInfoProps {
  address: string;
  balance: string;
  chainName: string;
  chainId: number;
  onDisconnect: () => void;
  onRefresh: () => void;
}

const WalletInfo: React.FC<WalletInfoProps> = ({
  address,
  balance,
  chainName,
  chainId,
  onDisconnect,
  onRefresh,
}) => {
  const shortenAddress = (addr: string) => {
    if (!addr) return '...';
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`;
  };

  const copyAddress = () => {
    if (address) {
      Clipboard.setString(address);
      Alert.alert('Copied!', 'Wallet address copied to clipboard');
    }
  };

  const getChainColor = (id: number) => {
    const colors: Record<number, string> = {
      1: '#627EEA',
      137: '#8247E5',
      56: '#F3BA2F',
      42161: '#28A0F0',
      10: '#FF0420',
    };
    return colors[id] || '#6B7280';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.networkBadge, { backgroundColor: getChainColor(chainId) + '20' }]}>
        <View style={[styles.networkDot, { backgroundColor: getChainColor(chainId) }]} />
        <Text style={[styles.networkText, { color: getChainColor(chainId) }]}>
          {chainName || 'Unknown Network'}
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <Text style={styles.walletInitial}>Ä</Text>
      </View>

      <TouchableOpacity onPress={copyAddress} style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Wallet Address</Text>
        <Text style={styles.address}>{shortenAddress(address || '')}</Text>
        <Text style={styles.tapToCopy}>Tap to copy</Text>
      </TouchableOpacity>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>{balance || '0'}</Text>
          <Text style={styles.balanceCurrency}>ETH</Text>
        </View>
        <Text style={styles.balanceUsd}>≈ ${(parseFloat(balance || '0') * 2450).toFixed(2)} USD</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>↻</Text>
          </View>
          <Text style={styles.actionText}>Refresh</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>↑</Text>
          </View>
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>↓</Text>
          </View>
          <Text style={styles.actionText}>Receive</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIcon}>⇄</Text>
          </View>
          <Text style={styles.actionText}>Swap</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.disconnectButton} onPress={onDisconnect}>
        <Text style={styles.disconnectText}>Disconnect Wallet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066FF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  walletInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0066FF',
  },
  addressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  addressLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  address: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    fontFamily: 'monospace',
  },
  tapToCopy: {
    fontSize: 12,
    color: '#0066FF',
    marginTop: 4,
  },
  balanceCard: {
    width: '100%',
    backgroundColor: '#0066FF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balanceCurrency: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
  },
  balanceUsd: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  actionText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  disconnectButton: {
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  disconnectText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WalletInfo;
