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
import { DynamicQRCode } from '../components/DynamicQRCode';
import { StudentIDCard } from '../components/StudentIDCard';
import { PassStatusBadge } from '../components/PassStatusBadge';
import { OutTimerBanner } from '../components/OutTimerBanner';
import { SOSModal } from '../components/SOSModal';
import {
  QrCode,
  PlusCircle,
  History,
  AlertOctagon,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react-native';

export function StudentScreen() {
  const { activeStudent, activeStudentPass, passes, requestPass, gateLogs } = useApp();

  const [activeTab, setActiveTab] = useState('PASS'); // 'PASS' | 'REQUEST' | 'SOS' | 'HISTORY'
  const [showSOSModal, setShowSOSModal] = useState(false);

  // Form State for Pass Request
  const [passType, setPassType] = useState('DAY_PASS');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [parentConsent, setParentConsent] = useState(false);

  // Personal passes & logs
  const studentPasses = passes.filter((p) => p.studentId === activeStudent.id);
  const studentLogs = gateLogs.filter((l) => l.studentId === activeStudent.id);

  const applyPreset = (type, dest, purp, parentReq = false) => {
    setPassType(type);
    setDestination(dest);
    setPurpose(purp);
    setParentConsent(parentReq);
  };

  const handleSubmit = () => {
    if (!destination.trim() || !purpose.trim()) {
      alert('Please enter your destination and reason.');
      return;
    }

    requestPass({
      passType,
      purpose,
      destination,
      parentConsentRequired: parentConsent,
    });

    setDestination('');
    setPurpose('');
    setActiveTab('PASS');
  };

  return (
    <View style={styles.container}>
      {/* Clean Navigation Tab Bar */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          {[
            { key: 'PASS', label: 'My Pass', icon: QrCode, color: THEME.colors.primary },
            { key: 'REQUEST', label: 'Request', icon: PlusCircle, color: '#D97706' },
            { key: 'SOS', label: 'SOS', icon: AlertOctagon, color: THEME.colors.danger },
            { key: 'HISTORY', label: 'Activity', icon: History, color: '#7C3AED' },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Icon size={15} color={isActive ? tab.color : THEME.colors.textMuted} />
                <Text
                  style={[
                    styles.tabLabel,
                    isActive && { color: tab.color, fontWeight: '700' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* TAB 1: PASS & DIGITAL ID */}
        {activeTab === 'PASS' && (
          <View style={styles.tabContent}>
            {/* Real-Time Working Hours Out-Timer */}
            <OutTimerBanner student={activeStudent} activePass={activeStudentPass} />

            {/* Dynamic QR Gate Pass */}
            {activeStudentPass ? (
              <View style={styles.passSection}>
                <View style={styles.passHeaderCard}>
                  <View style={styles.passTitleRow}>
                    <View>
                      <Text style={styles.passIdTag}>PASS #{activeStudentPass.id}</Text>
                      <Text style={styles.passTypeHeading}>
                        {activeStudentPass.passType.replace('_', ' ')}
                      </Text>
                    </View>
                    <PassStatusBadge status={activeStudentPass.status} />
                  </View>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <MapPin size={13} color={THEME.colors.textMuted} />
                      <Text style={styles.metaText} numberOfLines={1}>
                        {activeStudentPass.destination}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock size={13} color={THEME.colors.warning} />
                      <Text style={[styles.metaText, { color: THEME.colors.warning }]}>
                        Return: {activeStudentPass.expectedReturnTime || '05:30 PM'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 2-Min Dynamic Rolling Anti-Screenshot QR */}
                {activeStudentPass.status === 'APPROVED' || activeStudentPass.status === 'CHECKED_OUT' ? (
                  <DynamicQRCode pass={activeStudentPass} student={activeStudent} />
                ) : (
                  <View style={styles.pendingCard}>
                    <Clock size={24} color={THEME.colors.warning} />
                    <Text style={styles.pendingTitle}>Under Proctor Review</Text>
                    <Text style={styles.pendingDesc}>
                      Your gate pass request has been submitted to the Chief Proctor Office. Your
                      dynamic QR token will activate automatically upon approval.
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.noPassCard}>
                <QrCode size={32} color={THEME.colors.textMuted} />
                <Text style={styles.noPassTitle}>No Active Gate Pass</Text>
                <Text style={styles.noPassDesc}>
                  You are currently checked in on campus. Apply for an outpass below when leaving.
                </Text>
                <TouchableOpacity
                  style={styles.requestFastBtn}
                  onPress={() => setActiveTab('REQUEST')}
                >
                  <PlusCircle size={14} color="#FFFFFF" />
                  <Text style={styles.requestFastText}>Request Outpass</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Student Smart ID Card */}
            <View style={styles.idCardSection}>
              <StudentIDCard student={activeStudent} />
            </View>
          </View>
        )}

        {/* TAB 2: REQUEST PERMISSION */}
        {activeTab === 'REQUEST' && (
          <View style={styles.tabContent}>
            {/* Quick 1-Tap Autofill Chips */}
            <View style={styles.presetBox}>
              <View style={styles.presetHeader}>
                <Sparkles size={13} color={THEME.colors.primary} />
                <Text style={styles.presetHeaderTitle}>1-TAP AUTOFILL PRESETS</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() =>
                    applyPreset('DAY_PASS', 'Tech Innovation Hub, MG Road', 'Academic mentor meeting & hardware pickup')
                  }
                >
                  <Text style={styles.presetChipText}>💡 Project Day Pass</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() =>
                    applyPreset('OFFICIAL_DUTY', 'IISc Campus', 'Inter-College Tech Symposium & Hackathon')
                  }
                >
                  <Text style={styles.presetChipText}>🎓 Official College Duty</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() =>
                    applyPreset('EARLY_LEAVE', 'City Clinic', 'Urgent medical consultation and health checkup', true)
                  }
                >
                  <Text style={styles.presetChipText}>🏥 Medical / Early Leave</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Pass Type Grid */}
            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>PASS CATEGORY</Text>
              <View style={styles.typeGrid}>
                {[
                  { key: 'DAY_PASS', label: 'Day Pass' },
                  { key: 'OFFICIAL_DUTY', label: 'College Duty' },
                  { key: 'EARLY_LEAVE', label: 'Early Leave' },
                  { key: 'EMERGENCY_MEDICAL', label: 'Medical' },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.key}
                    style={[styles.typeOption, passType === t.key && styles.typeOptionActive]}
                    onPress={() => setPassType(t.key)}
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        passType === t.key && styles.typeOptionTextActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Destination Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>DESTINATION LOCATION</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. City Tech Park, Central Library"
                  placeholderTextColor={THEME.colors.textMuted}
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>

              {/* Reason / Purpose Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>REASON / PURPOSE</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Explain why you are leaving campus during working hours..."
                  placeholderTextColor={THEME.colors.textMuted}
                  value={purpose}
                  onChangeText={setPurpose}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Parent Consent Checkbox */}
              <TouchableOpacity
                style={styles.consentRow}
                onPress={() => setParentConsent(!parentConsent)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, parentConsent && styles.checkboxActive]}>
                  {parentConsent && <CheckCircle2 size={13} color="#FFFFFF" />}
                </View>
                <View style={styles.consentMeta}>
                  <Text style={styles.consentTitle}>Notify Parent via Automated SMS</Text>
                  <Text style={styles.consentSub}>
                    Sends SMS alert to {activeStudent.emergencyContactName}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
                <ShieldCheck size={16} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>SUBMIT TO PROCTOR OFFICE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 3: EMERGENCY SOS */}
        {activeTab === 'SOS' && (
          <View style={styles.tabContent}>
            <View style={styles.sosCard}>
              <View style={styles.sosIconRing}>
                <AlertOctagon size={42} color={THEME.colors.danger} />
              </View>
              <Text style={styles.sosTitle}>CAMPUS EMERGENCY SOS</Text>
              <Text style={styles.sosDesc}>
                In an emergency, accident, or threat, tap below to broadcast your live GPS telemetry
                directly to Campus Security Patrol and registered parents.
              </Text>
              <TouchableOpacity
                style={styles.sosBigBtn}
                onPress={() => setShowSOSModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.sosBigBtnText}>OPEN EMERGENCY BEACON</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 4: ACTIVITY & HISTORY */}
        {activeTab === 'HISTORY' && (
          <View style={styles.tabContent}>
            <Text style={styles.timelineSectionTitle}>MY PASS APPLICATIONS</Text>
            {studentPasses.map((p) => (
              <View key={p.id} style={styles.historyCard}>
                <View style={styles.historyTop}>
                  <Text style={styles.historyId}>#{p.id}</Text>
                  <PassStatusBadge status={p.status} size="sm" />
                </View>
                <Text style={styles.historyDest}>📍 {p.destination}</Text>
                <Text style={styles.historyPurpose}>"{p.purpose}"</Text>
                <Text style={styles.historySign}>✓ {p.approvedBy || 'Pending Review'}</Text>
              </View>
            ))}

            <Text style={[styles.timelineSectionTitle, { marginTop: 10 }]}>GATE ENTRY & EXIT LOGS</Text>
            {studentLogs.map((l) => (
              <View key={l.id} style={styles.gateLogCard}>
                <View style={styles.logLeft}>
                  <Text
                    style={[
                      styles.logDir,
                      { color: l.direction === 'EXIT' ? THEME.colors.primary : THEME.colors.success },
                    ]}
                  >
                    {l.direction === 'EXIT' ? '🚪 EXITED CAMPUS' : '🏫 ENTERED CAMPUS'}
                  </Text>
                  <Text style={styles.logGateName}>{l.gateName}</Text>
                </View>
                <Text style={styles.logTime}>
                  {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* SOS Modal */}
      <SOSModal visible={showSOSModal} onClose={() => setShowSOSModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
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
    borderColor: 'rgba(56, 189, 248, 0.4)',
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
  passSection: {
    gap: 12,
  },
  passHeaderCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 10,
    ...THEME.shadows.md,
  },
  passTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  passIdTag: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  passTypeHeading: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  metaText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
  },
  pendingCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderRadius: THEME.radius.lg,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  pendingTitle: {
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: '800',
  },
  pendingDesc: {
    color: '#FCD34D',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  noPassCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.lg,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
    ...THEME.shadows.md,
  },
  noPassTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  noPassDesc: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
  },
  requestFastBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.md,
    gap: 6,
    marginTop: 4,
    ...THEME.shadows.glowPrimary,
  },
  requestFastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  idCardSection: {
    marginTop: 2,
  },
  presetBox: {
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 6,
    ...THEME.shadows.md,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  presetHeaderTitle: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  presetScroll: {
    flexDirection: 'row',
  },
  presetChip: {
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginRight: 8,
  },
  presetChipText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 12,
    ...THEME.shadows.md,
  },
  fieldLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0F172A',
    paddingVertical: 9,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  typeOptionText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
  },
  typeOptionTextActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  inputGroup: {
    gap: 4,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: '#FFFFFF',
    fontSize: 12,
  },
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#090D16',
  },
  checkboxActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  consentMeta: {
    flex: 1,
  },
  consentTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  consentSub: {
    color: '#94A3B8',
    fontSize: 9,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    gap: 6,
    marginTop: 4,
    ...THEME.shadows.glowPrimary,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sosCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.lg,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    ...THEME.shadows.md,
  },
  sosIconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
  sosTitle: {
    color: '#F43F5E',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sosDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  sosBigBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: THEME.radius.md,
    ...THEME.shadows.glowDanger,
    marginTop: 4,
  },
  sosBigBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timelineSectionTitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  historyCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 4,
    ...THEME.shadows.md,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyId: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  historyDest: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  historyPurpose: {
    color: '#94A3B8',
    fontSize: 11,
    fontStyle: 'italic',
  },
  historySign: {
    color: '#10B981',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
  gateLogCard: {
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
  logLeft: {
    gap: 2,
  },
  logDir: {
    fontSize: 11,
    fontWeight: '700',
  },
  logGateName: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  logTime: {
    color: '#94A3B8',
    fontSize: 10,
  },
});

