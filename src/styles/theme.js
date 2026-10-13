export const THEME = {
  mode: 'dark',
  colors: {
    // Deep Space & Obsidian Canvas
    bgApp: '#090D16',
    bgDark: '#090D16',
    bgCard: '#111827',
    bgCardHover: '#1E293B',
    bgCardGlass: 'rgba(17, 24, 39, 0.85)',
    bgCardLight: '#1F2937',
    surface: '#0B1120',
    surfaceBorder: '#1F2937',
    surfaceBorderGlow: 'rgba(56, 189, 248, 0.25)',

    // Electric Accents
    primary: '#38BDF8', // Electric Cyan
    primaryGlow: 'rgba(56, 189, 248, 0.25)',
    primaryLight: '#60A5FA',
    primaryDark: '#0284C7',
    cyan: '#06B6D4',
    cyanGlow: 'rgba(6, 182, 212, 0.25)',

    // Role Accent Tokens
    studentAccent: '#38BDF8',
    studentBg: 'rgba(56, 189, 248, 0.12)',
    studentBorder: 'rgba(56, 189, 248, 0.35)',

    securityAccent: '#10B981', // Cyber Emerald
    securityBg: 'rgba(16, 185, 129, 0.12)',
    securityBorder: 'rgba(16, 185, 129, 0.35)',

    adminAccent: '#F59E0B', // Solar Amber
    adminBg: 'rgba(245, 158, 11, 0.12)',
    adminBorder: 'rgba(245, 158, 11, 0.35)',

    parentAccent: '#A855F7', // Neon Iris
    parentBg: 'rgba(168, 85, 247, 0.12)',
    parentBorder: 'rgba(168, 85, 247, 0.35)',

    // Semantic Status Tokens
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.12)',
    successBorder: 'rgba(16, 185, 129, 0.35)',

    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    warningBorder: 'rgba(245, 158, 11, 0.35)',

    danger: '#F43F5E', // Hyper Crimson
    dangerBg: 'rgba(244, 63, 94, 0.15)',
    dangerBorder: 'rgba(244, 63, 94, 0.4)',
    dangerGlow: 'rgba(244, 63, 94, 0.3)',

    // Typography & Neutrals
    textPrimary: '#FFFFFF',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    border: '#1F2937',
    divider: '#1E293B',
  },
  typography: {
    fontFamily: 'System',
    sizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 20,
      xxl: 24,
      hero: 28,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 14,
      elevation: 6,
    },
    glowPrimary: {
      shadowColor: '#38BDF8',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    glowCyan: {
      shadowColor: '#06B6D4',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    glowSuccess: {
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    glowWarning: {
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    glowDanger: {
      shadowColor: '#F43F5E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 14,
      elevation: 6,
    },
  },
};

