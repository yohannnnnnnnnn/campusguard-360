import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { THEME } from '../styles/theme';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info } from 'lucide-react-native';

export function Toast() {
  const { activeToast } = useApp();

  if (!activeToast) return null;

  let Icon = Info;
  let borderColor = THEME.colors.primary;
  let bg = THEME.colors.bgCardLight;

  if (activeToast.type === 'success') {
    Icon = CheckCircle2;
    borderColor = THEME.colors.success;
    bg = 'rgba(16, 185, 129, 0.2)';
  } else if (activeToast.type === 'warning') {
    Icon = AlertTriangle;
    borderColor = THEME.colors.warning;
    bg = 'rgba(245, 158, 11, 0.2)';
  } else if (activeToast.type === 'danger' || activeToast.type === 'sos') {
    Icon = AlertOctagon;
    borderColor = THEME.colors.danger;
    bg = 'rgba(239, 68, 68, 0.25)';
  }

  return (
    <View style={[styles.toastContainer, { borderColor, backgroundColor: bg }]}>
      <Icon size={18} color={borderColor} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: borderColor }]}>{activeToast.title}</Text>
        <Text style={styles.message}>{activeToast.message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1.5,
    gap: 10,
    ...THEME.shadows.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    letterSpacing: 0.5,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
});
