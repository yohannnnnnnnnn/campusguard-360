import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { THEME } from '../styles/theme';
import { PassStatusBadge } from './PassStatusBadge';
import { ShieldCheck, Phone, Cpu, MapPin, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react-native';

export function StudentIDCard({ student }) {
  const [expanded, setExpanded] = useState(false);

  if (!student) return null;

  return (
    <View style={styles.cardContainer}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.collegeBrand}>
          <ShieldCheck size={16} color="#38BDF8" />
          <View>
            <Text style={styles.collegeTitle}>CAMPUSGUARD 360 ACADEMIA</Text>
            <Text style={styles.collegeSubtitle}>STUDENT DIGITAL SMART IDENTITY CARD</Text>
          </View>
        </View>
        <View style={styles.chipGraphic}>
          <Cpu size={16} color="#F59E0B" />
        </View>
      </View>

      {/* Main Student Info */}
      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: student.photoUrl }} style={styles.avatarImage} />
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={12} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.studentMeta}>
          <Text style={styles.studentName}>{student.name}</Text>
          <View style={styles.rollBadge}>
            <Text style={styles.rollNoText}>ROLL: {student.rollNo}</Text>
          </View>
          <Text style={styles.deptText}>{student.department}</Text>
          <Text style={styles.sectionText}>{student.section || 'Sec A'} • {student.year}</Text>
        </View>
      </View>

      {/* Status Row */}
      <View style={styles.statusRow}>
        <PassStatusBadge status={student.status} size="sm" />
        <View style={styles.deptBadge}>
          <GraduationCap size={12} color="#38BDF8" />
          <Text style={styles.deptBadgeText}>{student.section || 'Day Scholar'}</Text>
        </View>
      </View>

      {/* Expandable Details */}
      {expanded && (
        <View style={styles.expandedSection}>
          <View style={styles.divider} />
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Blood Group</Text>
              <Text style={styles.detailValueHighlight}>{student.bloodGroup}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Registered Vehicle</Text>
              <Text style={styles.detailValue}>{student.vehicleNo || 'None'}</Text>
            </View>
          </View>

          <View style={styles.emergencyContactBox}>
            <Phone size={14} color="#F43F5E" />
            <View style={styles.emergencyMeta}>
              <Text style={styles.emergencyLabel}>Guardian Emergency Contact</Text>
              <Text style={styles.emergencyName}>
                {student.emergencyContactName} • {student.emergencyContactPhone}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Toggle View More */}
      <TouchableOpacity
        style={styles.expandToggle}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.expandToggleText}>
          {expanded ? 'Hide Details' : 'View Emergency & Vehicle Details'}
        </Text>
        {expanded ? (
          <ChevronUp size={14} color="#94A3B8" />
        ) : (
          <ChevronDown size={14} color="#94A3B8" />
        )}
      </TouchableOpacity>

      {/* Holographic Strip */}
      <View style={styles.hologramStripe}>
        <Text style={styles.hologramText}>
          CAMPUS ACCESS SMART CARD • VERIFIED STUDENT
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: '#1F2937',
    overflow: 'hidden',
    ...THEME.shadows.md,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  collegeBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collegeTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  collegeSubtitle: {
    color: '#38BDF8',
    fontSize: 8,
    fontWeight: '700',
  },
  chipGraphic: {
    padding: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  profileRow: {
    flexDirection: 'row',
    padding: 14,
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: THEME.radius.md,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0284C7',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  studentMeta: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  rollBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
  },
  rollNoText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  deptText: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
  },
  sectionText: {
    color: '#94A3B8',
    fontSize: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  deptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  deptBadgeText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
  },
  expandedSection: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginBottom: 4,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '600',
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  detailValueHighlight: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  emergencyContactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    padding: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    gap: 8,
  },
  emergencyMeta: {
    flex: 1,
  },
  emergencyLabel: {
    color: '#F43F5E',
    fontSize: 9,
    fontWeight: '700',
  },
  emergencyName: {
    color: '#FECDD3',
    fontSize: 11,
    fontWeight: '600',
  },
  expandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    gap: 4,
  },
  expandToggleText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  hologramStripe: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    paddingVertical: 4,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(56, 189, 248, 0.2)',
  },
  hologramText: {
    color: '#38BDF8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

