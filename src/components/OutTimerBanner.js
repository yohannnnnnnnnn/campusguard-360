import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { THEME } from '../styles/theme';
import { Clock, AlertTriangle, CheckCircle, MapPin, Compass } from 'lucide-react-native';

export function OutTimerBanner({ student, activePass }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!student) return null;

  const isOffCampus = student.status === 'OFF_CAMPUS';

  // Calculate elapsed time since checkout
  let elapsedStr = '00h : 00m : 00s';
  let curfewStr = 'Curfew: 09:30 PM';
  let isOverdue = false;

  if (isOffCampus) {
    const exitTimeMs = activePass?.exitGateTime
      ? new Date(activePass.exitGateTime).getTime()
      : Date.now() - 3600000 * 2.5; // fallback 2.5 hours ago for demo

    const elapsedSeconds = Math.max(0, Math.floor((now - exitTimeMs) / 1000));
    const hours = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = elapsedSeconds % 60;

    elapsedStr = `${String(hours).padStart(2, '0')}h : ${String(mins).padStart(2, '0')}m : ${String(secs).padStart(2, '0')}s`;

    if (activePass?.validUntil) {
      const curfewMs = new Date(activePass.validUntil).getTime();
      const diffSecs = Math.floor((curfewMs - now) / 1000);

      if (diffSecs < 0) {
        isOverdue = true;
        const overdueMins = Math.abs(Math.floor(diffSecs / 60));
        curfewStr = `⚠️ OVERDUE BY ${overdueMins} MINS (FLAGGED)`;
      } else {
        const remH = Math.floor(diffSecs / 3600);
        const remM = Math.floor((diffSecs % 3600) / 60);
        const remS = diffSecs % 60;
        curfewStr = `${String(remH).padStart(2, '0')}h : ${String(remM).padStart(2, '0')}m : ${String(remS).padStart(2, '0')}s remaining`;
      }
    }
  }

  return (
    <View
      style={[
        styles.container,
        isOffCampus
          ? isOverdue
            ? styles.containerOverdue
            : styles.containerOffCampus
          : styles.containerOnCampus,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.statusBadge}>
          {isOffCampus ? (
            isOverdue ? (
              <AlertTriangle size={14} color="#F43F5E" />
            ) : (
              <Compass size={14} color="#F59E0B" />
            )
          ) : (
            <CheckCircle size={14} color="#10B981" />
          )}
          <Text
            style={[
              styles.statusTitle,
              {
                color: isOffCampus
                  ? isOverdue
                    ? '#F43F5E'
                    : '#F59E0B'
                  : '#10B981',
              },
            ]}
          >
            {isOffCampus
              ? isOverdue
                ? 'OVERDUE OFF-CAMPUS STAY'
                : 'CURRENTLY OFF-CAMPUS (ACTIVE PASS)'
              : 'INSIDE CAMPUS GROUNDS (CHECKED IN)'}
          </Text>
        </View>

        {isOffCampus && (
          <View style={styles.pulseDot}>
            <View
              style={[
                styles.innerDot,
                { backgroundColor: isOverdue ? '#F43F5E' : '#F59E0B' },
              ]}
            />
          </View>
        )}
      </View>

      {isOffCampus ? (
        <View style={styles.timerGrid}>
          <View style={styles.timerBox}>
            <Text style={styles.timerLabel}>OUT OF CAMPUS DURATION</Text>
            <Text style={styles.timerValue}>{elapsedStr}</Text>
          </View>

          <View style={styles.timerBox}>
            <Text style={styles.timerLabel}>CURFEW DEADLINE</Text>
            <Text
              style={[
                styles.curfewValue,
                isOverdue && { color: '#F43F5E', fontWeight: '800' },
              ]}
            >
              {curfewStr}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.onCampusInfoRow}>
          <MapPin size={13} color="#94A3B8" />
          <Text style={styles.onCampusInfoText}>
            Last verified at {student.lastLocation || 'Main Campus Checkpoint'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    gap: 10,
    ...THEME.shadows.md,
  },
  containerOnCampus: {
    backgroundColor: '#0F1E19',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  containerOffCampus: {
    backgroundColor: '#1E1B0E',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  containerOverdue: {
    backgroundColor: '#1F1115',
    borderColor: 'rgba(244, 63, 94, 0.45)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timerGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  timerBox: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  timerLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timerValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 4,
  },
  curfewValue: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  onCampusInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onCampusInfoText: {
    color: '#94A3B8',
    fontSize: 12,
  },
});

