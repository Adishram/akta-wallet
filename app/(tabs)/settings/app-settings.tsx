import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../../contexts/UserContext';
import { CameraIcon } from '../../../components/Icons';

export default function AppSettingsScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useUser();
  const [name, setName] = useState(profile.name);
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    await updateProfile({ name, profilePicture });
    Alert.alert('Saved', 'Your profile has been updated.');
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Picture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <TouchableOpacity style={styles.avatarPicker} onPress={handlePickImage}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <CameraIcon size={32} color="#9CA3AF" />
                <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <CameraIcon size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.inputHint}>This name will be shown throughout the app</Text>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.preferenceRow}>
            <Text style={styles.preferenceTitle}>Currency</Text>
            <Text style={styles.preferenceValue}>ETH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.preferenceRow}>
            <Text style={styles.preferenceTitle}>Language</Text>
            <Text style={styles.preferenceValue}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.preferenceRow}>
            <Text style={styles.preferenceTitle}>Theme</Text>
            <Text style={styles.preferenceValue}>Light</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  content: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 12, textTransform: 'uppercase' },
  avatarPicker: { alignItems: 'center', position: 'relative' },
  avatarImage: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#0066FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputHint: { fontSize: 12, color: '#9CA3AF', marginTop: 8 },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  preferenceTitle: { fontSize: 16, fontWeight: '500', color: '#1A1A2E' },
  preferenceValue: { fontSize: 16, color: '#9CA3AF' },
  saveButton: {
    backgroundColor: '#0066FF',
    borderRadius: 50,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
