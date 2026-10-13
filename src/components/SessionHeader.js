import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { THEME } from '../styles/theme';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Shield,
  Building2,
  Users,
  LogOut,
  Radio,
  CheckCircle,
} from 'lucide-react-native';

export function SessionHeader({ onLogout }) {
  const { currentRole, activeStudent, activeGate } = useApp();

  const getRoleConfig = () => {
    switch (currentRole) {
      case 'STUDENT':
        return {
          title: activeStudent.name,
          subtitle: `ROLL: ${activeStudent.rollNo} • ${activeStudent.department} (${activeStudent.section || 'Sec A'})`,
          roleBadge: 'STUDENT PORTAL',
          icon: GraduationCap,
          color: '#38BDF8',
          bgColor: 'rgba(56, 189, 248, 0.12)',
          borderColor: 'rgba(56, 189, 248, 0.35)',
        };
      case 'SECURITY':
        return {
          title: 'Sgt. Vikram Singh',
          subtitle: `BADGE: #SEC-08 • ${activeGate.name}`,
          roleBadge: 'GATE SECURITY',
          icon: Shield,
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.12)',
          borderColor: 'rgba(16, 185, 129, 0.35)',
        };
      case 'ADMIN':
        return {
          title: 'Dr. S. K. Narayan',
          subtitle: 'Chief Proctor & Head of Campus Discipline',
          roleBadge: 'CHIEF PROCTOR',
          icon: Building2,
          color: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.12)',
          borderColor: 'rgba(245, 158, 11, 0.35)',
        };
      case 'PARENT':
        return {
          title: `${activeStudent.emergencyContactName} (Parent)`,
          subtitle: `Ward: ${activeStudent.name} (${activeStudent.rollNo})`,
          roleBadge: 'PARENT PORTAL',
          icon: Users,
          color: '#A855F7',
          bgColor: 'rgba(168, 85, 247, 0.12)',
          borderColor: 'rgba(168, 85, 247, 0.35)',
        };
      default:
        return {
          title: 'CampusGuard User',
          subtitle: 'Authenticated Session',
          roleBadge: 'USER',
          icon: Shield,
          color: '#38BDF8',
          bgColor: 'rgba(56, 189, 248, 0.12)',
          borderColor: 'rgba(56, 189, 248, 0.35)',
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftMeta}>
        <View style={[styles.iconWrapper, { backgroundColor: config.bgColor, borderColor: config.borderColor }]}>
          <Icon size={18} color={config.color} />
        </View>

        <View style={styles.textGroup}>
          <View style={styles.topRow}>
            <Text style={styles.userName}>{config.title}</Text>
            <View style={[styles.roleBadge, { backgroundColor: config.bgColor, borderColor: config.borderColor }]}>
              <Text style={[styles.roleBadgeText, { color: config.color }]}>
                {config.roleBadge}
              </Text>
            </View>
          </View>
          <Text style={styles.userSubtitle} numberOfLines={1}>
            {config.subtitle}
          </Text>
        </View>
      </View>

      {/* Log Out / Switch Role Action */}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.75}>
        <LogOut size={13} color="#F43F5E" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    ...THEME.shadows.sm,
  },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  roleBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  userSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    gap: 5,
  },
  logoutText: {
    color: '#F43F5E',
    fontSize: 11,
    fontWeight: '700',
  },
});

