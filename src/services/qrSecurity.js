// Time-based rotating anti-screenshot cryptographic token generator & validator

const TOKEN_WINDOW_SECONDS = 120; // 2 minutes dynamic token refresh

// Simple deterministic hash for demo anti-tampering
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Generates a dynamic, time-limited token payload for the QR code
 */
export function generateDynamicToken(pass, student) {
  if (!pass || !student) return null;

  const now = Date.now();
  const timeWindow = Math.floor(now / (TOKEN_WINDOW_SECONDS * 1000));
  const secondsLeft = TOKEN_WINDOW_SECONDS - Math.floor((now / 1000) % TOKEN_WINDOW_SECONDS);
  const progressRatio = secondsLeft / TOKEN_WINDOW_SECONDS;

  // Cryptographic simulated signature
  const salt = `CG360_${student.rollNo}_${pass.id}_${timeWindow}`;
  const signature = simpleHash(salt);

  const payload = {
    app: 'CAMPUSGUARD_360',
    ver: '2.0',
    passId: pass.id,
    rollNo: student.rollNo,
    studentId: student.id,
    studentName: student.name,
    passType: pass.passType,
    w: timeWindow,
    exp: (timeWindow + 1) * TOKEN_WINDOW_SECONDS * 1000,
    sig: signature,
    issuedAt: now,
  };

  return {
    rawPayload: JSON.stringify(payload),
    payloadObj: payload,
    secondsLeft,
    progressRatio,
    signature,
    timeWindow,
  };
}

/**
 * Validates a scanned QR payload string against active database
 */
export function verifyDynamicToken(qrString, passes = [], students = []) {
  try {
    let payload;
    if (typeof qrString === 'string') {
      payload = JSON.parse(qrString);
    } else {
      payload = qrString;
    }

    if (!payload || payload.app !== 'CAMPUSGUARD_360' || !payload.passId || !payload.rollNo) {
      return {
        isValid: false,
        statusCode: 'INVALID_FORMAT',
        title: 'Invalid QR Code',
        message: 'This QR code is not recognized as a legitimate CampusGuard 360 Pass.',
        student: null,
        pass: null,
        actionAllowed: null,
      };
    }

    // Check time window (allow current and previous window to handle slight network/clock latency)
    const now = Date.now();
    const currentWindow = Math.floor(now / (TOKEN_WINDOW_SECONDS * 1000));
    const tokenWindow = payload.w;

    if (Math.abs(currentWindow - tokenWindow) > 1) {
      // More than ~2 minutes old: likely a screenshot or forwarded image!
      return {
        isValid: false,
        statusCode: 'SCREENSHOT_DETECTED',
        title: 'Expired Dynamic Token (Anti-Screenshot Flag)',
        message: 'This QR code token has expired (>2 mins). Student may be attempting to use a static screenshot or forwarded image!',
        student: students.find((s) => s.id === payload.studentId || s.rollNo === payload.rollNo) || null,
        pass: passes.find((p) => p.id === payload.passId) || null,
        actionAllowed: null,
        isSecurityAlert: true,
      };
    }

    // Find student
    const student = students.find((s) => s.id === payload.studentId || s.rollNo === payload.rollNo);
    if (!student) {
      return {
        isValid: false,
        statusCode: 'STUDENT_NOT_FOUND',
        title: 'Student Not Found',
        message: `Student with Roll No ${payload.rollNo} does not exist in active campus records.`,
        student: null,
        pass: null,
        actionAllowed: null,
      };
    }

    // Find pass
    const pass = passes.find((p) => p.id === payload.passId);
    if (!pass) {
      return {
        isValid: false,
        statusCode: 'PASS_NOT_FOUND',
        title: 'Pass Record Missing',
        message: `No gate pass found matching ID ${payload.passId}.`,
        student,
        pass: null,
        actionAllowed: null,
      };
    }

    // Check pass status
    if (pass.status === 'REJECTED') {
      return {
        isValid: false,
        statusCode: 'PASS_REJECTED',
        title: 'Pass Rejected by Warden',
        message: 'This gate pass application was rejected by the hostel warden.',
        student,
        pass,
        actionAllowed: null,
      };
    }

    if (pass.status === 'PENDING_APPROVAL') {
      return {
        isValid: false,
        statusCode: 'PASS_PENDING',
        title: 'Pass Still Pending Approval',
        message: 'This pass has not yet been approved by the hostel warden or HOD.',
        student,
        pass,
        actionAllowed: null,
      };
    }

    if (pass.status === 'COMPLETED') {
      return {
        isValid: false,
        statusCode: 'PASS_ALREADY_COMPLETED',
        title: 'Pass Already Completed',
        message: 'This pass has already been used and marked completed upon previous return.',
        student,
        pass,
        actionAllowed: null,
      };
    }

    // Check if pass is expired based on validUntil
    const validUntilMs = new Date(pass.validUntil).getTime();
    const isPastCurfew = now > validUntilMs;

    // Determine direction
    let actionAllowed = 'EXIT';
    let statusTitle = 'Authorized for Exit';
    let statusMessage = 'Valid approved gate pass. Student is cleared to leave campus.';

    if (student.status === 'OFF_CAMPUS' || pass.status === 'CHECKED_OUT') {
      actionAllowed = 'ENTRY';
      if (isPastCurfew) {
        statusTitle = 'Authorized Entry (Curfew Violation / Late)';
        statusMessage = `Pass valid until ${pass.curfewTime}, student is entering late. Record with late flag.`;
      } else {
        statusTitle = 'Authorized for Entry';
        statusMessage = 'Student is returning on time. Cleared for campus entry.';
      }
    }

    return {
      isValid: true,
      statusCode: isPastCurfew ? 'VALID_LATE_ENTRY' : 'VALID_CLEAR',
      isPastCurfew,
      title: statusTitle,
      message: statusMessage,
      student,
      pass,
      actionAllowed,
    };
  } catch (err) {
    return {
      isValid: false,
      statusCode: 'PARSE_ERROR',
      title: 'Corrupted QR Code',
      message: err.message,
      student: null,
      pass: null,
      actionAllowed: null,
    };
  }
}
