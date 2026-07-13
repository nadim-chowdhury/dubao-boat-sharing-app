import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAppState } from '@/context/AppContext';
import { RainEffect } from './RainEffect';

export const SplashView: React.FC = () => {
  return (
    <View style={styles.splashContainer}>
      <RainEffect />
      <View style={styles.logoWrapper}>
        <Text style={styles.splashLogo}>🚣‍♂️</Text>
        <Text style={styles.splashTitle}>Dubao</Text>
        <Text style={styles.splashTagline}>
          "When Dhaka roads become rivers, ride the vibe."
        </Text>
      </View>
      <View style={styles.splashFooter}>
        <Text style={styles.splashLoadingText}>Inflating Life Jackets...</Text>
        <View style={styles.loadingTrack}>
          <View style={styles.loadingBar} />
        </View>
      </View>
    </View>
  );
};

export const LoginView: React.FC = () => {
  const { login } = useAppState();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!name.trim()) {
      setError('Please enter your name to start rowing!');
      return;
    }
    setError('');
    login(name, phone);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <RainEffect />
        <View style={styles.loginCard}>
          <Text style={styles.loginEmoji}>🌧️</Text>
          <Text style={styles.loginTitle}>Welcome to Dubao</Text>
          <Text style={styles.loginSubtitle}>
            Your ultimate waterlog transport solution.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Passenger / Captain Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Abul Kalam"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number (Dry Line)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 01712345678"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Grab a Paddle 🚣</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimerText}>
            *By joining, you agree that you can swim at least 10 meters or hold a high-quality umbrella.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const RoleSelectionView: React.FC = () => {
  const { selectRole, userName } = useAppState();

  return (
    <View style={styles.roleContainer}>
      <RainEffect />
      <View style={styles.roleCard}>
        <Text style={styles.roleWelcome}>Hello, {userName}!</Text>
        <Text style={styles.rolePrompt}>Select Your Monsoon Status</Text>

        <TouchableOpacity
          style={[styles.roleOption, styles.rolePassenger]}
          onPress={() => selectRole('passenger')}
        >
          <Text style={styles.roleOptionEmoji}>🚣‍♂️</Text>
          <View style={styles.roleOptionTextWrapper}>
            <Text style={styles.roleOptionTitle}>I need a Boat (Passenger)</Text>
            <Text style={styles.roleOptionDesc}>
              Escape waterlogged traffic, dodge floating sandals, and travel in style.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleOption, styles.roleCaptain]}
          onPress={() => selectRole('captain')}
        >
          <Text style={styles.roleOptionEmoji}>👨‍✈️</Text>
          <View style={styles.roleOptionTextWrapper}>
            <Text style={styles.roleOptionTitle}>I have a Boat (Captain)</Text>
            <Text style={styles.roleOptionDesc}>
              Row commuters through flooded alleyways and earn massive imaginary Takas.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012A4A',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#012A4A',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 100,
  },
  splashLogo: {
    fontSize: 72,
    marginBottom: 16,
  },
  splashTitle: {
    color: '#00B4D8',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
  },
  splashTagline: {
    color: '#E2E8F0',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  splashFooter: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  splashLoadingText: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  loadingTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#013A63',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    width: '60%',
    height: '100%',
    backgroundColor: '#FB8500',
    borderRadius: 2,
  },
  loginCard: {
    backgroundColor: 'rgba(1, 42, 74, 0.85)',
    borderWidth: 1,
    borderColor: '#01497C',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  loginEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  loginTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#013A63',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#01497C',
  },
  loginButton: {
    backgroundColor: '#FB8500',
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FB8500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  disclaimerText: {
    color: '#64748B',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 14,
  },
  roleContainer: {
    flex: 1,
    backgroundColor: '#012A4A',
    justifyContent: 'center',
    padding: 24,
  },
  roleCard: {
    backgroundColor: 'rgba(1, 42, 74, 0.85)',
    borderWidth: 1,
    borderColor: '#01497C',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  roleWelcome: {
    color: '#00B4D8',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rolePrompt: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  rolePassenger: {
    backgroundColor: '#013A63',
    borderColor: '#01497C',
  },
  roleCaptain: {
    backgroundColor: '#01497C',
    borderColor: '#0163E8',
  },
  roleOptionEmoji: {
    fontSize: 36,
    marginRight: 16,
  },
  roleOptionTextWrapper: {
    flex: 1,
  },
  roleOptionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleOptionDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
});
