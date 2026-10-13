import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { THEME } from '../styles/theme';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Shield,
  Building2,
  Users,
  ChevronDown,
  RotateCcw,
  LogOut,
} from 'lucide-react-native';

export function RoleSwitcher({ onLogout }) {
  const {
    currentRole,
    switchRole,
    students,
    selectedStudentId,
    setSelectedStudentId,
    activeStudent,
    resetDemoState,
  } = useApp();

  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const roles = [
    { key: 'STUDENT', label: 'Student', icon: GraduationCap, color: THEME.colors.cyan },
    { key: 'SECURITY', label: 'Security', icon: Shield, color: THEME.colors.primaryLight },
    { key: 'ADMIN', label: 'Proctor', icon: Building2, color: THEME.colors.warning },
    { key: 'PARENT', label: 'Parent', icon: Users, color: '#C084FC' },
  ];

  return (
    <View style={styles.container}>
      {/* Sleek Segmented Role Pills */}
      <View style={styles.segmentedTrack}>
        {roles.map((r) => {
          const isActive = currentRole === r.key;
          const Icon = r.icon;
          return (
            <TouchableOpacity
              key={r.key}
              style={[
                styles.segmentBtn,
                isActive && styles.segmentBtnActive,
              ]}
              onPress={() => switchRole(r.key)}
              activeOpacity={0.8}
            >
              <Icon size={14} color={isActive ? r.color : THEME.colors.textMuted} />
              <Text
                style={[
                  styles.segmentText,
                  isActive && { color: '#FFFFFF', fontWeight: '700' },
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sub-bar with Active Student Profile & Portal Switcher */}
      <View style={styles.subBar}>
        <TouchableOpacity
          style={styles.studentSelectorBtn}
          onPress={() => setShowStudentPicker(!showStudentPicker)}
          activeOpacity={0.7}
        >
          <View style={styles.studentAvatarDot} />
          <Text style={styles.studentSelectorLabel}>STUDENT:</Text>
          <Text style={styles.studentSelectorName}>{activeStudent.name}</Text>
          <Text style={styles.studentSelectorRoll}>({activeStudent.rollNo})</Text>
          <ChevronDown size={12} color={THEME.colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.subBarRight}>
          {onLogout && (
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.7}>
              <LogOut size={11} color={THEME.colors.warning} />
              <Text style={styles.logoutText}>Portal Login</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.resetBtn} onPress={resetDemoState} activeOpacity={0.7}>
            <RotateCcw size={11} color={THEME.colors.textMuted} />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown for Student Selection */}
      {showStudentPicker && (
        <View style={styles.pickerDropdown}>
          <Text style={styles.pickerTitle}>SELECT STUDENT PROFILE</Text>
          {students.map((s) => {
            const isSel = s.id === selectedStudentId;
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.pickerItem, isSel && styles.pickerItemSel]}
                onPress={() => {
                  setSelectedStudentId(s.id);
                  setShowStudentPicker(false);
                }}
              >
                <View style={styles.pickerItemLeft}>
                  <Text style={[styles.pickerItemName, isSel && { color: THEME.colors.cyan }]}>
                    {s.name} <Text style={styles.pickerRoll}>({s.rollNo})</Text>
                  </Text>
                  <Text style={styles.pickerItemMeta}>
                    {s.department} • {s.section}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor:
                        s.status === 'ON_CAMPUS' ? THEME.colors.successBg : THEME.colors.warningBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      {
                        color:
                          s.status === 'ON_CAMPUS' ? THEME.colors.success : THEME.colors.warning,
                      },
                    ]}
                  >
                    {s.status === 'ON_CAMPUS' ? 'On Campus' : 'Off Campus'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B101D',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
  },
  segmentedTrack: {
    flexDirection: 'row',
    backgroundColor: '#121929',
    borderRadius: THEME.radius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: THEME.radius.sm,
    gap: 5,
  },
  segmentBtnActive: {
    backgroundColor: '#1A243B',
    borderWidth: 1,
    borderColor: 'rgba(58, 134, 255, 0.4)',
    shadowColor: '#3A86FF',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  subBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studentSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#121929',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  studentAvatarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.cyan,
  },
  studentSelectorLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  studentSelectorName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  studentSelectorRoll: {
    color: THEME.colors.cyan,
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  logoutText: {
    color: THEME.colors.warning,
    fontSize: 10,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  resetText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
  pickerDropdown: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginTop: 8,
    padding: 8,
    gap: 4,
    ...THEME.shadows.md,
  },
  pickerTitle: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.sm,
  },
  pickerItemSel: {
    backgroundColor: 'rgba(58, 134, 255, 0.15)',
  },
  pickerItemLeft: {
    flex: 1,
  },
  pickerItemName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pickerRoll: {
    color: THEME.colors.cyan,
    fontSize: 10,
  },
  pickerItemMeta: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  statusPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
