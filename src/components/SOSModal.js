import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { THEME } from '../styles/theme';
import { useApp } from '../context/AppContext';
import {
  AlertOctagon,
  X,
  MapPin,
  PhoneCall,
  ShieldAlert,
  Users,
  Radio,
  CheckCircle,
  Building2,
} from 'lucide-react-native';

const SOS_REASONS = [
  'Medical Emergency',
  'Physical Threat / Harassment',
  'Road Accident / Vehicle Breakdown',
  'Suspicious Movement / Stalking',
  'Unsafe Area Transit',
];

export function SOSModal({ visible, onClose }) {
  const { activeStudent, triggerSOS, sosAlerts } = useApp();
  const [selectedReason, setSelectedReason] = useState(SOS_REASONS[0]);
  const [isTriggered, setIsTriggered] = useState(false);

  const activeAlert = sosAlerts.find(
    (a) => a.studentId === activeStudent.id && a.status !== 'RESOLVED'
  );

  const handleActivateSOS = () => {
    triggerSOS({
      reason: selectedReason,
      location: 'Near Academic Tech Block / North Gate Boulevard (450m from Gate 1)',
      coordinates: '12.9716° N, 77.5946° E',
    });
    setIsTriggered(true);
  };

  const handleReset = () => {
    setIsTriggered(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleBox}>
              <AlertOctagon size={20} color={THEME.colors.danger} />
              <Text style={styles.headerTitle}>CAMPUS EMERGENCY SOS</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <X size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {isTriggered || activeAlert ? (
              /* Active Distress State */
              <View style={styles.activeAlertCard}>
                <View style={styles.pulseIconContainer}>
                  <Radio size={40} color={THEME.colors.danger} />
                </View>
                <Text style={styles.activeAlertTitle}>DISTRESS BEACON BROADCASTING</Text>
                <Text style={styles.activeAlertDesc}>
                  Your live GPS telemetry and distress alert have been transmitted to Campus Quick Response
                  Security & Chief Proctor Office.
                </Text>

                {/* Live Location telemetry */}
                <View style={styles.telemetryBox}>
                  <MapPin size={16} color={THEME.colors.warning} />
                  <View style={styles.telemetryMeta}>
                    <Text style={styles.telemetryLabel}>GPS COORDINATES</Text>
                    <Text style={styles.telemetryCoords}>12.9716° N, 77.5946° E</Text>
                    <Text style={styles.telemetryDesc}>450m from Main Campus Gate 1</Text>
                  </View>
                </View>

                {/* Notification Escalation Dispatch List */}
                <View style={styles.dispatchList}>
                  <Text style={styles.dispatchTitle}>🚨 EMERGENCY DISPATCH PIPELINE</Text>
                  <View style={styles.dispatchItem}>
                    <ShieldAlert size={15} color={THEME.colors.success} />
                    <Text style={styles.dispatchText}>Campus Security Patrol QRT #1 Alerted</Text>
                  </View>
                  <View style={styles.dispatchItem}>
                    <Building2 size={15} color={THEME.colors.success} />
                    <Text style={styles.dispatchText}>Chief Proctor Office (Dr. Narayan) Notified</Text>
                  </View>
                  <View style={styles.dispatchItem}>
                    <PhoneCall size={15} color={THEME.colors.success} />
                    <Text style={styles.dispatchText}>
                      Parent ({activeStudent.emergencyContactName}) SMS Alert Sent
                    </Text>
                  </View>
                </View>

                {/* Direct Call Campus Security Hotline */}
                <TouchableOpacity style={styles.callHotlineBtn} activeOpacity={0.85}>
                  <PhoneCall size={16} color="#FFFFFF" />
                  <Text style={styles.callHotlineText}>CALL SECURITY CONTROL (080-23456789)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dismissBtn} onPress={handleReset} activeOpacity={0.7}>
                  <Text style={styles.dismissBtnText}>Dismiss Emergency Screen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Un-triggered State: Select Reason & Trigger */
              <View style={styles.untriggeredContainer}>
                <Text style={styles.sectionTitle}>SELECT NATURE OF EMERGENCY</Text>
                <View style={styles.reasonsList}>
                  {SOS_REASONS.map((reason) => {
                    const isSelected = selectedReason === reason;
                    return (
                      <TouchableOpacity
                        key={reason}
                        style={[styles.reasonChip, isSelected && styles.reasonChipSelected]}
                        onPress={() => setSelectedReason(reason)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.reasonChipText,
                            isSelected && styles.reasonChipTextSelected,
                          ]}
                        >
                          {reason}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Location telemetry preview */}
                <View style={styles.locationPreviewBox}>
                  <MapPin size={15} color={THEME.colors.primary} />
                  <View style={styles.locationMeta}>
                    <Text style={styles.locationLabel}>LIVE LOCATION TELEMETRY</Text>
                    <Text style={styles.locationVal}>
                      Campus Perimeter Area (Accuracy ±5m)
                    </Text>
                  </View>
                </View>

                {/* Big Red SOS Beacon Button */}
                <View style={styles.sosButtonWrapper}>
                  <TouchableOpacity
                    style={styles.sosBigButton}
                    onPress={handleActivateSOS}
                    activeOpacity={0.8}
                  >
                    <AlertOctagon size={42} color="#FFFFFF" />
                    <Text style={styles.sosBigText}>ACTIVATE SOS</Text>
                    <Text style={styles.sosSubtext}>Tap to broadcast distress beacon</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.warningNote}>
                  ⚠️ Abuse of the SOS emergency system is subject to campus disciplinary action. Use
                  only in authentic safety or health distress.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '90%',
    backgroundColor: '#111827',
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    borderColor: '#1F2937',
    overflow: 'hidden',
    ...THEME.shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#F43F5E',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  content: {
    padding: 16,
  },
  untriggeredContainer: {
    gap: 14,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  reasonsList: {
    gap: 6,
  },
  reasonChip: {
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  reasonChipSelected: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: '#F43F5E',
  },
  reasonChipText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },
  reasonChipTextSelected: {
    color: '#F43F5E',
    fontWeight: '700',
  },
  locationPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 8,
  },
  locationMeta: {
    flex: 1,
  },
  locationLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
  },
  locationVal: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  sosButtonWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  sosBigButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FB7185',
    ...THEME.shadows.glowDanger,
  },
  sosBigText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 6,
  },
  sosSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 9,
    marginTop: 2,
  },
  warningNote: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 12,
  },
  activeAlertCard: {
    backgroundColor: '#0F172A',
    borderRadius: THEME.radius.lg,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
  },
  pulseIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
  activeAlertTitle: {
    color: '#F43F5E',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activeAlertDesc: {
    color: '#CBD5E1',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  telemetryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: THEME.radius.sm,
    width: '100%',
    gap: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  telemetryMeta: {
    flex: 1,
  },
  telemetryLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
  },
  telemetryCoords: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 1,
  },
  telemetryDesc: {
    color: '#CBD5E1',
    fontSize: 10,
  },
  dispatchList: {
    width: '100%',
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: THEME.radius.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  dispatchTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  dispatchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dispatchText: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  callHotlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    width: '100%',
    gap: 6,
    ...THEME.shadows.glowDanger,
  },
  callHotlineText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  dismissBtn: {
    paddingVertical: 6,
  },
  dismissBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
});


