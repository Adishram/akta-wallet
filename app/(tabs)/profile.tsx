import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../../contexts/WalletContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { address, balance, chainName, disconnectWallet } = useWallet();

  const shortenAddress = (addr: string) => {
    if (!addr) return '...';
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await disconnectWallet();
            router.replace('/');
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: '🔔', title: 'Notifications', subtitle: 'Manage alerts' },
    { icon: '🔐', title: 'Security', subtitle: 'Protect your wallet' },
    { icon: '🌐', title: 'Network', subtitle: chainName || 'Ethereum' },
    { icon: '📱', title: 'App Settings', subtitle: 'Preferences' },
    { icon: '❓', title: 'Help & Support', subtitle: 'Get assistance' },
    { icon: '📄', title: 'Terms of Service', subtitle: 'Legal info' },
  ];

  return (
    <LinearGradient colors={['#0066FF', '#4DA6FF', '#E8F4FF', '#FFFFFF']} locations={[0, 0.15, 0.4, 0.6]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile 👤</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.avatar}>
              <Text style={styles.avatarText}>Ä</Text>
            </LinearGradient>
          </View>
          <Text style={styles.walletLabel}>Connected Wallet</Text>
          <Text style={styles.walletAddress}>{shortenAddress(address || '')}</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceValue}>{balance} ETH</Text>
            <View style={styles.chainBadge}>
              <Text style={styles.chainText}>{chainName || 'Ethereum'}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disconnect Button */}
        <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
          <Text style={styles.disconnectText}>🔌 Disconnect Wallet</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>Äkta v1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  avatarContainer: { marginBottom: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#FFFFFF' },
  walletLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  walletAddress: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', fontFamily: 'monospace' },
  balanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 12 },
  balanceValue: { fontSize: 24, fontWeight: '700', color: '#1A1A2E' },
  chainBadge: { backgroundColor: '#0066FF15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  chainText: { fontSize: 12, fontWeight: '600', color: '#0066FF' },
  menuSection: { marginTop: 24, marginHorizontal: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  menuIcon: { fontSize: 24, marginRight: 16 },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  menuSubtitle: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  menuArrow: { fontSize: 24, color: '#9CA3AF' },
  disconnectButton: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  disconnectText: { fontSize: 16, fontWeight: '600', color: '#EF4444' },
  versionText: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 24 },
});
