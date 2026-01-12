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
import { SendIcon, CheckIcon, ClockIcon } from '../../components/Icons';

export default function OfflineScreen() {
  const { address } = useWallet();
  const [pendingPayments, setPendingPayments] = useState([
    { id: '1', amount: 0.01, to: 'Nearby Friend', status: 'pending', time: '2 min ago' },
    { id: '2', amount: 0.005, to: 'Coffee Shop', status: 'synced', time: '1 hour ago' },
  ]);

  const generatePaymentTag = () => {
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Offline Payments</Text>
          <Text style={styles.headerSubtitle}>Pay without internet connection</Text>
        </View>

        {/* Send Payment Action */}
        <TouchableOpacity style={styles.actionCard} onPress={handleShareTag}>
          <View style={styles.actionBox}>
            <SendIcon size={32} color="#1A1A2E" />
            <Text style={styles.actionTitle}>Send Payment</Text>
            <Text style={styles.actionDesc}>Share via AirDrop / Bluetooth</Text>
          </View>
        </TouchableOpacity>

        {/* Pending Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Sync</Text>
          {pendingPayments.map((payment) => (
            <View key={payment.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={styles.statusIcon}>
                  {payment.status === 'synced' ? (
                    <CheckIcon size={20} color="#10B981" />
                  ) : (
                    <ClockIcon size={20} color="#F59E0B" />
                  )}
                </View>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  actionCard: { marginHorizontal: 20, marginTop: 8 },
  actionBox: { 
    borderRadius: 20, 
    padding: 24, 
    alignItems: 'center', 
    minHeight: 140, 
    backgroundColor: '#F6F4F0' 
  },
  actionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginTop: 12 },
  actionDesc: { fontSize: 14, color: '#374151', marginTop: 4 },
  section: { marginTop: 32, paddingHorizontal: 20 },
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
  statusIcon: { marginRight: 12 },
  transactionTo: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  transactionTime: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  transactionStatus: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' },
});
