import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { THEME } from './src/styles/theme';
import { SessionHeader } from './src/components/SessionHeader';
import { SplashScreen } from './src/components/SplashScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { StudentScreen } from './src/screens/StudentScreen';
import { SecurityScreen } from './src/screens/SecurityScreen';
import { AdminScreen } from './src/screens/AdminScreen';
import { ParentScreen } from './src/screens/ParentScreen';
import { Toast } from './src/components/Toast';
import { Smartphone, Maximize2, Sparkles, Play, LogOut, ShieldCheck, Radio } from 'lucide-react-native';

function MainApp() {
  const { currentRole } = useApp();
  const { width } = useWindowDimensions();
  const [deviceFrameMode, setDeviceFrameMode] = useState(width > 768);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isWide = width > 768;

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Pop-Out Animated Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Web / Desktop Header Bar */}
      {isWide && (
        <View style={styles.webNavBar}>
          <TouchableOpacity
            style={styles.webBrand}
            onPress={() => setShowSplash(true)}
            activeOpacity={0.8}
          >
            <Image
              source={require('./assets/logo.png')}
              style={styles.headerLogoImage}
              resizeMode="contain"
            />
            <View>
              <View style={styles.brandTitleRow}>
                <Text style={styles.webBrandTitle}>CAMPUSGUARD 360</Text>
                <View style={styles.liveShieldPill}>
                  <Radio size={10} color="#10B981" />
                  <Text style={styles.liveShieldText}>ACTIVE PERIMETER</Text>
                </View>
              </View>
              <Text style={styles.webBrandSub}>
                Smart College Campus Access & Real-Time Student Safety
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.webNavControls}>
            {isAuthenticated && (
              <TouchableOpacity
                style={styles.switchPortalBtn}
                onPress={() => setIsAuthenticated(false)}
                activeOpacity={0.8}
              >
                <LogOut size={12} color="#F43F5E" />
                <Text style={styles.switchPortalText}>Sign Out</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.replaySplashBtn}
              onPress={() => setShowSplash(true)}
              activeOpacity={0.8}
            >
              <Play size={12} color="#38BDF8" />
              <Text style={styles.replaySplashText}>Replay Intro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.frameToggleBtn}
              onPress={() => setDeviceFrameMode(!deviceFrameMode)}
              activeOpacity={0.8}
            >
              {deviceFrameMode ? (
                <>
                  <Maximize2 size={13} color="#CBD5E1" />
                  <Text style={styles.frameToggleText}>Full Width Mode</Text>
                </>
              ) : (
                <>
                  <Smartphone size={13} color="#CBD5E1" />
                  <Text style={styles.frameToggleText}>Mobile Frame Mode</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* App Shell Container */}
      <View
        style={[
          styles.appShell,
          isWide && deviceFrameMode ? styles.phoneFrameContainer : styles.fullFluidContainer,
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          {!isAuthenticated ? (
            /* Creative Role Selection Login Portal */
            <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
          ) : (
            /* Authenticated Role Portal Screen (Strict Role Isolation) */
            <>
              {/* Isolated Logged-in Session Header with Sign Out */}
              <SessionHeader onLogout={() => setIsAuthenticated(false)} />

              {/* Dedicated Screen Content based on Active Authenticated Persona */}
              <View style={styles.screenContainer}>
                {currentRole === 'STUDENT' && <StudentScreen />}
                {currentRole === 'SECURITY' && <SecurityScreen />}
                {currentRole === 'ADMIN' && <AdminScreen />}
                {currentRole === 'PARENT' && <ParentScreen />}
              </View>
            </>
          )}

          {/* Floating Toast Notification */}
          <Toast />
        </SafeAreaView>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#090D16',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  webNavBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    zIndex: 100,
    ...THEME.shadows.md,
  },
  webBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogoImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webBrandTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveShieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    gap: 4,
  },
  liveShieldText: {
    color: '#10B981',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  webBrandSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  webNavControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchPortalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    gap: 6,
  },
  switchPortalText: {
    color: '#F43F5E',
    fontSize: 11,
    fontWeight: '700',
  },
  replaySplashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    gap: 6,
  },
  replaySplashText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  frameToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  frameToggleText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  appShell: {
    flex: 1,
    width: '100%',
    backgroundColor: '#090D16',
  },
  phoneFrameContainer: {
    maxWidth: 480,
    marginVertical: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#1F2937',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 10,
    backgroundColor: '#0B1120',
  },
  fullFluidContainer: {
    maxWidth: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#090D16',
  },
});

