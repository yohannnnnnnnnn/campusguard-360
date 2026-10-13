import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../styles/theme';

export function PassStatusBadge({ status, size = 'md' }) {
  let bg = '#1E293B';
  let text = '#CBD5E1';
  let border = '#334155';
  let label = status ? status.replace('_', ' ') : 'UNKNOWN';
  let dotColor = '#94A3B8';

  switch (status) {
    case 'APPROVED':
      bg = 'rgba(16, 185, 129, 0.15)';
      text = '#10B981';
      border = 'rgba(16, 185, 129, 0.4)';
      label = 'APPROVED & ACTIVE';
      dotColor = '#10B981';
      break;
    case 'PENDING_APPROVAL':
      bg = 'rgba(245, 158, 11, 0.15)';
      text = '#F59E0B';
      border = 'rgba(245, 158, 11, 0.4)';
      label = 'PENDING REVIEW';
      dotColor = '#F59E0B';
      break;
    case 'CHECKED_OUT':
      bg = 'rgba(56, 189, 248, 0.15)';
      text = '#38BDF8';
      border = 'rgba(56, 189, 248, 0.4)';
      label = 'OFF-CAMPUS (ACTIVE)';
      dotColor = '#38BDF8';
      break;
    case 'COMPLETED':
      bg = 'rgba(148, 163, 184, 0.12)';
      text = '#CBD5E1';
      border = '#334155';
      label = 'COMPLETED / RETURNED';
      dotColor = '#94A3B8';
      break;
    case 'REJECTED':
      bg = 'rgba(244, 63, 94, 0.15)';
      text = '#F43F5E';
      border = 'rgba(244, 63, 94, 0.4)';
      label = 'REJECTED';
      dotColor = '#F43F5E';
      break;
    case 'EXPIRED':
      bg = 'rgba(244, 63, 94, 0.18)';
      text = '#FB7185';
      border = 'rgba(244, 63, 94, 0.45)';
      label = 'EXPIRED / OVERDUE';
      dotColor = '#FB7185';
      break;
    case 'ON_CAMPUS':
      bg = 'rgba(16, 185, 129, 0.15)';
      text = '#10B981';
      border = 'rgba(16, 185, 129, 0.4)';
      label = 'INSIDE CAMPUS';
      dotColor = '#10B981';
      break;
    case 'OFF_CAMPUS':
      bg = 'rgba(245, 158, 11, 0.15)';
      text = '#F59E0B';
      border = 'rgba(245, 158, 11, 0.4)';
      label = 'OFF-CAMPUS';
      dotColor = '#F59E0B';
      break;
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: border,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 7 : 10,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text
        style={[
          styles.text,
          {
            color: text,
            fontSize: isSmall ? THEME.typography.sizes.xs - 1 : THEME.typography.sizes.xs,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

