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
import { KayakIcon, FerryIcon } from './VesselIcons';

// Sleek SVG waves / boat logo for Splash
const LogoVector: React.FC<{ size?: number; color?: string }> = ({ size = 64, color = '#00B4D8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3L2 14H22L12 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M2 17C6 19 18 19 22 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 20C8 21.5 16 21.5 20 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SplashView: React.FC = () => {
  return (
    <View style={styles.splashContainer}>
      <RainEffect />
      <View style={styles.logoWrapper}>
        <LogoVector size={80} />
        <Text style={styles.splashTitle}>DUBAO</Text>
        <Text style={styles.splashTagline}>
          "When Dhaka roads become rivers, ride the vibe."
        </Text>
      </View>
      <View style={styles.splashFooter}>
        <Text style={styles.splashLoadingText}>Synchronizing Waterways</Text>
        <div style={styles.loadingTrack}>
          <div style={styles.loadingBar} />
        </div>
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
      setError('Please enter your name.');
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
          <LogoVector size={48} />
          <Text style={styles.loginTitle}>Welcome to Dubao</Text>
          <Text style={styles.loginSubtitle}>
            Your waterlog transport logistics solution.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Commuter / Captain Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Abul Kalam"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dry Phone Line</Text>
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
            <Text style={styles.loginButtonText}>Connect to Fleet</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimerText}>
            *Please ensure you possess water-resistant footwear prior to requesting vessel transit.
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
        <Text style={styles.roleWelcome}>Welcome, {userName}</Text>
        <Text style={styles.rolePrompt}>Select Vessel Role</Text>

        <TouchableOpacity
          style={[styles.roleOption, styles.rolePassenger]}
          onPress={() => selectRole('passenger')}
        >
          <View style={styles.roleOptionIconWrapper}>
            <KayakIcon color="#ffffff" size={32} />
          </View>
          <View style={styles.roleOptionTextWrapper}>
            <Text style={styles.roleOptionTitle}>Request a Ride (Passenger)</Text>
            <Text style={styles.roleOptionDesc}>
              Bypass road closures and travel via floating launch corridors.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleOption, styles.roleCaptain]}
          onPress={() => selectRole('captain')}
        >
          <View style={styles.roleOptionIconWrapper}>
            <FerryIcon color="#ffffff" size={32} />
          </View>
          <View style={styles.roleOptionTextWrapper}>
            <Text style={styles.roleOptionTitle}>Register Boat (Captain)</Text>
            <Text style={styles.roleOptionDesc}>
              Navigate passengers through flooded districts and log simulated earnings.
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
    backgroundColor: '#0B0F19',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 100,
  },
  splashTitle: {
    color: '#00B4D8',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
    marginTop: 16,
  },
  splashTagline: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  splashFooter: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  splashLoadingText: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loadingTrack: {
    width: '100%',
    height: 3,
    backgroundColor: '#1E293B',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  loadingBar: {
    width: '60%',
    height: '100%',
    backgroundColor: '#00B4D8',
    borderRadius: 1.5,
  },
  loginCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
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
  loginTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  loginSubtitle: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  loginButton: {
    backgroundColor: '#FB8500',
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
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
    backgroundColor: '#0B0F19',
    justifyContent: 'center',
    padding: 24,
  },
  roleCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
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
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rolePrompt: {
    color: '#ffffff',
    fontSize: 22,
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
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  roleCaptain: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  roleOptionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleOptionTextWrapper: {
    flex: 1,
  },
  roleOptionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  roleOptionDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
});
