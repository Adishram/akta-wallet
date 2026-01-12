import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HelpIcon } from '../../../components/Icons';

export default function HelpScreen() {
  const router = useRouter();

  const faqItems = [
    {
      question: 'How do I connect my wallet?',
      answer: 'Tap "Connect with MetaMask" on the login screen. If you have MetaMask installed, it will open automatically. Otherwise, you can enter your wallet address manually.',
    },
    {
      question: 'How do split payments work?',
      answer: 'Create a new split, add friends with their wallet addresses, and the app will automatically calculate each person\'s share. You can track who has paid and collect funds when everyone is ready.',
    },
    {
      question: 'What is offline payment?',
      answer: 'Offline payments allow you to share payment requests via AirDrop or Bluetooth when you don\'t have internet access. The transaction will sync when you\'re back online.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We never store your private keys. All wallet interactions happen directly through your wallet app (like MetaMask). Your profile data is stored locally on your device.',
    },
    {
      question: 'How do I change my profile name?',
      answer: 'Go to Profile → App Settings and you can update your display name and profile picture there.',
    },
  ];

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@akta.app?subject=Help Request');
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://akta.app');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <TouchableOpacity style={styles.contactRow} onPress={handleEmailSupport}>
            <View style={styles.contactIcon}>
              <Text style={styles.iconText}>✉️</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactDesc}>support@akta.app</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={handleVisitWebsite}>
            <View style={styles.contactIcon}>
              <Text style={styles.iconText}>🌐</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Visit Website</Text>
              <Text style={styles.contactDesc}>akta.app</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <HelpIcon size={48} color="#9CA3AF" />
          <Text style={styles.appInfoText}>Äkta Wallet v1.0.0</Text>
          <Text style={styles.appInfoSubtext}>Built with ❤️ for the crypto community</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { fontSize: 16, color: '#0066FF', marginBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A2E' },
  content: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 12, textTransform: 'uppercase' },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  faqAnswer: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: { fontSize: 20 },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  contactDesc: { fontSize: 13, color: '#0066FF', marginTop: 2 },
  appInfo: { alignItems: 'center', paddingVertical: 32 },
  appInfoText: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginTop: 12 },
  appInfoSubtext: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
});
