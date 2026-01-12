import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useWallet } from '../contexts/WalletContext';
import WalletInfo from '../components/WalletInfo';

export default function HomeScreen() {
  const router = useRouter();
  const {
    address,
    balance,
    chainName,
    chainId,
    isConnected,
    disconnectWallet,
    refreshBalance,
  } = useWallet();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.replace('/');
    }
  }, [isConnected]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalance();
    setRefreshing(false);
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    router.replace('/');
  };

  if (!isConnected) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#0066FF', '#4DA6FF', '#E8F4FF', '#FFFFFF']}
      locations={[0, 0.15, 0.4, 0.6]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <Text style={styles.headerSubtitle}>Welcome back</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#0066FF"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <WalletInfo
              address={address}
              balance={balance}
              chainName={chainName}
              chainId={chainId}
              onDisconnect={handleDisconnect}
              onRefresh={handleRefresh}
            />
          </View>

          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIconText}>—</Text>
              </View>
              <Text style={styles.emptyText}>No recent transactions</Text>
              <Text style={styles.emptySubtext}>
                Your transaction history will appear here
              </Text>
            </View>
          </View>

          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <View style={styles.quickAction}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#10B98120' }]}>
                  <Text style={[styles.actionIconText, { color: '#10B981' }]}>$</Text>
                </View>
                <Text style={styles.quickActionText}>Buy Crypto</Text>
              </View>
              <View style={styles.quickAction}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#6366F120' }]}>
                  <Text style={[styles.actionIconText, { color: '#6366F1' }]}>↗</Text>
                </View>
                <Text style={styles.quickActionText}>View Charts</Text>
              </View>
              <View style={styles.quickAction}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#F5910020' }]}>
                  <Text style={[styles.actionIconText, { color: '#F59100' }]}>⚡</Text>
                </View>
                <Text style={styles.quickActionText}>Security</Text>
              </View>
              <View style={styles.quickAction}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#6B728020' }]}>
                  <Text style={[styles.actionIconText, { color: '#6B7280' }]}>⚙</Text>
                </View>
                <Text style={styles.quickActionText}>Settings</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  activitySection: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  quickActionsSection: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIconText: {
    fontSize: 20,
    fontWeight: '700',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
