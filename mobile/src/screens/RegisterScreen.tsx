import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function RegisterScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [role, setRole] = useState<'patient' | 'caretaker'>('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        email,
        password,
        fullName,
        role,
      });
      await login(response.data.user, response.data.token);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoText}>C</Text>
            </View>
            <Text style={styles.title}>CareTaker</Text>
            <Text style={styles.subtitle}>Create Your Account</Text>
          </View>

          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'patient' && styles.roleButtonActive]}
              onPress={() => setRole('patient')}
            >
              <Text style={styles.roleIcon}>❤️</Text>
              <Text style={[styles.roleText, role === 'patient' && styles.roleTextActive]}>
                I Need Care
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'caretaker' && styles.roleButtonActive]}
              onPress={() => setRole('caretaker')}
            >
              <Text style={styles.roleIcon}>👤</Text>
              <Text style={[styles.roleText, role === 'caretaker' && styles.roleTextActive]}>
                I'm a Caretaker
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.link}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#0D9488',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginTop: 4,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#0D9488',
    backgroundColor: '#CCFBF1',
  },
  roleIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  roleTextActive: {
    color: '#0D9488',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1E3A5F',
  },
  button: {
    backgroundColor: '#0D9488',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    color: '#475569',
    marginTop: 16,
  },
  link: {
    color: '#0D9488',
    fontWeight: '600',
  },
});
