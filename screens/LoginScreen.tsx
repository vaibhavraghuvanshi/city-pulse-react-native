import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';

// Dynamically import LocalAuthentication for native platforms
let LocalAuthentication: typeof import('expo-local-authentication');
if (Platform.OS !== 'web') {
  LocalAuthentication = require('expo-local-authentication');
} else {
  LocalAuthentication = {
    hasHardwareAsync: async () => false,
    isEnrolledAsync: async () => false,
    authenticateAsync: async () => ({ success: false }),
  } as any;
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);

  const navigation = useNavigation();
  const { login, register, loginWithBiometrics } = useAuth();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    // Check for biometric support
    (async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);
        if (compatible) {
          const enrolled = await LocalAuthentication.isEnrolledAsync();
          setIsBiometricEnrolled(enrolled);
        }
      } catch (error) {
        console.error('Error checking biometric support:', error);
      }
    })();
  }, []);

  const handleAuthentication = async () => {
    try {
      if (isRegistering) {
        await register(email, password);
        Alert.alert('Success', 'Account created successfully!');
        setIsRegistering(false);
      } else {
        await login(email, password);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Error', message);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await loginWithBiometrics();
      if (result) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Error', message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.logo, { color: colors.primary }]}>{t('appName')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('tagline')}</Text>
          </View>

          <View style={[styles.form, { backgroundColor: colors.card }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>
              {isRegistering ? t('createAccount') : t('welcomeBack')}
            </Text>

            <View style={[styles.inputContainer, { borderBottomColor: colors.border }]}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={t('email')}
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
              />
            </View>

            <View style={[styles.inputContainer, { borderBottomColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={t('password')}
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[
                styles.authButton,
                { backgroundColor: colors.primary, opacity: email && password ? 1 : 0.5 },
              ]}
              onPress={handleAuthentication}
              disabled={!email || !password}
            >
              <Text style={styles.authButtonText}>
                {isRegistering ? t('signup') : t('login')}
              </Text>
            </TouchableOpacity>

            {isBiometricSupported && isBiometricEnrolled && !isRegistering && (
              <TouchableOpacity
                style={[styles.biometricButton, { backgroundColor: colors.secondary }]}
                onPress={handleBiometricAuth}
              >
                <Ionicons name="finger-print-outline" size={24} color="#fff" />
                <Text style={styles.biometricButtonText}>{t('loginWithBiometrics')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.switchModeButton} onPress={() => setIsRegistering(!isRegistering)}>
              <Text style={[styles.switchModeText, { color: colors.primary }]}>
                {isRegistering ? t('alreadyHaveAccount') : t('newUser')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.illustrationContainer}>
            <Image
              source={{
                uri: isDark
                  ? 'https://api.a0.dev/assets/image?text=City%20Pulse%20Events&aspect=16:9&seed=dark'
                  : 'https://api.a0.dev/assets/image?text=City%20Pulse%20Events&aspect=16:9&seed=light',
              }}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  authButton: {
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricButton: {
    flexDirection: 'row',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  biometricButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  switchModeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: 14,
  },
  illustrationContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
});
