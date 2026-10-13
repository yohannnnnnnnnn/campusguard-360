import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { THEME } from '../styles/theme';
import { useApp } from '../context/AppContext';
import { ScannerModal } from '../components/ScannerModal';
import {
  Camera,
  ShieldAlert,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Unlock,
  Radio,
  MapPin,
  Clock,
  ListFilter,
  CheckCircle,
} from 'lucide-react-native';

export function SecurityScreen() {
  const {
    activeGate,
    setCurrentGateId,
    gates,
    gateLogs,
    sosAlerts,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('SCANNER'); // 'SCANNER' | 'LOGS'
  const [showScanner, setShowScanner] = useState(false);
  const [isLockdown, setIsLockdown] = useState(false);
  const [filterDirection, setFilterDirection] = useState('ALL'); // 'ALL' | 'EXIT' | 'ENTRY'

  // Metric counts
  const totalExits = gateLogs.filter((l) => l.direction === 'EXIT').length;
  const totalEntries = gateLogs.filter((l) => l.direction === 'ENTRY').length;
  const activeSOSCount = sosAlerts.filter((a) => a.status === 'ACTIVE').length;

  const filteredLogs = gateLogs.filter((l) => {
    if (filterDirection === 'EXIT') return l.direction === 'EXIT';
    if (filterDirection === 'ENTRY') return l.direction === 'ENTRY';
    return true;
  });

  const toggleLockdown = () => {
    setIsLockdown(!isLockdown);
    showToast(
      !isLockdown ? '🚨 EMERGENCY GATE LOCKDOWN' : 'Lockdown Lifted',
      !isLockdown
        ? `Barrier gates locked down at ${activeGate.name}.`
        : `Normal barrier clearance resumed at ${activeGate.name}.`,
      !isLockdown ? 'danger' : 'info'
    );
  };

  return (
    <View style={styles.container}>
      {/* Checkpoint Location Selector */}
      <View style={styles.topBar}>
        <Text style={styles.checkpointLabel}>ACTIVE CHECKPOINT:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gatesScroll}>
          {gates.map((g) => {
            const isSelected = g.id === activeGate.id;
            return (
              <TouchableOpacity
                key={g.id}
                style={[styles.gatePill, isSelected && styles.gatePillActive]}
                onPress={() => setCurrentGateId(g.id)}
                activeOpacity={0.7}
              >
                <MapPin size={11} color={isSelected ? THEME.colors.primary : THEME.colors.textMuted} />
                <Text style={[styles.gatePillText, isSelected && styles.gatePillTextActive]}>
                  {g.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Distress Signal Warning (if active) */}
      {activeSOSCount > 0 && (
        <View style={styles.sosBanner}>
          <Radio size={14} color="#FFFFFF" />
          <Text style={styles.sosBannerText}>
            ACTIVE SOS DISTRESS SIGNAL • Check Proctor Alert Desk
          </Text>
        </View>
      )}

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'SCANNER' && styles.tabItemActive]}
            onPress={() => setActiveTab('SCANNER')}
            activeOpacity={0.7}
          >
            <Camera
              size={15}
              color={activeTab === 'SCANNER' ? THEME.colors.primary : THEME.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'SCANNER' && { color: THEME.colors.primary, fontWeight: '700' },
              ]}
            >
              Gate Scanner
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'LOGS' && styles.tabItemActive]}
            onPress={() => setActiveTab('LOGS')}
            activeOpacity={0.7}
          >
            <ListFilter
              size={15}
              color={activeTab === 'LOGS' ? '#059669' : THEME.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'LOGS' && { color: '#059669', fontWeight: '700' },
              ]}
            >
              Live Movement Feed ({filteredLogs.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: SCANNER & FAST VERIFIER */}
        {activeTab === 'SCANNER' && (
          <View style={styles.tabContent}>
            {/* Big Launch Scanner Action */}
            <TouchableOpacity
              style={[styles.launchScanBtn, isLockdown && styles.launchScanBtnLocked]}
              onPress={() => setShowScanner(true)}
              activeOpacity={0.85}
            >
              <View style={styles.scannerIconCircle}>
                <Camera size={30} color="#FFFFFF" />
              </View>
              <View style={styles.scannerMeta}>
                <Text style={styles.scannerTitle}>LAUNCH REAL-TIME QR SCANNER</Text>
                <Text style={styles.scannerSub}>
                  Live camera stream • 2-minute dynamic rolling token decoder
                </Text>
              </View>
            </TouchableOpacity>

            {/* Quick Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <ArrowUpRight size={14} color={THEME.colors.primary} />
                  <Text style={styles.metricLabel}>Exits Today</Text>
                </View>
                <Text style={[styles.metricVal, { color: THEME.colors.primary }]}>
                  {totalExits}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <ArrowDownLeft size={14} color={THEME.colors.success} />
                  <Text style={styles.metricLabel}>Entries Today</Text>
                </View>
                <Text style={[styles.metricVal, { color: THEME.colors.success }]}>
                  {totalEntries}
                </Text>
              </View>
            </View>

            {/* Emergency Gate Lockdown Toggle */}
            <View style={styles.lockdownCard}>
              <View style={styles.lockdownMeta}>
                <Text style={styles.lockdownTitle}>BARRIER LOCKDOWN</Text>
                <Text style={styles.lockdownDesc}>
                  {isLockdown
                    ? 'BARRIERS LOCKED: Emergency halt on all gate clearance.'
                    : 'Normal barrier operation active.'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.lockdownBtn, isLockdown && styles.lockdownBtnActive]}
                onPress={toggleLockdown}
                activeOpacity={0.8}
              >
                {isLockdown ? (
                  <>
                    <Unlock size={13} color="#FFFFFF" />
                    <Text style={styles.lockdownBtnText}>LIFT</Text>
                  </>
                ) : (
                  <>
                    <Lock size={13} color="#FFFFFF" />
                    <Text style={styles.lockdownBtnText}>LOCK</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: LIVE MOVEMENT LOGS */}
        {activeTab === 'LOGS' && (
          <View style={styles.tabContent}>
            {/* Filter Pills */}
            <View style={styles.filterPillsRow}>
              {['ALL', 'EXIT', 'ENTRY'].map((f) => {
                const isSel = filterDirection === f;
                return (
                  <TouchableOpacity
                    key={f}
                    style={[styles.filterPill, isSel && styles.filterPillActive]}
                    onPress={() => setFilterDirection(f)}
                  >
                    <Text
                      style={[styles.filterPillText, isSel && styles.filterPillTextActive]}
                    >
                      {f}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Movement Cards */}
            <View style={styles.logsList}>
              {filteredLogs.map((log) => {
                const isExit = log.direction === 'EXIT';
                return (
                  <View key={log.id} style={styles.logCard}>
                    <View style={styles.logTop}>
                      <View
                        style={[
                          styles.directionTag,
                          {
                            backgroundColor: isExit ? '#EFF6FF' : '#ECFDF5',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.directionText,
                            { color: isExit ? THEME.colors.primary : THEME.colors.success },
                          ]}
                        >
                          {log.direction}
                        </Text>
                      </View>

                      <Text style={styles.logTime}>
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </Text>
                    </View>

                    <Text style={styles.logStudentName}>
                      {log.studentName}{' '}
                      <Text style={styles.logRoll}>({log.rollNo})</Text>
                    </Text>
                    <Text style={styles.logDetails}>
                      Pass #{log.passId} • {log.gateName}
                    </Text>
                    {log.vehicleNo && log.vehicleNo !== 'None' && (
                      <Text style={styles.logVehicle}>🚗 Vehicle: {log.vehicleNo}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fast QR Scanner Modal */}
      <ScannerModal visible={showScanner} onClose={() => setShowScanner(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  topBar: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    gap: 4,
  },
  checkpointLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gatesScroll: {
    flexDirection: 'row',
  },
  gatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090D16',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginRight: 8,
    gap: 5,
  },
  gatePillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  gatePillText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  gatePillTextActive: {
    color: '#10B981',
    fontWeight: '700',
  },
  sosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E11D48',
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 6,
  },
  sosBannerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tabContainer: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#090D16',
    borderRadius: THEME.radius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    gap: 5,
  },
  tabItemActive: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    ...THEME.shadows.sm,
  },
  tabLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 14,
    gap: 14,
  },
  tabContent: {
    gap: 14,
  },
  launchScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: THEME.radius.lg,
    gap: 14,
    ...THEME.shadows.glowSuccess,
  },
  launchScanBtnLocked: {
    backgroundColor: '#E11D48',
    ...THEME.shadows.glowDanger,
  },
  scannerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerMeta: {
    flex: 1,
  },
  scannerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scannerSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#1F2937',
    ...THEME.shadows.md,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  lockdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#1F2937',
    ...THEME.shadows.md,
  },
  lockdownMeta: {
    flex: 1,
    marginRight: 10,
  },
  lockdownTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  lockdownDesc: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 1,
  },
  lockdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  lockdownBtnActive: {
    backgroundColor: '#E11D48',
    borderColor: '#FB7185',
  },
  lockdownBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  filterPillActive: {
    backgroundColor: '#059669',
    borderColor: '#10B981',
  },
  filterPillText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  logsList: {
    gap: 8,
  },
  logCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 12,
    gap: 4,
    ...THEME.shadows.md,
  },
  logTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  directionTag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  directionText: {
    fontSize: 10,
    fontWeight: '800',
  },
  logTime: {
    color: '#94A3B8',
    fontSize: 10,
  },
  logStudentName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  logRoll: {
    color: '#38BDF8',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  logDetails: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  logVehicle: {
    color: '#F59E0B',
    fontSize: 10,
  },
});

