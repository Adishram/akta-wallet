import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { useWallet } from '../../contexts/WalletContext';

export default function OfflineScreen() {
  const { address, balance } = useWallet();
  const [pendingPayments, setPendingPayments] = useState([
    { id: '1', amount: 0.01, to: 'Nearby Friend', status: 'pending', time: '2 min ago' },
    { id: '2', amount: 0.005, to: 'Coffee Shop', status: 'synced', time: '1 hour ago' },
  ]);

  const generatePaymentTag = () => {
    // Generate a unique secure payment tag
    const tag = {
      address,
      amount: 0,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(7),
    };
    return JSON.stringify(tag);
  };

  const handleShareTag = async () => {
    try {
      const tag = generatePaymentTag();
      
      if (await Sharing.isAvailableAsync()) {
        Alert.alert(
          'Share Payment Tag',
          'Choose how to share your secure payment tag:',
          [
            {
              text: 'AirDrop / Bluetooth',
              onPress: async () => {
                await Share.share({
                  message: `Äkta Payment Tag: ${tag}`,
                  title: 'Äkta Secure Payment',
                });
              },
            },
            {
              text: 'Show QR Code',
              onPress: () => {
                Alert.alert('QR Code', 'QR code generation coming soon!');
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        await Share.share({
          message: `Äkta Payment Tag: ${tag}`,
          title: 'Äkta Secure Payment',
        });
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleReceiveOffline = () => {
    Alert.alert(
      'Receive Offline Payment',
      'Ready to receive payment via AirDrop or Bluetooth',
      [
        { text: 'Start Receiving', onPress: () => console.log('Receiving...') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Offline Payments 📴</Text>
          <Text style={styles.headerSubtitle}>Pay without internet connection</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={handleShareTag}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionTitle}>Send Payment</Text>
              <Text style={styles.actionDesc}>Share via AirDrop/Bluetooth</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleReceiveOffline}>
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.actionIcon}>📥</Text>
              <Text style={styles.actionTitle}>Receive Payment</Text>
              <Text style={styles.actionDesc}>Accept offline transfers</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Pending Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Sync</Text>
          {pendingPayments.map((payment) => (
            <View key={payment.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionIcon}>
                  {payment.status === 'synced' ? '✅' : '⏳'}
                </Text>
                <View>
                  <Text style={styles.transactionTo}>{payment.to}</Text>
                  <Text style={styles.transactionTime}>{payment.time}</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>{payment.amount} ETH</Text>
                <Text style={styles.transactionStatus}>{payment.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works 🔐</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>1</Text>
            <Text style={styles.infoText}>Generate a secure payment tag</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>2</Text>
            <Text style={styles.infoText}>Share via AirDrop or Bluetooth</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>3</Text>
            <Text style={styles.infoText}>Transaction syncs when online</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  actionsContainer: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  actionCard: { flex: 1 },
  actionGradient: { borderRadius: 20, padding: 20, alignItems: 'center', minHeight: 140 },
  actionIcon: { fontSize: 32, marginBottom: 8 },
  actionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  actionDesc: { fontSize: 12, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
  transactionCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionLeft: { flexDirection: 'row', alignItems: 'center' },
  transactionIcon: { fontSize: 24, marginRight: 12 },
  transactionTo: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  transactionTime: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  transactionStatus: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' },
  infoSection: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
  },
  infoTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0066FF',
    textAlign: 'center',
    lineHeight: 28,
    color: '#FFFFFF',
    fontWeight: '700',
    marginRight: 12,
  },
  infoText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', flex: 1 },
});
