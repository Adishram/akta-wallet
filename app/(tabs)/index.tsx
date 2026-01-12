import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useWallet } from '../../contexts/WalletContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { address, balance, chainName, isConnected, refreshBalance } = useWallet();
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!isConnected) {
      router.replace('/login');
    }
  }, [isConnected]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalance();
    setRefreshing(false);
  };

  const handleScan = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setShowScanner(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowScanner(false);
    // Handle payment request from QR
    console.log('Scanned payment request:', data);
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return '...';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) return null;

  return (
    <LinearGradient
      colors={['#0066FF', '#4DA6FF', '#E8F4FF', '#FFFFFF']}
      locations={[0, 0.15, 0.4, 0.6]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFFFFF" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back! 👋</Text>
          <Text style={styles.appName}>Äkta</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{balance} ETH</Text>
          <Text style={styles.chainBadge}>{chainName || 'Ethereum'}</Text>
          <Text style={styles.addressText}>{shortenAddress(address || '')}</Text>
        </View>

        {/* QR Scanner Button */}
        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <Text style={styles.scanIcon}>📷</Text>
          <Text style={styles.scanText}>Scan Payment Request</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💸</Text>
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>📥</Text>
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionText}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No recent transactions</Text>
          </View>
        </View>
      </ScrollView>

      {/* QR Scanner Modal */}
      <Modal visible={showScanner} animationType="slide">
        <View style={styles.scannerContainer}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={handleBarCodeScanned}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanInstructions}>Scan payment QR code</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowScanner(false)}>
            <Text style={styles.closeBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  greeting: { fontSize: 16, color: 'rgba(255,255,255,0.9)' },
  appName: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  balanceCard: {
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
  balanceLabel: { fontSize: 14, color: '#6B7280' },
  balanceAmount: { fontSize: 36, fontWeight: '700', color: '#1A1A2E', marginTop: 8 },
  chainBadge: {
    fontSize: 12,
    color: '#0066FF',
    backgroundColor: '#0066FF15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  addressText: { fontSize: 14, color: '#9CA3AF', marginTop: 8, fontFamily: 'monospace' },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#0066FF',
    borderRadius: 16,
    padding: 18,
  },
  scanIcon: { fontSize: 24, marginRight: 10 },
  scanText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  actionBtn: { alignItems: 'center' },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  emptyState: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#9CA3AF' },
  scannerContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#0066FF',
    borderRadius: 24,
  },
  scanInstructions: { color: '#FFFFFF', fontSize: 16, marginTop: 20 },
  closeBtn: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  closeBtnText: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
});
