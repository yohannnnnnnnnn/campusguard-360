import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { THEME } from '../styles/theme';
import { useApp } from '../context/AppContext';
import { generateDynamicToken, verifyDynamicToken } from '../services/qrSecurity';
import { playSound } from '../services/soundService';
import jsQR from 'jsqr';
import {
  Camera,
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Clock,
  Sparkles,
} from 'lucide-react-native';

export function ScannerModal({ visible, onClose }) {
  const {
    students,
    passes,
    activeGate,
    processGateMovement,
    activeStudent,
    activeStudentPass,
  } = useApp();

  const [scanResult, setScanResult] = useState(null);
  const [manualQuery, setManualQuery] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [scanLinePos, setScanLinePos] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const canvasRef = useRef(null);

  // Animated laser scan line
  useEffect(() => {
    if (!visible || !isScanning) return;
    const interval = setInterval(() => {
      setScanLinePos((prev) => (prev >= 200 ? 0 : prev + 6));
    }, 40);
    return () => clearInterval(interval);
  }, [visible, isScanning]);

  // Real-Time Camera Stream Initialization on Web
  useEffect(() => {
    if (!visible || !isScanning) {
      stopCamera();
      return;
    }

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      startWebCamera();
    }

    return () => {
      stopCamera();
    };
  }, [visible, isScanning]);

  const startWebCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        requestAnimationFrame(tickScan);
      }
    } catch (err) {
      console.log('Camera access notice:', err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Continuous frame scanner loop
  const tickScan = () => {
    if (!videoRef.current || !visible || !isScanning) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      if (!canvasRef.current && typeof document !== 'undefined') {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data) {
            try {
              let parsed = code.data;
              try {
                parsed = JSON.parse(code.data);
              } catch (e) {
                // String format
              }
              handleVerifyPayload(parsed);
              return;
            } catch (err) {
              console.error('Scan parse error', err);
            }
          }
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(tickScan);
  };

  // Reset state when opening
  useEffect(() => {
    if (visible) {
      setScanResult(null);
      setIsScanning(true);
      setManualQuery('');
    }
  }, [visible]);

  // Handle QR code validation
  const handleVerifyPayload = (payload) => {
    const result = verifyDynamicToken(payload, passes, students);
    setScanResult(result);
    setIsScanning(false);
    stopCamera();

    if (result.isValid) {
      playSound(result.isPastCurfew ? 'scan_error' : 'scan_success');
    } else {
      playSound('scan_error');
    }
  };

  // Test Simulation 1: Scan Active Student Pass
  const handleTestScanActive = () => {
    if (!activeStudentPass || !activeStudent) {
      alert('No active pass found for student. Request or approve one first in Student / Proctor tab.');
      return;
    }
    const token = generateDynamicToken(activeStudentPass, activeStudent);
    handleVerifyPayload(token.payloadObj);
  };

  // Test Simulation 2: Scan Return (Late / Overdue)
  const handleTestScanOverdue = () => {
    const overduePass = {
      ...activeStudentPass,
      id: 'GP-2026-9999',
      passType: 'DAY_PASS',
      status: 'CHECKED_OUT',
      expectedReturnTime: '01:00 PM',
      destination: 'Downtown Coding Hub',
      purpose: 'Technical Hackathon',
    };
    const token = generateDynamicToken(overduePass, activeStudent);
    handleVerifyPayload({
      ...token.payloadObj,
      passId: 'GP-2026-9999',
      expectedReturnTime: '01:00 PM',
    });
  };

  // Test Simulation 3: Fake / Expired Screenshot (>2 mins)
  const handleTestScanFake = () => {
    const fakePayload = {
      passId: 'GP-FAKE-8888',
      studentId: 'fake-stu',
      rollNo: '21CS099',
      validUntil: '2025-01-01T00:00:00Z',
      timeSlice: 100000,
      signature: 'INVALID_SIGNATURE_TAMPERED',
    };
    handleVerifyPayload(fakePayload);
  };

  // Manual Roll No Lookup
  const handleManualSearch = () => {
    if (!manualQuery.trim()) return;
    const foundStudent = students.find(
      (s) =>
        s.rollNo.toLowerCase() === manualQuery.trim().toLowerCase() ||
        s.name.toLowerCase().includes(manualQuery.trim().toLowerCase())
    );

    if (foundStudent) {
      const studentPass = passes.find((p) => p.studentId === foundStudent.id);
      setScanResult({
        isValid: true,
        student: foundStudent,
        pass: studentPass || null,
        timeSliceValid: true,
        isPastCurfew: false,
        verificationMessage: studentPass
          ? 'Identity & digital pass record verified via college database lookup.'
          : 'Student identity verified. No active outpass record found.',
      });
      setIsScanning(false);
      stopCamera();
      playSound('scan_success');
    } else {
      setScanResult({
        isValid: false,
        student: null,
        pass: null,
        timeSliceValid: false,
        isPastCurfew: false,
        verificationMessage: `No student record found for '${manualQuery}'.`,
      });
      setIsScanning(false);
      stopCamera();
      playSound('scan_error');
    }
  };

  // Authorize Movement
  const handleAuthorizeMovement = (direction) => {
    if (!scanResult || !scanResult.student) return;
    processGateMovement({
      studentId: scanResult.student.id,
      passId: scanResult.pass ? scanResult.pass.id : 'MANUAL-ENTRY',
      direction,
      remarks: scanResult.isPastCurfew ? '⚠️ Cleared with late return curfew penalty' : 'Normal verification',
    });
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Camera size={18} color={THEME.colors.primary} />
              <Text style={styles.modalTitle}>REAL-TIME GATE SCANNER</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {isScanning ? (
              <View style={styles.scannerBody}>
                {/* Live Real-Time Video Camera Viewfinder */}
                <View style={styles.reticleOuter}>
                  {Platform.OS === 'web' && (
                    <video
                      ref={videoRef}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 16,
                      }}
                      muted
                      playsInline
                    />
                  )}

                  {/* Cyber Reticle Overlay */}
                  <View style={styles.reticleBox}>
                    <View style={[styles.reticleCorner, styles.cTopLeft]} />
                    <View style={[styles.reticleCorner, styles.cTopRight]} />
                    <View style={[styles.reticleCorner, styles.cBottomLeft]} />
                    <View style={[styles.reticleCorner, styles.cBottomRight]} />

                    {/* Glowing Laser Scan Line */}
                    <View style={[styles.laserLine, { top: scanLinePos }]} />

                    {!cameraActive && (
                      <View style={styles.cameraOffPlaceholder}>
                        <Camera size={36} color={THEME.colors.primary} />
                        <Text style={styles.reticlePrompt}>
                          POINT CAMERA AT DYNAMIC QR CODE
                        </Text>
                        <Text style={styles.reticleSub}>
                          Auto-detects live 2-minute rolling tokens
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {cameraActive && (
                  <View style={styles.cameraLiveBadge}>
                    <View style={styles.livePulseDot} />
                    <Text style={styles.cameraLiveText}>REAL-TIME CAMERA STREAM ACTIVE</Text>
                  </View>
                )}

                {/* 1-Click Fast Simulation Scanners for Demo */}
                <View style={styles.testSection}>
                  <View style={styles.testHeader}>
                    <Sparkles size={12} color={THEME.colors.primary} />
                    <Text style={styles.testSectionTitle}>1-TAP TEST SCENARIO SIMULATORS</Text>
                  </View>

                  <View style={styles.testGrid}>
                    <TouchableOpacity
                      style={styles.testBtnGreen}
                      onPress={handleTestScanActive}
                      activeOpacity={0.8}
                    >
                      <CheckCircle size={13} color="#059669" />
                      <Text style={styles.testBtnGreenText}>🟢 Scan Active Pass</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.testBtnOrange}
                      onPress={handleTestScanOverdue}
                      activeOpacity={0.8}
                    >
                      <Clock size={13} color="#D97706" />
                      <Text style={styles.testBtnOrangeText}>⚠️ Scan Late Return</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.testBtnRed}
                      onPress={handleTestScanFake}
                      activeOpacity={0.8}
                    >
                      <AlertTriangle size={13} color="#DC2626" />
                      <Text style={styles.testBtnRedText}>🔴 Test Expired / Fake</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Manual Roll Number Lookup */}
                <View style={styles.manualBox}>
                  <Text style={styles.manualLabel}>OR MANUAL ROLL NUMBER SEARCH</Text>
                  <View style={styles.searchRow}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="e.g. 22CS1042 or Moinuddin"
                      placeholderTextColor={THEME.colors.textMuted}
                      value={manualQuery}
                      onChangeText={setManualQuery}
                      onSubmitEditing={handleManualSearch}
                    />
                    <TouchableOpacity style={styles.searchBtn} onPress={handleManualSearch}>
                      <Search size={14} color="#FFFFFF" />
                      <Text style={styles.searchBtnText}>VERIFY</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              /* SCAN RESULT VERIFICATION CARD */
              <View style={styles.resultCard}>
                {scanResult.isValid ? (
                  <View style={styles.validHeader}>
                    <CheckCircle size={22} color={THEME.colors.success} />
                    <Text style={styles.validTitle}>DIGITAL IDENTITY VERIFIED</Text>
                  </View>
                ) : (
                  <View style={styles.invalidHeader}>
                    <XCircle size={22} color={THEME.colors.danger} />
                    <Text style={styles.invalidTitle}>VERIFICATION FAILED / EXPIRED</Text>
                  </View>
                )}

                {/* Student Photo & Profile Sheet */}
                {scanResult.student && (
                  <View style={styles.profileSheet}>
                    <Image source={{ uri: scanResult.student.photoUrl }} style={styles.studentPhoto} />
                    <View style={styles.studentDetails}>
                      <Text style={styles.studentName}>{scanResult.student.name}</Text>
                      <Text style={styles.studentRoll}>ROLL NO: {scanResult.student.rollNo}</Text>
                      <Text style={styles.studentDept}>{scanResult.student.department}</Text>
                      <Text style={styles.studentMeta}>
                        {scanResult.student.section || 'Sec A'} • {scanResult.student.year || '3rd Year'}
                      </Text>
                      {scanResult.student.vehicleNo && scanResult.student.vehicleNo !== 'None' && (
                        <Text style={styles.studentVehicle}>
                          🚗 Vehicle: {scanResult.student.vehicleNo}
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                {/* Pass Details */}
                {scanResult.pass && (
                  <View style={styles.passInfoBox}>
                    <Text style={styles.passInfoTitle}>
                      PASS #{scanResult.pass.id} • {scanResult.pass.passType.replace('_', ' ')}
                    </Text>
                    <Text style={styles.passDest}>📍 Destination: {scanResult.pass.destination}</Text>
                    <Text style={styles.passPurp}>Reason: "{scanResult.pass.purpose}"</Text>
                    <Text style={styles.passExpected}>
                      Expected Return: {scanResult.pass.expectedReturnTime || '05:30 PM'}
                    </Text>
                  </View>
                )}

                {/* Authorization Action Buttons */}
                {scanResult.isValid && (
                  <View style={styles.authBtnRow}>
                    <TouchableOpacity
                      style={styles.exitBtn}
                      onPress={() => handleAuthorizeMovement('EXIT')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.exitBtnText}>✓ AUTHORIZE EXIT</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.entryBtn}
                      onPress={() => handleAuthorizeMovement('ENTRY')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.entryBtnText}>✓ AUTHORIZE ENTRY</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Scan Another Button */}
                <TouchableOpacity
                  style={styles.rescanBtn}
                  onPress={() => {
                    setScanResult(null);
                    setIsScanning(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.rescanBtnText}>SCAN NEXT STUDENT</Text>
                </TouchableOpacity>
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    backgroundColor: '#0F172A',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  scannerBody: {
    alignItems: 'center',
    gap: 12,
  },
  reticleOuter: {
    width: 250,
    height: 250,
    backgroundColor: '#090D16',
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#1F2937',
  },
  reticleBox: {
    width: 200,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#38BDF8',
  },
  cTopLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cTopRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cBottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cBottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  laserLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  cameraOffPlaceholder: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  reticlePrompt: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  reticleSub: {
    color: '#94A3B8',
    fontSize: 9,
    textAlign: 'center',
  },
  cameraLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    gap: 6,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  cameraLiveText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
  },
  testSection: {
    width: '100%',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 6,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  testSectionTitle: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  testGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  testBtnGreen: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    gap: 4,
  },
  testBtnGreenText: { color: '#10B981', fontSize: 10, fontWeight: '700' },
  testBtnOrange: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    gap: 4,
  },
  testBtnOrangeText: { color: '#F59E0B', fontSize: 10, fontWeight: '700' },
  testBtnRed: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    gap: 4,
  },
  testBtnRedText: { color: '#F43F5E', fontSize: 10, fontWeight: '700' },
  manualBox: {
    width: '100%',
    gap: 6,
  },
  manualLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 6,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 11,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    borderRadius: THEME.radius.sm,
    gap: 4,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  resultCard: {
    gap: 12,
  },
  validHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: 10,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    gap: 8,
  },
  validTitle: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  invalidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    padding: 10,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
    gap: 8,
  },
  invalidTitle: {
    color: '#F43F5E',
    fontSize: 12,
    fontWeight: '800',
  },
  profileSheet: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 12,
  },
  studentPhoto: {
    width: 64,
    height: 64,
    borderRadius: THEME.radius.md,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  studentDetails: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  studentRoll: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  studentDept: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  studentMeta: {
    color: '#94A3B8',
    fontSize: 10,
  },
  studentVehicle: {
    color: '#F59E0B',
    fontSize: 10,
    marginTop: 2,
  },
  passInfoBox: {
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 3,
  },
  passInfoTitle: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  passDest: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  passPurp: {
    color: '#94A3B8',
    fontSize: 10,
    fontStyle: 'italic',
  },
  passExpected: {
    color: '#F59E0B',
    fontSize: 10,
  },
  authBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  exitBtn: {
    flex: 1,
    backgroundColor: '#0284C7',
    paddingVertical: 11,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    ...THEME.shadows.glowPrimary,
  },
  exitBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  entryBtn: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 11,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    ...THEME.shadows.glowSuccess,
  },
  entryBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  rescanBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rescanBtnText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
  },
});
