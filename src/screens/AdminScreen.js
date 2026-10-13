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
import { PassStatusBadge } from '../components/PassStatusBadge';
import {
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  AlertOctagon,
  FileSpreadsheet,
  Search,
  Users,
  Compass,
  Radio,
} from 'lucide-react-native';

export function AdminScreen() {
  const {
    students,
    passes,
    gateLogs,
    sosAlerts,
    approvePass,
    rejectPass,
    resolveSOS,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('APPROVALS'); // 'APPROVALS' | 'PRESENCE' | 'SOS'
  const [rejectModalPassId, setRejectModalPassId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const pendingPasses = passes.filter((p) => p.status === 'PENDING_APPROVAL');
  const onCampusStudents = students.filter((s) => s.status === 'ON_CAMPUS');
  const offCampusStudents = students.filter((s) => s.status === 'OFF_CAMPUS');
  const activeSOS = sosAlerts.filter((a) => a.status === 'ACTIVE');

  const handleConfirmReject = () => {
    if (!rejectModalPassId) return;
    rejectPass(rejectModalPassId, rejectReason || 'Permission not granted by Chief Proctor Office.');
    setRejectModalPassId(null);
    setRejectReason('');
  };

  const handleExportCSV = () => {
    showToast(
      'Exporting Gate Log',
      `Exported ${gateLogs.length} movement records to CSV.`,
      'success'
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Proctor Header */}
      <View style={styles.adminHeader}>
        <View style={styles.titleRow}>
          <Building2 size={16} color={THEME.colors.warning} />
          <Text style={styles.title}>CHIEF PROCTOR & DISCIPLINE DESK</Text>
        </View>
        <Text style={styles.subtitle}>
          Dr. S. K. Narayan (Chief Proctor) • Campus Access Control
        </Text>
      </View>

      {/* KPI Stats Bar */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>ON CAMPUS</Text>
          <Text style={[styles.kpiVal, { color: THEME.colors.success }]}>
            {onCampusStudents.length} / {students.length}
          </Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>OFF CAMPUS</Text>
          <Text style={[styles.kpiVal, { color: THEME.colors.primary }]}>
            {offCampusStudents.length}
          </Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>PENDING</Text>
          <Text style={[styles.kpiVal, { color: THEME.colors.warning }]}>
            {pendingPasses.length}
          </Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>SOS ALERTS</Text>
          <Text
            style={[
              styles.kpiVal,
              { color: activeSOS.length > 0 ? THEME.colors.danger : THEME.colors.textMuted },
            ]}
          >
            {activeSOS.length}
          </Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'APPROVALS' && styles.tabItemActive]}
            onPress={() => setActiveTab('APPROVALS')}
            activeOpacity={0.7}
          >
            <Clock
              size={14}
              color={activeTab === 'APPROVALS' ? THEME.colors.warning : THEME.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'APPROVALS' && { color: THEME.colors.warning, fontWeight: '700' },
              ]}
            >
              Approvals ({pendingPasses.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'PRESENCE' && styles.tabItemActive]}
            onPress={() => setActiveTab('PRESENCE')}
            activeOpacity={0.7}
          >
            <Compass
              size={14}
              color={activeTab === 'PRESENCE' ? THEME.colors.primary : THEME.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'PRESENCE' && { color: THEME.colors.primary, fontWeight: '700' },
              ]}
            >
              Presence & Logs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'SOS' && styles.tabItemActive]}
            onPress={() => setActiveTab('SOS')}
            activeOpacity={0.7}
          >
            <AlertOctagon
              size={14}
              color={activeTab === 'SOS' ? THEME.colors.danger : THEME.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'SOS' && { color: THEME.colors.danger, fontWeight: '700' },
              ]}
            >
              SOS Center ({activeSOS.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: APPROVALS */}
        {activeTab === 'APPROVALS' && (
          <View style={styles.tabContent}>
            {pendingPasses.length > 0 ? (
              pendingPasses.map((p) => {
                const student = students.find((s) => s.id === p.studentId);
                return (
                  <View key={p.id} style={styles.approvalCard}>
                    <View style={styles.approvalTop}>
                      <View>
                        <Text style={styles.studentName}>{p.studentName}</Text>
                        <Text style={styles.studentSub}>
                          {p.rollNo} • {student?.department} ({student?.section || 'Sec A'})
                        </Text>
                      </View>
                      <PassStatusBadge status={p.status} size="sm" />
                    </View>

                    <View style={styles.detailsBox}>
                      <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Type: </Text>
                        {p.passType.replace('_', ' ')}
                      </Text>
                      <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Destination: </Text>
                        {p.destination}
                      </Text>
                      <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Reason: </Text>"{p.purpose}"
                      </Text>
                      <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Return Time: </Text>
                        {p.expectedReturnTime || '05:30 PM'}
                      </Text>
                    </View>

                    <View style={styles.btnRow}>
                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={() => approvePass(p.id)}
                        activeOpacity={0.8}
                      >
                        <CheckCircle size={14} color="#FFFFFF" />
                        <Text style={styles.approveBtnText}>APPROVE PERMISSION</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => setRejectModalPassId(p.id)}
                        activeOpacity={0.8}
                      >
                        <XCircle size={14} color={THEME.colors.danger} />
                        <Text style={styles.rejectBtnText}>REJECT</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyCard}>
                <CheckCircle size={28} color={THEME.colors.success} />
                <Text style={styles.emptyTitle}>No Pending Permissions</Text>
                <Text style={styles.emptySub}>
                  All student gate pass requests have been reviewed.
                </Text>
              </View>
            )}

            {/* Rejection Sheet */}
            {rejectModalPassId && (
              <View style={styles.rejectCard}>
                <Text style={styles.rejectTitle}>REASON FOR REJECTION (PASS #{rejectModalPassId})</Text>
                <TextInput
                  style={styles.rejectInput}
                  placeholder="e.g. Unauthorized absence during lecture hours"
                  placeholderTextColor={THEME.colors.textMuted}
                  value={rejectReason}
                  onChangeText={setRejectReason}
                />
                <View style={styles.rejectBtnRow}>
                  <TouchableOpacity style={styles.confirmRejectBtn} onPress={handleConfirmReject}>
                    <Text style={styles.confirmRejectText}>Confirm Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRejectModalPassId(null)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* TAB 2: PRESENCE & MOVEMENT LOGS */}
        {activeTab === 'PRESENCE' && (
          <View style={styles.tabContent}>
            {/* Search & Export Toolbar */}
            <View style={styles.toolbar}>
              <View style={styles.searchBox}>
                <Search size={13} color={THEME.colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search student or roll no..."
                  placeholderTextColor={THEME.colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.exportBtn} onPress={handleExportCSV}>
                <FileSpreadsheet size={13} color="#FFFFFF" />
                <Text style={styles.exportText}>CSV</Text>
              </TouchableOpacity>
            </View>

            {/* Students Currently Off-Campus */}
            <Text style={styles.sectionHeader}>STUDENTS CURRENTLY OFF-CAMPUS ({offCampusStudents.length})</Text>
            {offCampusStudents.map((s) => (
              <View key={s.id} style={styles.offCard}>
                <Text style={styles.offName}>{s.name} ({s.rollNo})</Text>
                <Text style={styles.offDept}>{s.department} • {s.section}</Text>
                <Text style={styles.offLoc}>📍 {s.lastLocation}</Text>
              </View>
            ))}

            {/* Gate Movement Stream */}
            <Text style={[styles.sectionHeader, { marginTop: 8 }]}>GATE MOVEMENT LEDGER</Text>
            {gateLogs
              .filter(
                (l) =>
                  !searchQuery ||
                  l.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  l.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((l) => (
                <View key={l.id} style={styles.logRow}>
                  <Text
                    style={[
                      styles.logDir,
                      { color: l.direction === 'EXIT' ? THEME.colors.primary : THEME.colors.success },
                    ]}
                  >
                    {l.direction}
                  </Text>
                  <View style={styles.logMeta}>
                    <Text style={styles.logName}>{l.studentName} ({l.rollNo})</Text>
                    <Text style={styles.logGate}>{l.gateName} • Guard: {l.guardName}</Text>
                  </View>
                  <Text style={styles.logTime}>
                    {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {/* TAB 3: EMERGENCY SOS */}
        {activeTab === 'SOS' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionHeader}>ACTIVE DISTRESS BEACONS</Text>
            {sosAlerts.map((a) => {
              const isResolved = a.status === 'RESOLVED';
              return (
                <View
                  key={a.id}
                  style={[styles.sosCard, !isResolved && styles.sosCardActive]}
                >
                  <View style={styles.sosTop}>
                    <AlertOctagon size={16} color={!isResolved ? THEME.colors.danger : THEME.colors.textMuted} />
                    <Text style={[styles.sosName, !isResolved && { color: THEME.colors.danger }]}>
                      {a.studentName} ({a.rollNo})
                    </Text>
                    <PassStatusBadge status={a.status} size="sm" />
                  </View>
                  <Text style={styles.sosReason}>🚨 {a.reason}</Text>
                  <Text style={styles.sosLoc}>📍 {a.location}</Text>
                  <Text style={styles.sosCoords}>GPS: {a.coordinates}</Text>

                  {!isResolved ? (
                    <TouchableOpacity
                      style={styles.resolveBtn}
                      onPress={() => resolveSOS(a.id)}
                    >
                      <CheckCircle size={14} color="#FFFFFF" />
                      <Text style={styles.resolveBtnText}>MARK INCIDENT RESOLVED</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.resolvedNote}>✓ Resolved by: {a.resolvedBy}</Text>
                  )}
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
  adminHeader: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { color: '#94A3B8', fontSize: 10, marginTop: 1 },
  kpiContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    padding: 8,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#111827',
    paddingVertical: 6,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1F2937',
    alignItems: 'center',
  },
  kpiLabel: { color: '#94A3B8', fontSize: 8, fontWeight: '700' },
  kpiVal: { fontSize: 13, fontWeight: '800', marginTop: 1 },
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
    borderColor: 'rgba(245, 158, 11, 0.4)',
    ...THEME.shadows.sm,
  },
  tabLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: { padding: 14, gap: 14 },
  tabContent: { gap: 10 },
  approvalCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 8,
    ...THEME.shadows.md,
  },
  approvalTop: { flexDirection: 'row', justifyContent: 'space-between' },
  studentName: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  studentSub: { color: '#CBD5E1', fontSize: 10 },
  detailsBox: { backgroundColor: '#0F172A', padding: 8, borderRadius: 6, gap: 3, borderWidth: 1, borderColor: '#1E293B' },
  detailItem: { color: '#CBD5E1', fontSize: 11 },
  detailLabel: { color: '#94A3B8', fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  approveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
    ...THEME.shadows.glowSuccess,
  },
  approveBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  rejectBtnText: { color: '#F43F5E', fontSize: 11, fontWeight: '700' },
  emptyCard: {
    backgroundColor: '#111827',
    padding: 24,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#1F2937',
    ...THEME.shadows.md,
  },
  emptyTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  emptySub: { color: '#94A3B8', fontSize: 11 },
  rejectCard: { backgroundColor: '#111827', padding: 10, borderRadius: 6, gap: 6, borderWidth: 1, borderColor: 'rgba(244, 63, 94, 0.4)' },
  rejectTitle: { color: '#F43F5E', fontSize: 9, fontWeight: '700' },
  rejectInput: { backgroundColor: '#0F172A', paddingHorizontal: 8, paddingVertical: 6, color: '#FFFFFF', fontSize: 11, borderRadius: 4, borderWidth: 1, borderColor: '#1E293B' },
  rejectBtnRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  confirmRejectBtn: { backgroundColor: '#E11D48', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4 },
  confirmRejectText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  cancelText: { color: '#94A3B8', fontSize: 10 },
  toolbar: { flexDirection: 'row', gap: 8 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', paddingHorizontal: 8, borderRadius: 6, borderWidth: 1, borderColor: '#1F2937', gap: 6 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 11, paddingVertical: 6 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0284C7', paddingHorizontal: 10, borderRadius: 6, gap: 4, ...THEME.shadows.glowPrimary },
  exportText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  sectionHeader: { color: '#94A3B8', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  offCard: { backgroundColor: '#111827', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#1F2937', ...THEME.shadows.md },
  offName: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  offDept: { color: '#CBD5E1', fontSize: 10 },
  offLoc: { color: '#94A3B8', fontSize: 10 },
  logRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', padding: 8, borderRadius: 6, gap: 8, borderWidth: 1, borderColor: '#1F2937', ...THEME.shadows.md },
  logDir: { fontSize: 10, fontWeight: '800', width: 45 },
  logMeta: { flex: 1 },
  logName: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  logGate: { color: '#94A3B8', fontSize: 9 },
  logTime: { color: '#94A3B8', fontSize: 9 },
  sosCard: { backgroundColor: '#111827', padding: 10, borderRadius: 6, gap: 4, borderWidth: 1, borderColor: '#1F2937', ...THEME.shadows.md },
  sosCardActive: { borderColor: 'rgba(244, 63, 94, 0.4)', backgroundColor: '#1F1115' },
  sosTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sosName: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', flex: 1 },
  sosReason: { color: '#CBD5E1', fontSize: 11 },
  sosLoc: { color: '#CBD5E1', fontSize: 11 },
  sosCoords: { color: '#F59E0B', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  resolveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#059669', paddingVertical: 6, borderRadius: 4, gap: 4, marginTop: 4, ...THEME.shadows.glowSuccess },
  resolveBtnText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  resolvedNote: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
});

