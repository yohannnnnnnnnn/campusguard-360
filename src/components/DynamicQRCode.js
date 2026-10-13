import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import QRCode from 'qrcode';
import { generateDynamicToken } from '../services/qrSecurity';
import { THEME } from '../styles/theme';
import { ShieldCheck, RefreshCw, Clock, Lock, Sparkles, Cpu } from 'lucide-react-native';

export function DynamicQRCode({ pass, student }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update token every second and generate QR
  useEffect(() => {
    let isMounted = true;

    const updateQR = async () => {
      if (!pass || !student) return;

      const info = generateDynamicToken(pass, student);
      if (!info) return;

      setTokenInfo(info);
      setCurrentTime(new Date());

      try {
        const dataUrl = await QRCode.toDataURL(info.rawPayload, {
          width: 250,
          margin: 1,
          color: {
            dark: '#0F172A',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        if (isMounted) {
          setQrDataUrl(dataUrl);
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    updateQR();
    const interval = setInterval(updateQR, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pass?.id, student?.id, pass?.status]);

  if (!pass || !student) {
    return (
      <View style={styles.emptyContainer}>
        <Lock size={32} color={THEME.colors.textMuted} />
        <Text style={styles.emptyTitle}>No Active Gate Pass</Text>
        <Text style={styles.emptySubtitle}>
          Apply for an Outpass to generate your secure Dynamic Gate QR.
        </Text>
      </View>
    );
  }

  const secondsLeft = tokenInfo?.secondsLeft ?? 120;
  const progressPercent = ((120 - secondsLeft) / 120) * 100;
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedCountdown = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const timeFormatted = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const msFormatted = String(currentTime.getMilliseconds()).padStart(3, '0');

  return (
    <View style={styles.cardContainer}>
      {/* Top Security Header */}
      <View style={styles.securityHeader}>
        <View style={styles.securityBadge}>
          <ShieldCheck size={14} color="#38BDF8" />
          <Text style={styles.securityBadgeText}>DYNAMIC 2-MIN ROLLING PASS</Text>
        </View>

        <View style={styles.tokenTimerBadge}>
          <RefreshCw size={12} color="#38BDF8" />
          <Text style={styles.tokenTimerText}>Renews in {formattedCountdown}</Text>
        </View>
      </View>

      {/* Progress Bar for 2-Minute Window */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${100 - progressPercent}%`,
              backgroundColor: secondsLeft > 20 ? '#38BDF8' : '#F43F5E',
            },
          ]}
        />
      </View>

      {/* QR Code Container with Clean Frame */}
      <View style={styles.qrFrameWrapper}>
        <View style={styles.qrInnerBox}>
          {qrDataUrl ? (
            <Image
              source={{ uri: qrDataUrl }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.loadingBox}>
              <Text style={styles.loadingText}>Generating secure token...</Text>
            </View>
          )}

          {/* Watermark Overlay */}
          <View style={styles.watermarkOverlay} pointerEvents="none">
            <Text style={styles.watermarkText}>CAMPUSGUARD • VERIFIED</Text>
          </View>
        </View>
      </View>

      {/* Live Millisecond Clock */}
      <View style={styles.liveClockRow}>
        <Clock size={13} color="#F59E0B" />
        <Text style={styles.liveClockText}>
          LIVE SYNC: <Text style={styles.liveClockBold}>{timeFormatted}</Text>
          <Text style={styles.liveClockMs}>.{msFormatted}</Text>
        </Text>
      </View>

      {/* Security Hash & Token Info */}
      <View style={styles.tokenDetailsRow}>
        <Text style={styles.tokenLabel}>TOKEN HASH:</Text>
        <Text style={styles.tokenHash}>{tokenInfo?.signature || 'CG360_AUTH'}</Text>
        <Text style={styles.tokenWindow}>• WIN #{tokenInfo?.timeWindow || 0}</Text>
      </View>

      <Text style={styles.instructionsText}>
        Hold screen directly in front of the gate scanner. Screenshots will fail verification.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 16,
    alignItems: 'center',
    ...THEME.shadows.md,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    gap: 5,
  },
  securityBadgeText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tokenTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  tokenTimerText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  qrFrameWrapper: {
    padding: 10,
    borderRadius: THEME.radius.md,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  qrInnerBox: {
    width: 210,
    height: 210,
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  watermarkOverlay: {
    position: 'absolute',
    bottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  watermarkText: {
    color: '#0284C7',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveClockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    gap: 6,
    marginTop: 12,
  },
  liveClockText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  liveClockBold: {
    fontWeight: '800',
  },
  liveClockMs: {
    fontSize: 10,
    color: '#FCD34D',
  },
  tokenDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  tokenLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
  },
  tokenHash: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tokenWindow: {
    color: '#94A3B8',
    fontSize: 9,
  },
  instructionsText: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 14,
    paddingHorizontal: 8,
  },
  emptyContainer: {
    backgroundColor: '#111827',
    borderRadius: THEME.radius.lg,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 8,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
  },
});

