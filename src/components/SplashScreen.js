import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { THEME } from '../styles/theme';
import { ShieldCheck, Sparkles, ArrowRight, Radio } from 'lucide-react-native';
import { playSound } from '../services/soundService';

export function SplashScreen({ onFinish }) {
  const [statusText, setStatusText] = useState('Initializing Cryptographic Security Enclave...');
  const [progressVal, setProgressVal] = useState(0);

  // Animations
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0.95)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const exitScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Pop out the logo with spring bounce
    playSound('approve_chime');
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Fade in content & brand text
    setTimeout(() => {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 400);

    // 3. Subtle pulsing scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, { toValue: 1.06, duration: 1000, useNativeDriver: true }),
        Animated.timing(logoGlow, { toValue: 0.98, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // 4. Step-by-step loading progression
    const t1 = setTimeout(() => {
      setStatusText('Synchronizing Campus Gate Network...');
      setProgressVal(40);
    }, 800);

    const t2 = setTimeout(() => {
      setStatusText('Configuring 2-Minute Dynamic QR Engine...');
      setProgressVal(75);
    }, 1500);

    const t3 = setTimeout(() => {
      setStatusText('Security Perimeter Active • Ready');
      setProgressVal(100);
      playSound('action_click');
    }, 2200);

    // 5. Graceful exit transition after ~2.8s
    const exitTimer = setTimeout(() => {
      handleExit();
    }, 2700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(exitTimer);
    };
  }, []);

  const handleExit = () => {
    Animated.parallel([
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(exitScale, {
        toValue: 1.05,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: exitOpacity,
          transform: [{ scale: exitScale }],
        },
      ]}
    >
      {/* Center Animated Logo Section */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.glowRing,
            {
              transform: [{ scale: logoGlow }],
            },
          ]}
        />
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Brand Title & Subtitle */}
      <Animated.View style={[styles.contentSection, { opacity: contentOpacity }]}>
        <View style={styles.titleBadge}>
          <ShieldCheck size={14} color="#38BDF8" />
          <Text style={styles.titleBadgeText}>SMART CAMPUS ACCESS 360</Text>
        </View>

        <Text style={styles.brandTitle}>CAMPUSGUARD 360</Text>
        <Text style={styles.brandSubtitle}>
          Real-Time Student Safety & Dynamic Gate Pass Ecosystem
        </Text>

        {/* Progress Bar Container */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBarFill, { width: `${progressVal}%` }]} />
        </View>

        {/* Live Status Stream */}
        <View style={styles.statusRow}>
          <Radio size={12} color="#38BDF8" />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        {/* Skip / Enter Button */}
        <TouchableOpacity style={styles.enterButton} onPress={handleExit} activeOpacity={0.85}>
          <Text style={styles.enterButtonText}>ENTER COMMAND CONSOLE</Text>
          <ArrowRight size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#090D16',
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  glowRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 36,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  logoImage: {
    width: 140,
    height: 140,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  contentSection: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 360,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    gap: 6,
  },
  titleBadgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  progressContainer: {
    width: '80%',
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  statusText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 999,
    gap: 8,
    marginTop: 16,
    ...THEME.shadows.glowPrimary,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

