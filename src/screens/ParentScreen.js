import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { THEME } from '../styles/theme';
import { useApp } from '../context/AppContext';
import { PassStatusBadge } from '../components/PassStatusBadge';
import {
  Users,
  ShieldCheck,
  CheckCircle,
  PhoneCall,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Bell,
} from 'lucide-react-native';

export function ParentScreen() {
  const { activeStudent, passes, gateLogs } = useApp();

  const [activeTab, setActiveTab] = useState('STATUS'); // 'STATUS' | 'ALERTS'

  const studentPasses = passes.filter((p) => p.studentId === activeStudent.id);
  const studentLogs = gateLogs.filter((l) => l.studentId === activeStudent.id);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.parentHeader}>
        <View style={styles.titleRow}>
          <Users size={16} color="#7C3AED" />
          <Text style={styles.title}>PARENT & GUARDIAN SAFETY PORTAL</Text>
        </View>
        <Text style={styles.subtitle}>
          Logged in as: {activeStudent.emergencyContactName} ({activeStudent.emergencyContactPhone})
        </Text>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'STATUS' && styles.tabItemActive]}
            onPress={() => setActiveTab('STATUS')}
            activeOpacity={0.7}
          >
            <ShieldCheck
              size={15}
              color={activeTab === 'STATUS' ? '#7C3AED' : THEME.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'STATUS' && { color: '#7C3AED', fontWeight: '700' },
              ]}
            >
              Ward Safety Status
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'ALERTS' && styles.tabItemActive]}
            onPress={() => setActiveTab('ALERTS')}
            activeOpacity={0.7}
          >
            <Bell
              size={15}
              color={activeTab === 'ALERTS' ? THEME.colors.primary : THEME.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'ALERTS' && { color: THEME.colors.primary, fontWeight: '700' },
              ]}
            >
              Gate Alerts ({studentLogs.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: WARD SAFETY STATUS */}
        {activeTab === 'STATUS' && (
          <View style={styles.tabContent}>
            {/* Student Profile Overview */}
            <View style={styles.wardCard}>
              <View style={styles.wardTopRow}>
                <Image source={{ uri: activeStudent.photoUrl }} style={styles.wardPhoto} />
                <View style={styles.wardMeta}>
                  <Text style={styles.wardName}>{activeStudent.name}</Text>
                  <Text style={styles.wardRoll}>ROLL NO: {activeStudent.rollNo}</Text>
                  <Text style={styles.wardDept}>{activeStudent.department}</Text>
                  <Text style={styles.wardSection}>
                    {activeStudent.section || 'Sec A'} • {activeStudent.year || '3rd Year'}
                  </Text>
                </View>
              </View>

              <View style={styles.statusDivider} />

              <View style={styles.wardLiveStatus}>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor:
                        activeStudent.status === 'ON_CAMPUS'
                          ? THEME.colors.successBg
                          : THEME.colors.warningBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      {
                        color:
                          activeStudent.status === 'ON_CAMPUS'
                            ? THEME.colors.success
                            : THEME.colors.warning,
                      },
                    ]}
                  >
                    {activeStudent.status === 'ON_CAMPUS' ? '● INSIDE CAMPUS' : '● OUTSIDE CAMPUS'}
                  </Text>
                </View>
                <Text style={styles.locationText}>📍 {activeStudent.lastLocation}</Text>
              </View>
            </View>

            {/* Quick Speed-Dial Hotline */}
            <View style={styles.hotlinesCard}>
              <Text style={styles.hotlinesTitle}>24x7 CAMPUS EMERGENCY DIRECTORY</Text>
              <View style={styles.hotlineRow}>
                <View style={styles.hotlineItem}>
                  <Text style={styles.hotlineLabel}>Security Control</Text>
                  <Text style={styles.hotlinePhone}>+91 98450 11222</Text>
                </View>
                <View style={styles.hotlineItem}>
                  <Text style={styles.hotlineLabel}>Proctor Office</Text>
                  <Text style={styles.hotlinePhone}>+91 98450 33444</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: GATE ALERTS FEED */}
        {activeTab === 'ALERTS' && (
          <View style={styles.tabContent}>
            <Text style={styles.feedTitle}>REAL-TIME ENTRY & EXIT NOTIFICATIONS</Text>
            {studentLogs.map((log) => {
              const isExit = log.direction === 'EXIT';
              return (
                <View key={log.id} style={styles.alertCard}>
                  <View style={styles.alertTop}>
                    <View
                      style={[
                        styles.dirBadge,
                        {
                          backgroundColor: isExit ? '#EFF6FF' : '#ECFDF5',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dirText,
                          { color: isExit ? THEME.colors.primary : THEME.colors.success },
                        ]}
                      >
                        {isExit ? 'CAMPUS EXIT' : 'CAMPUS ENTRY'}
                      </Text>
                    </View>
                    <Text style={styles.alertTime}>
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>

                  <Text style={styles.alertMessage}>
                    {isExit
                      ? `${activeStudent.name} cleared exit checkpoint at ${log.gateName}.`
                      : `${activeStudent.name} verified and entered campus at ${log.gateName}.`}
                  </Text>
                  <Text style={styles.guardSign}>✓ Verified by {log.guardName}</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  parentHeader: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { color: '#A855F7', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { color: '#94A3B8', fontSize: 10, marginTop: 1 },
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
    borderColor: 'rgba(168, 85, 247, 0.4)',
    ...THEME.shadows.sm,
  },
  tabLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: { padding: 14, gap: 14 },
  tabContent: { gap: 12 },
  wardCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 10,
    ...THEME.shadows.md,
  },
  wardTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  wardPhoto: {
    width: 60,
    height: 60,
    borderRadius: THEME.radius.md,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  wardMeta: {
    flex: 1,
    gap: 2,
  },
  wardName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  wardRoll: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  wardDept: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  wardSection: {
    color: '#94A3B8',
    fontSize: 10,
  },
  statusDivider: {
    height: 1,
    backgroundColor: '#1E293B',
  },
  wardLiveStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  locationText: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  hotlinesCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 8,
    ...THEME.shadows.md,
  },
  hotlinesTitle: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hotlineRow: {
    flexDirection: 'row',
    gap: 10,
  },
  hotlineItem: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  hotlineLabel: {
    color: '#94A3B8',
    fontSize: 9,
  },
  hotlinePhone: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  feedTitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  alertCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 6,
    ...THEME.shadows.md,
  },
  alertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dirBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  dirText: {
    fontSize: 9,
    fontWeight: '800',
  },
  alertTime: {
    color: '#94A3B8',
    fontSize: 10,
  },
  alertMessage: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
  },
  guardSign: {
    color: '#94A3B8',
    fontSize: 10,
  },
});

