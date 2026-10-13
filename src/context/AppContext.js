import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_STUDENTS,
  INITIAL_PASSES,
  INITIAL_GATES,
  INITIAL_GATE_LOGS,
  INITIAL_SOS_ALERTS,
  COLLEGE_SETTINGS,
} from '../services/mockData';
import { playSound } from '../services/soundService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('STUDENT'); // 'STUDENT' | 'SECURITY' | 'ADMIN' | 'PARENT'
  const [selectedStudentId, setSelectedStudentId] = useState('STU-2022-1042');
  const [currentGateId, setCurrentGateId] = useState('GATE-01');

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [passes, setPasses] = useState(INITIAL_PASSES);
  const [gates, setGates] = useState(INITIAL_GATES);
  const [gateLogs, setGateLogs] = useState(INITIAL_GATE_LOGS);
  const [sosAlerts, setSosAlerts] = useState(INITIAL_SOS_ALERTS);
  const [collegeSettings, setCollegeSettings] = useState(COLLEGE_SETTINGS);

  const [activeToast, setActiveToast] = useState(null);

  // Active student getter
  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const activeStudentPass = passes.find(
    (p) =>
      p.studentId === activeStudent.id &&
      (p.status === 'APPROVED' || p.status === 'CHECKED_OUT' || p.status === 'PENDING_APPROVAL')
  );
  const activeGate = gates.find((g) => g.id === currentGateId) || gates[0];

  // Show Toast Notification
  const showToast = (title, message, type = 'info') => {
    const id = Date.now().toString();
    setActiveToast({ id, title, message, type });
    if (type === 'danger' || type === 'sos') {
      playSound('sos_alert');
    } else if (type === 'success') {
      playSound('approve_chime');
    } else {
      playSound('action_click');
    }

    setTimeout(() => {
      setActiveToast((current) => (current && current.id === id ? null : current));
    }, 4500);
  };

  // Switch role with feedback
  const switchRole = (role) => {
    setCurrentRole(role);
    playSound('action_click');
    const roleLabels = {
      STUDENT: '🎓 Student',
      SECURITY: '🛡️ Gate Security',
      ADMIN: '🏛️ Chief Proctor',
      PARENT: '👨‍👩‍👧 Parent',
    };
    showToast('Role Switched', `Viewing as ${roleLabels[role] || role}`, 'info');
  };

  // Request a new Gate Pass / Permission
  const requestPass = ({
    passType,
    purpose,
    destination,
    validFrom,
    validUntil,
    parentConsentRequired = false,
    emergencyContact,
  }) => {
    const newPassId = `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPass = {
      id: newPassId,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      rollNo: activeStudent.rollNo,
      passType,
      purpose,
      destination,
      validFrom: validFrom || new Date().toISOString(),
      validUntil: validUntil || new Date(Date.now() + 3600000 * 4).toISOString(),
      expectedReturnTime: '05:30 PM',
      status: 'PENDING_APPROVAL',
      parentConsentRequired,
      parentConsentStatus: parentConsentRequired ? 'PENDING' : 'NOT_APPLICABLE',
      approvedBy: null,
      approvalTimestamp: null,
      adminNotes: '',
      exitGateTime: null,
      entryGateTime: null,
      exitGateName: null,
      entryGateName: null,
      emergencyContact: emergencyContact || activeStudent.emergencyContactPhone,
    };

    setPasses((prev) => [newPass, ...prev]);
    setStudents((prev) =>
      prev.map((s) => (s.id === activeStudent.id ? { ...s, currentPassId: newPassId } : s))
    );

    playSound('action_click');
    showToast(
      'Permission Request Submitted',
      `Gate pass #${newPassId} sent to Chief Proctor for review.`,
      'success'
    );
    return newPass;
  };

  // Approve Gate Pass (Chief Proctor)
  const approvePass = (passId, adminNotes = 'Approved by Chief Proctor & Discipline Office.') => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              status: 'APPROVED',
              approvedBy: 'Dr. S. K. Narayan (Chief Proctor)',
              approvalTimestamp: new Date().toISOString(),
              adminNotes,
            }
          : p
      )
    );

    showToast(
      'Gate Pass Approved',
      `Pass #${passId} approved. Dynamic QR code is now live and ready for gate verification.`,
      'success'
    );
  };

  // Reject Gate Pass (Chief Proctor)
  const rejectPass = (passId, reason = 'Permission not granted during official lecture hours.') => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              status: 'REJECTED',
              approvedBy: 'Chief Proctor Office',
              approvalTimestamp: new Date().toISOString(),
              adminNotes: `REJECTED: ${reason}`,
            }
          : p
      )
    );

    showToast('Pass Rejected', `Pass #${passId} has been rejected. Student notified.`, 'warning');
  };

  // Parent Consent Approval
  const grantParentConsent = (passId) => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              parentConsentStatus: 'GRANTED',
            }
          : p
      )
    );
    showToast('Parent Consent Confirmed', `Parent authorization recorded via OTP for Pass #${passId}.`, 'success');
  };

  // Process Gate Scan / Check-Out or Check-In (Security Guard)
  const processGateMovement = ({
    studentId,
    passId,
    direction, // 'EXIT' | 'ENTRY'
    guardNotes = '',
    isLate = false,
    suspiciousFlag = false,
  }) => {
    const student = students.find((s) => s.id === studentId);
    const pass = passes.find((p) => p.id === passId);
    const timestamp = new Date().toISOString();
    const newLogId = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLog = {
      id: newLogId,
      timestamp,
      studentId: student?.id || studentId,
      studentName: student?.name || 'Unknown Student',
      rollNo: student?.rollNo || 'N/A',
      direction,
      gateId: activeGate.id,
      gateName: activeGate.name,
      guardName: activeGate.guardOnDuty,
      passId: passId || 'NONE',
      passType: pass?.passType || 'CAMPUS_ENTRY',
      verificationMethod: 'DYNAMIC_QR_TOKEN_VERIFIED',
      verificationStatus: suspiciousFlag
        ? 'SUSPICIOUS_FLAGGED'
        : isLate
        ? 'OVERDUE_WARNING'
        : 'AUTHORIZED_NORMAL',
      vehicleNo: student?.vehicleNo || 'None',
      notes: guardNotes || (direction === 'EXIT' ? 'Checked out via gate.' : 'Returned to campus.'),
    };

    // Update Gate Logs
    setGateLogs((prev) => [newLog, ...prev]);

    // Update Student Status
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            status: direction === 'EXIT' ? 'OFF_CAMPUS' : 'ON_CAMPUS',
            lastLocation: `${direction === 'EXIT' ? 'Checked out via' : 'Entered via'} ${activeGate.name}`,
          };
        }
        return s;
      })
    );

    // Update Pass Status
    if (passId && pass) {
      setPasses((prev) =>
        prev.map((p) => {
          if (p.id === passId) {
            if (direction === 'EXIT') {
              return {
                ...p,
                status: 'CHECKED_OUT',
                exitGateTime: timestamp,
                exitGateName: activeGate.name,
              };
            } else {
              return {
                ...p,
                status: 'COMPLETED',
                entryGateTime: timestamp,
                entryGateName: activeGate.name,
              };
            }
          }
          return p;
        })
      );
    }

    playSound(suspiciousFlag || isLate ? 'scan_error' : 'scan_success');

    if (direction === 'EXIT') {
      showToast(
        'Exit Verified & Logged',
        `${student?.name} (${student?.rollNo}) verified out at ${activeGate.name}. SMS sent to parent.`,
        'success'
      );
    } else {
      showToast(
        isLate ? 'Overdue Return Logged' : 'Entry Verified & Logged',
        `${student?.name} marked safely on-campus at ${activeGate.name}.${isLate ? ' (Late arrival flagged)' : ''}`,
        isLate ? 'warning' : 'success'
      );
    }
  };

  // Trigger Emergency SOS
  const triggerSOS = ({
    reason = 'Medical Emergency / Distress',
    location = 'College Campus Perimeter',
    coordinates = '12.9716° N, 77.5946° E',
  }) => {
    const alertId = `SOS-${Math.floor(100 + Math.random() * 900)}`;
    const newAlert = {
      id: alertId,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      rollNo: activeStudent.rollNo,
      timestamp: new Date().toISOString(),
      location,
      coordinates,
      reason,
      status: 'ACTIVE',
      resolvedBy: null,
      resolutionNotes: '',
    };

    setSosAlerts((prev) => [newAlert, ...prev]);
    playSound('sos_alert');
    showToast(
      '🚨 EMERGENCY SOS BROADCASTED',
      `Distress beacon active for ${activeStudent.name}. Campus Security & College Admin alerted.`,
      'danger'
    );
  };

  // Resolve Emergency SOS
  const resolveSOS = (alertId, resolutionNotes = 'Student verified safe.') => {
    setSosAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'RESOLVED',
              resolvedBy: 'Campus Security Quick Response Team',
              resolutionNotes,
            }
          : a
      )
    );
    showToast('SOS Alert Resolved', `Incident #${alertId} marked resolved.`, 'info');
  };

  // Reset demo state
  const resetDemoState = () => {
    setStudents(INITIAL_STUDENTS);
    setPasses(INITIAL_PASSES);
    setGateLogs(INITIAL_GATE_LOGS);
    setSosAlerts(INITIAL_SOS_ALERTS);
    setSelectedStudentId('STU-2022-1042');
    showToast('Demo Reset', 'Data restored to initial demo state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        switchRole,
        selectedStudentId,
        setSelectedStudentId,
        activeStudent,
        activeStudentPass,
        currentGateId,
        setCurrentGateId,
        activeGate,
        gates,
        students,
        passes,
        gateLogs,
        sosAlerts,
        collegeSettings,
        activeToast,
        showToast,
        requestPass,
        approvePass,
        rejectPass,
        grantParentConsent,
        processGateMovement,
        triggerSOS,
        resolveSOS,
        resetDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
