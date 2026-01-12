import React, { useState, useRef, useEffect } from 'react';
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

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 180;

// Mock split payments data
const mockSplits = [
  { id: '1', title: 'Dinner Split', amount: 0.05, members: ['Alice', 'Bob', 'You'], status: 'pending', collected: 0.02 },
  { id: '2', title: 'Movie Night', amount: 0.02, members: ['Charlie', 'You'], status: 'completed', collected: 0.02 },
  { id: '3', title: 'Rent Payment', amount: 0.5, members: ['Dave', 'Eve', 'Frank', 'You'], status: 'pending', collected: 0.25 },
  { id: '4', title: 'Gift Pool', amount: 0.1, members: ['Grace', 'Henry', 'You'], status: 'pending', collected: 0.06 },
];

const cardColors = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
];

interface SplitPayment {
  id: string;
  title: string;
  amount: number;
  members: string[];
  status: 'pending' | 'completed';
  collected: number;
}

function PaymentCard({ split, index, isCenter, onPress }: { 
  split: SplitPayment; 
  index: number; 
  isCenter: boolean;
  onPress: () => void;
}) {
  const colors = cardColors[index % cardColors.length];
  const scale = useRef(new Animated.Value(isCenter ? 1 : 0.85)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isCenter ? 1 : 0.85,
      useNativeDriver: true,
    }).start();
  }, [isCenter]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <LinearGradient colors={colors} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{split.title}</Text>
            <Text style={styles.cardStatus}>{split.status === 'completed' ? '✅' : '⏳'}</Text>
          </View>
          <Text style={styles.cardAmount}>{split.amount} ETH</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardMembers}>👥 {split.members.length} members</Text>
            <Text style={styles.cardProgress}>
              {((split.collected / split.amount) * 100).toFixed(0)}% collected
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(split.collected / split.amount) * 100}%` }]} />
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function PaymentsScreen() {
  const [splits, setSplits] = useState<SplitPayment[]>(mockSplits);
  const [selectedSplit, setSelectedSplit] = useState<SplitPayment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [centerIndex, setCenterIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newMembers, setNewMembers] = useState('');

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + 20));
    setCenterIndex(Math.max(0, Math.min(index, splits.length - 1)));
  };

  const handleAddSplit = () => {
    if (!newTitle || !newAmount) return;
    
    const newSplit: SplitPayment = {
      id: Date.now().toString(),
      title: newTitle,
      amount: parseFloat(newAmount),
      members: ['You', ...newMembers.split(',').map(m => m.trim()).filter(m => m)],
      status: 'pending',
      collected: 0,
    };
    
    setSplits([newSplit, ...splits]);
    setShowAddModal(false);
    setNewTitle('');
    setNewAmount('');
    setNewMembers('');
  };

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Split Payments 💳</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>+ New Split</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {splits.map((split, index) => (
            <PaymentCard
              key={split.id}
              split={split}
              index={index}
              isCenter={index === centerIndex}
              onPress={() => setSelectedSplit(split)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {splits.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === centerIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Card Detail Modal */}
      <Modal visible={!!selectedSplit} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSplit && (
              <>
                <Text style={styles.modalTitle}>{selectedSplit.title}</Text>
                <Text style={styles.modalAmount}>{selectedSplit.amount} ETH</Text>
                
                <View style={styles.membersList}>
                  <Text style={styles.membersTitle}>Members:</Text>
                  {selectedSplit.members.map((member, i) => (
                    <View key={i} style={styles.memberRow}>
                      <Text style={styles.memberName}>👤 {member}</Text>
                      <Text style={styles.memberShare}>
                        {(selectedSplit.amount / selectedSplit.members.length).toFixed(4)} ETH
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.statusSection}>
                  <Text style={styles.statusLabel}>
                    Status: {selectedSplit.status === 'completed' ? '✅ Completed' : '⏳ Pending'}
                  </Text>
                  <Text style={styles.collectedLabel}>
                    Collected: {selectedSplit.collected} / {selectedSplit.amount} ETH
                  </Text>
                </View>

                {selectedSplit.status === 'pending' && (
                  <TouchableOpacity style={styles.collectButton}>
                    <Text style={styles.collectButtonText}>💰 Collect Funds</Text>
                  </TouchableOpacity>
                )}

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
            <Text style={styles.addModalTitle}>New Split Payment</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Payment Title"
              placeholderTextColor="#9CA3AF"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Amount (ETH)"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              value={newAmount}
              onChangeText={setNewAmount}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Friends (comma separated)"
              placeholderTextColor="#9CA3AF"
              value={newMembers}
              onChangeText={setNewMembers}
            />

            <TouchableOpacity style={styles.createButton} onPress={handleAddSplit}>
              <Text style={styles.createButtonText}>Create Split</Text>
            </TouchableOpacity>

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
    backgroundColor: '#0066FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  carouselContainer: { flex: 1, justifyContent: 'center' },
  carousel: { paddingHorizontal: (width - CARD_WIDTH) / 2, alignItems: 'center' },
  card: { width: CARD_WIDTH, height: CARD_HEIGHT, marginHorizontal: 10 },
  cardGradient: { flex: 1, borderRadius: 20, padding: 20, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  cardStatus: { fontSize: 18 },
  cardAmount: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardMembers: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  cardProgress: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginTop: 8 },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 2 },
  pagination: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 100 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#FFFFFF', width: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: width * 0.85 },
  modalTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A2E', textAlign: 'center' },
  modalAmount: { fontSize: 32, fontWeight: '800', color: '#0066FF', textAlign: 'center', marginTop: 8 },
  membersList: { marginTop: 20 },
  membersTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginBottom: 12 },
  memberRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  memberName: { fontSize: 14, color: '#374151' },
  memberShare: { fontSize: 14, color: '#6B7280' },
  statusSection: { marginTop: 20, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12 },
  statusLabel: { fontSize: 14, color: '#374151' },
  collectedLabel: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  collectButton: { backgroundColor: '#10B981', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  collectButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  closeModalBtn: { marginTop: 12, alignItems: 'center' },
  closeModalText: { color: '#6B7280', fontSize: 16 },
  addModalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: width * 0.85 },
  addModalTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 12, color: '#1A1A2E' },
  createButton: { backgroundColor: '#0066FF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  cancelButton: { marginTop: 12, alignItems: 'center' },
  cancelButtonText: { color: '#6B7280', fontSize: 16 },
});
