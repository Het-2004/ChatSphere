import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login, verify2Fa } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2FA state
  const [requires2Fa, setRequires2Fa] = useState(false);
  const [userId2Fa, setUserId2Fa] = useState(null);
  const [otpCode, setOtpCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password, 'mock-token-for-mobile');
      if (result && result.requires2fa) {
        setRequires2Fa(true);
        setUserId2Fa(result.userId);
      }
    } catch (e) {
      setError(e.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2Fa = async () => {
    if (!otpCode) {
      setError('Please enter OTP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verify2Fa(userId2Fa, otpCode);
    } catch (e) {
      setError(e.message || 'Verification failed. Please check OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.logoText}>ChatSphere</Text>
            <Text style={styles.subtitleText}>
              {requires2Fa ? 'Two-Factor Authentication' : 'Secure real-time communication'}
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {requires2Fa ? (
            // 2FA Form
            <View style={styles.formContainer}>
              <Text style={styles.label}>Enter the 6-digit OTP code sent to your email:</Text>
              <TextInput
                style={styles.input}
                placeholder="OTP Code"
                placeholderTextColor="#666"
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleVerify2Fa}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => {
                  setRequires2Fa(false);
                  setUserId2Fa(null);
                  setError('');
                }}
              >
                <Text style={styles.linkText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Standard Login Form
            <View style={styles.formContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.footerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0e14', // Deep dark theme
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00f3ff', // Primary neon cyan
    letterSpacing: 1,
  },
  subtitleText: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 8,
  },
  errorText: {
    color: '#ff453a',
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    color: '#e5e5ea',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#151a24',
    borderWidth: 1,
    borderColor: '#222d3d',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066ff', // Premium brand blue
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0066ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#00f3ff',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#8e8e93',
    fontSize: 14,
  },
  footerLink: {
    color: '#00f3ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
