import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: January 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.bodyText}>
            By accessing and using the Äkta wallet application ("App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.bodyText}>
            Äkta provides a cryptocurrency wallet interface that allows users to:
          </Text>
          <Text style={styles.bulletPoint}>• View wallet balances</Text>
          <Text style={styles.bulletPoint}>• Create and manage split payments</Text>
          <Text style={styles.bulletPoint}>• Share payment requests via QR codes and offline methods</Text>
          <Text style={styles.bulletPoint}>• Connect to external wallets like MetaMask</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
          <Text style={styles.bodyText}>
            You are responsible for maintaining the security of your wallet and private keys. Äkta does not store your private keys and cannot recover them if lost.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Privacy</Text>
          <Text style={styles.bodyText}>
            We respect your privacy. Profile data (name and picture) is stored locally on your device. Wallet addresses are used only for transaction purposes. We do not share your data with third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Risks</Text>
          <Text style={styles.bodyText}>
            Cryptocurrency transactions are irreversible. By using this App, you acknowledge the inherent risks of cryptocurrency including price volatility, technical issues, and potential loss of funds.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
          <Text style={styles.bodyText}>
            Äkta is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of this App, including but not limited to loss of cryptocurrency.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Modifications</Text>
          <Text style={styles.bodyText}>
            We reserve the right to modify these terms at any time. Continued use of the App after changes constitutes acceptance of the new terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Contact</Text>
          <Text style={styles.bodyText}>
            For questions about these Terms, please contact us at legal@akta.app.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Äkta. All rights reserved.</Text>
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
  lastUpdated: { fontSize: 12, color: '#9CA3AF', marginBottom: 24 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  bodyText: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  bulletPoint: { fontSize: 14, color: '#6B7280', lineHeight: 22, marginLeft: 12 },
  footer: { alignItems: 'center', paddingVertical: 32 },
  footerText: { fontSize: 12, color: '#9CA3AF' },
});
