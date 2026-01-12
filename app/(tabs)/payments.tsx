import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlusIcon, UsersIcon, CheckIcon, ClockIcon } from '../../components/Icons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 200;

interface SplitMember {
  name: string;
  walletId: string;
  paid: boolean;
}

interface SplitPayment {
  id: string;
  title: string;
  amount: number;
  members: SplitMember[];
  status: 'pending' | 'completed';
  createdAt: Date;
}

// Mock data - only unsettled splits
const mockSplits: SplitPayment[] = [
  { 
    id: '1', 
    title: 'Dinner Split', 
    amount: 0.05, 
    members: [
      { name: 'Alice', walletId: '0x1234...5678', paid: true },
      { name: 'Bob', walletId: '0xabcd...efgh', paid: false },
      { name: 'You', walletId: '0x9876...5432', paid: true },
    ],
    status: 'pending',
    createdAt: new Date(),
  },
  { 
    id: '2', 
    title: 'Rent Payment', 
    amount: 0.5, 
    members: [
      { name: 'Dave', walletId: '0x1111...2222', paid: true },
      { name: 'Eve', walletId: '0x3333...4444', paid: false },
      { name: 'Frank', walletId: '0x5555...6666', paid: false },
      { name: 'You', walletId: '0x9876...5432', paid: true },
    ],
    status: 'pending',
    createdAt: new Date(),
  },
];

const gradients = [
  ['#667eea', '#764ba2', '#f093fb'],
  ['#4facfe', '#00f2fe', '#43e97b'],
  ['#fa709a', '#fee140', '#fa709a'],
  ['#a18cd1', '#fbc2eb', '#a18cd1'],
];

function SplitCard({ split, index, onPress }: { split: SplitPayment; index: number; onPress: () => void }) {
  const gradient = gradients[index % gradients.length];
  const paidCount = split.members.filter(m => m.paid).length;
  const totalCount = split.members.length;
  const progress = paidCount / totalCount;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.cardContainer}>
      {/* Dark Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{split.title}</Text>
        <Text style={styles.cardSubtitle}>{totalCount} members</Text>
      </View>
      
      {/* Gradient Body */}
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardBody}
      >
        {/* Decorative circles */}
        <View style={styles.decorativeCircles}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardAmount}>{split.amount} ETH</Text>
          <Text style={styles.cardLabel}>Total Amount</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{paidCount}/{totalCount} paid</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function PaymentsScreen() {
  const [splits, setSplits] = useState<SplitPayment[]>(mockSplits);
  const [selectedSplit, setSelectedSplit] = useState<SplitPayment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [step, setStep] = useState(1);
  
  // New split form state
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [friendCount, setFriendCount] = useState('');
  const [friends, setFriends] = useState<{ name: string; walletId: string }[]>([]);

  const handleStartNewSplit = () => {
    setStep(1);
    setNewTitle('');
    setNewAmount('');
    setFriendCount('');
    setFriends([]);
    setShowAddModal(true);
  };

  const handleSetFriendCount = () => {
    const count = parseInt(friendCount);
    if (count > 0 && count <= 10) {
      setFriends(Array(count).fill({ name: '', walletId: '' }));
      setStep(2);
    }
  };

  const updateFriend = (index: number, field: 'name' | 'walletId', value: string) => {
    const updated = [...friends];
    updated[index] = { ...updated[index], [field]: value };
    setFriends(updated);
  };

  const handleCreateSplit = () => {
    if (!newTitle || !newAmount || friends.some(f => !f.name || !f.walletId)) return;
    
    const amount = parseFloat(newAmount);
    const newSplit: SplitPayment = {
      id: Date.now().toString(),
      title: newTitle,
      amount,
      members: [
        ...friends.map(f => ({ ...f, paid: false })),
        { name: 'You', walletId: '0x9876...5432', paid: true },
      ],
      status: 'pending',
      createdAt: new Date(),
    };
    
    setSplits([newSplit, ...splits]);
    setShowAddModal(false);
  };

  const splitPerPerson = (split: SplitPayment) => {
    return (split.amount / split.members.length).toFixed(4);
  };

  // Filter to show only unsettled splits
  const unsettledSplits = splits.filter(s => s.status === 'pending');

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Split Payments</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleStartNewSplit}>
          <PlusIcon size={18} color="#FFFFFF" />
          <Text style={styles.addButtonText}>New Split</Text>
        </TouchableOpacity>
      </View>

      {/* Cards List */}
      <ScrollView 
        style={styles.cardsList}
        contentContainerStyle={styles.cardsListContent}
        showsVerticalScrollIndicator={false}
      >
        {unsettledSplits.length === 0 ? (
          <View style={styles.emptyState}>
            <UsersIcon size={48} color="#6B7280" />
            <Text style={styles.emptyText}>No pending splits</Text>
            <Text style={styles.emptySubtext}>Create a new split to get started</Text>
          </View>
        ) : (
          unsettledSplits.map((split, index) => (
            <SplitCard 
              key={split.id}
              split={split}
              index={index}
              onPress={() => setSelectedSplit(split)}
            />
          ))
        )}
      </ScrollView>

      {/* Split Detail Modal */}
      <Modal visible={!!selectedSplit} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSplit && (
              <>
                <Text style={styles.modalTitle}>{selectedSplit.title}</Text>
                <Text style={styles.modalAmount}>{selectedSplit.amount} ETH</Text>
                <Text style={styles.perPerson}>{splitPerPerson(selectedSplit)} ETH per person</Text>
                
                <View style={styles.membersList}>
                  <Text style={styles.membersTitle}>Members</Text>
                  {selectedSplit.members.map((member, i) => (
                    <View key={i} style={styles.memberRow}>
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberWallet}>{member.walletId}</Text>
                      </View>
                      {member.paid ? (
                        <CheckIcon size={24} color="#10B981" />
                      ) : (
                        <ClockIcon size={24} color="#F59E0B" />
                      )}
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.collectButton}>
                  <Text style={styles.collectButtonText}>Collect Funds</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeModalBtn} onPress={() => setSelectedSplit(null)}>
                  <Text style={styles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Split Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.addModalContent}>
            {step === 1 ? (
              <>
                <Text style={styles.addModalTitle}>New Split Payment</Text>
                
                <Text style={styles.inputLabel}>Payment Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Dinner at Restaurant"
                  placeholderTextColor="#9CA3AF"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
                
                <Text style={styles.inputLabel}>Total Amount (ETH)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={newAmount}
                  onChangeText={setNewAmount}
                />
                
                <Text style={styles.inputLabel}>Number of Friends</Text>
                <TextInput
                  style={styles.input}
                  placeholder="How many friends to split with?"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  value={friendCount}
                  onChangeText={setFriendCount}
                />

                <TouchableOpacity 
                  style={[styles.nextButton, (!newTitle || !newAmount || !friendCount) && styles.buttonDisabled]}
                  onPress={handleSetFriendCount}
                  disabled={!newTitle || !newAmount || !friendCount}
                >
                  <Text style={styles.nextButtonText}>Next: Add Friends</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.addModalTitle}>Add Friends</Text>
                <Text style={styles.splitInfo}>
                  Each person pays: {(parseFloat(newAmount || '0') / (friends.length + 1)).toFixed(4)} ETH
                </Text>
                
                <ScrollView style={styles.friendsScroll}>
                  {friends.map((friend, i) => (
                    <View key={i} style={styles.friendInputGroup}>
                      <Text style={styles.friendLabel}>Friend {i + 1}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor="#9CA3AF"
                        value={friend.name}
                        onChangeText={(v) => updateFriend(i, 'name', v)}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Wallet Address (0x...)"
                        placeholderTextColor="#9CA3AF"
                        value={friend.walletId}
                        onChangeText={(v) => updateFriend(i, 'walletId', v)}
                        autoCapitalize="none"
                      />
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity style={styles.createButton} onPress={handleCreateSplit}>
                  <Text style={styles.createButtonText}>Create Split</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  cardsList: { flex: 1 },
  cardsListContent: { paddingHorizontal: 20, paddingBottom: 100 },
  cardContainer: { marginBottom: 20, borderRadius: 20, overflow: 'hidden' },
  cardHeader: { backgroundColor: '#1A1A2E', padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  cardSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  cardBody: { padding: 20, minHeight: 140 },
  decorativeCircles: { position: 'absolute', top: 16, left: 16 },
  circle: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: 'rgba(255,255,255,0.3)',
    position: 'absolute',
  },
  circle1: { left: 0 },
  circle2: { left: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  cardContent: { marginTop: 20 },
  cardAmount: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  cardLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  progressContainer: { marginTop: 16 },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 2 },
  progressText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: width * 0.9 },
  modalTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A2E', textAlign: 'center' },
  modalAmount: { fontSize: 32, fontWeight: '800', color: '#0066FF', textAlign: 'center', marginTop: 8 },
  perPerson: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 4 },
  membersList: { marginTop: 24 },
  membersTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginBottom: 12 },
  memberRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6',
  },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  memberWallet: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  collectButton: { backgroundColor: '#10B981', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  collectButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  closeModalBtn: { marginTop: 12, alignItems: 'center' },
  closeModalText: { color: '#6B7280', fontSize: 16 },
  addModalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: width * 0.9, maxHeight: height * 0.8 },
  addModalTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', textAlign: 'center', marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    marginBottom: 16,
    color: '#1A1A2E',
  },
  nextButton: { backgroundColor: '#0066FF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.5 },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  splitInfo: { fontSize: 14, color: '#0066FF', textAlign: 'center', marginBottom: 16, fontWeight: '600' },
  friendsScroll: { maxHeight: 300 },
  friendInputGroup: { marginBottom: 16 },
  friendLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  createButton: { backgroundColor: '#10B981', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  cancelButton: { marginTop: 12, alignItems: 'center' },
  cancelButtonText: { color: '#6B7280', fontSize: 16 },
});
