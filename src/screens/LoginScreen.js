import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { THEME } from '../styles/theme';
import { useApp } from '../context/AppContext';
import { playSound } from '../services/soundService';
import {
  GraduationCap,
  Shield,
  Building2,
  Users,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Lock,
  Radio,
  Fingerprint,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react-native';

export function LoginScreen({ onLoginSuccess }) {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    activeStudent,
    switchRole,
    showToast,
  } = useApp();

  const [selectedRoleKey, setSelectedRoleKey] = useState('STUDENT');

  const roles = [
    {
      key: 'STUDENT',
      title: 'College Student',
      subtitle: '2-Min Rolling QR Pass • Smart ID • Outpass Request • SOS Beacon',
      icon: GraduationCap,
      color: '#38BDF8',
      accentBg: 'rgba(56, 189, 248, 0.12)',
      accentBorder: 'rgba(56, 189, 248, 0.35)',
      badge: 'ALL DEPARTMENTS',
      accountName: `${activeStudent.name} (${activeStudent.rollNo})`,
      accountMeta: `${activeStudent.department} • ${activeStudent.section || 'Sec A'}`,
    },
    {
      key: 'SECURITY',
      title: 'Gate Security Personnel',
      subtitle: 'Real-Time Camera QR Scanner • Checkpoint Clearance • Gate Lockdown',
      icon: Shield,
      color: '#10B981',
      accentBg: 'rgba(16, 185, 129, 0.12)',
      accentBorder: 'rgba(16, 185, 129, 0.35)',
      badge: 'CHECKPOINT CONTROL',
      accountName: 'Sgt. Vikram Singh (Badge #SEC-08)',
      accountMeta: 'Gate 01 • Main Campus Boulevard Checkpoint',
    },
    {
      key: 'ADMIN',
      title: 'Chief Proctor Office',
      subtitle: '1-Tap Pass Approvals • Campus Presence Ledger • Emergency Command',
      icon: Building2,
      color: '#F59E0B',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      accentBorder: 'rgba(245, 158, 11, 0.35)',
      badge: 'DISCIPLINE & SAFETY',
      accountName: 'Dr. S. K. Narayan (Chief Proctor)',
      accountMeta: 'Office of Campus Discipline & Student Safety',
    },
    {
      key: 'PARENT',
      title: 'Parent & Guardian',
      subtitle: 'Live Ward Campus Status • Automated Gate SMS • Emergency Hotlines',
      icon: Users,
      color: '#A855F7',
      accentBg: 'rgba(168, 85, 247, 0.12)',
      accentBorder: 'rgba(168, 85, 247, 0.35)',
      badge: 'GUARDIAN PORTAL',
      accountName: `${activeStudent.emergencyContactName} (Parent)`,
      accountMeta: `Ward: ${activeStudent.name} (${activeStudent.rollNo})`,
    },
  ];

  const handleSelectRole = (roleKey) => {
    setSelectedRoleKey(roleKey);
    playSound('action_click');
  };

  const handleConfirmLogin = (roleKey = selectedRoleKey) => {
    switchRole(roleKey);
    playSound('approve_chime');
    showToast(
      'Authentication Successful',
      `Welcome to CampusGuard 360 (${roles.find((r) => r.key === roleKey)?.title})`,
      'success'
    );
    if (onLoginSuccess) {
      onLoginSuccess(roleKey);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Creative Brand Header */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandTitle}>CAMPUSGUARD 360</Text>
            <View style={styles.secureBadge}>
              <ShieldCheck size={11} color="#38BDF8" />
              <Text style={styles.secureBadgeText}>SECURE ACCESS</Text>
            </View>
          </View>
          <Text style={styles.heroSubtitle}>
            Smart College Campus Access & Real-Time Student Safety Ecosystem
          </Text>
        </View>

        {/* Role Selection Prompt */}
        <View style={styles.promptBar}>
          <Sparkles size={13} color="#38BDF8" />
          <Text style={styles.promptText}>SELECT YOUR CAMPUS ROLE TO LOGIN</Text>
        </View>

        {/* 4 Creative Role Cards Grid */}
        <View style={styles.rolesGrid}>
          {roles.map((r) => {
            const isSelected = selectedRoleKey === r.key;
            const Icon = r.icon;
            return (
              <TouchableOpacity
                key={r.key}
                style={[
                  styles.roleCard,
                  isSelected && {
                    borderColor: r.color,
                    backgroundColor: '#1E293B',
                    shadowColor: r.color,
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 6,
                  },
                ]}
                onPress={() => handleSelectRole(r.key)}
                activeOpacity={0.85}
              >
                {/* Top Badge & Radio */}
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.roleBadge,
                      { backgroundColor: r.accentBg, borderColor: r.accentBorder },
                    ]}
                  >
                    <Text style={[styles.roleBadgeText, { color: r.color }]}>{r.badge}</Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && { backgroundColor: r.color, borderColor: r.color },
                    ]}
                  >
                    {isSelected && <CheckCircle2 size={12} color="#FFFFFF" />}
                  </View>
                </View>

                {/* Role Icon & Title */}
                <View style={styles.roleMainRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: r.accentBg, borderColor: r.accentBorder },
                    ]}
                  >
                    <Icon size={22} color={r.color} />
                  </View>
                  <View style={styles.roleTitleGroup}>
                    <Text style={styles.roleTitle}>{r.title}</Text>
                    <Text style={styles.roleSubtitle}>{r.subtitle}</Text>
                  </View>
                </View>

                {/* User Account Info Bar */}
                <View style={styles.accountBar}>
                  <View style={styles.accountTextGroup}>
                    <Text style={styles.accountName}>{r.accountName}</Text>
                    <Text style={styles.accountMeta}>{r.accountMeta}</Text>
                  </View>
                  <Fingerprint size={16} color={isSelected ? r.color : '#94A3B8'} />
                </View>

                {/* Quick 1-Tap Direct Login Button */}
                {isSelected && (
                  <TouchableOpacity
                    style={[styles.instantEnterBtn, { backgroundColor: r.color }]}
                    onPress={() => handleConfirmLogin(r.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.instantEnterText}>LOGIN TO {r.title.toUpperCase()}</Text>
                    <ArrowRight size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Student Switcher Shortcut for Demo Testing */}
        {selectedRoleKey === 'STUDENT' && (
          <View style={styles.studentSwitchDemoBox}>
            <Text style={styles.demoStudentTitle}>DEMO: CHOOSE STUDENT PROFILE</Text>
            <View style={styles.demoStudentRow}>
              {students.map((s) => {
                const isSel = s.id === selectedStudentId;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.demoStudentChip, isSel && styles.demoStudentChipActive]}
                    onPress={() => setSelectedStudentId(s.id)}
                  >
                    <Text
                      style={[
                        styles.demoStudentChipText,
                        isSel && { color: '#38BDF8', fontWeight: '700' },
                      ]}
                    >
                      {s.name} ({s.rollNo})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Footer Security Watermark */}
        <View style={styles.footer}>
          <ShieldCheck size={12} color="#94A3B8" />
          <Text style={styles.footerText}>
            256-Bit Cryptographically Salted Dynamic Token Verification
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 14,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  logoBadge: {
    marginBottom: 4,
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    gap: 4,
  },
  secureBadgeText: {
    color: '#38BDF8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 360,
  },
  promptBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 6,
    marginTop: 4,
    ...THEME.shadows.sm,
  },
  promptText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rolesGrid: {
    width: '100%',
    maxWidth: 480,
    gap: 12,
  },
  roleCard: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.lg,
    borderWidth: 1.5,
    borderColor: '#1F2937',
    padding: 14,
    gap: 10,
    ...THEME.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitleGroup: {
    flex: 1,
  },
  roleTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  roleSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
  accountBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  accountTextGroup: {
    flex: 1,
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  accountMeta: {
    color: '#94A3B8',
    fontSize: 9,
  },
  instantEnterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    gap: 8,
    marginTop: 2,
    ...THEME.shadows.glowPrimary,
  },
  instantEnterText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  studentSwitchDemoBox: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 6,
    ...THEME.shadows.sm,
  },
  demoStudentTitle: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  demoStudentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  demoStudentChip: {
    backgroundColor: '#0F172A',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  demoStudentChipActive: {
    borderColor: 'rgba(56, 189, 248, 0.4)',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  demoStudentChipText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  footerText: {
    color: '#64748B',
    fontSize: 9,
  },
});

