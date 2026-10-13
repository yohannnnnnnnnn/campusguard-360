# CampusGuard 360 🛡️
> Next-Generation Smart Gate Pass & Real-Time Student Emergency SOS System

**CampusGuard 360** is a mobile safety and gate authorization platform developed with **React Native** and **Expo**. Engineered to replace traditional paper gate passes and static QR codes prone to screenshot abuse, CampusGuard 360 introduces rolling dynamic security tokens, instant GPS distress alerts, and role-based portals for students, guards, parents, and campus administrators.

---

## 🌟 Key Features

### 1. ⏱️ 15-Second Rolling Dynamic QR Gate Pass
- Generates time-expiring rolling security tokens (refreshed every 15 seconds) to prevent screenshot fraud and credential sharing.
- Live countdown timer with cryptographic verification payload.
- Real-time verification for security personnel at campus perimeter gates.

### 2. 🚨 Real-Time Emergency SOS & Crisis Broadcast
- One-tap emergency trigger designed for rapid distress response.
- Instantly captures real-time GPS coordinates and broadcasts crisis alerts to security control rooms, faculty, and emergency contacts.
- Live countdown and audible distress sequence.

### 3. 👥 Multi-Role Campus Management
- **Student Portal:** Request gate passes, view live pass status, display dynamic pass, and trigger SOS.
- **Security Guard Portal:** QR code scanner for rapid gate pass verification, manual pass lookup, and visitor logging.
- **Admin & Warden Dashboard:** Approve/reject gate passes, monitor entry/exit audit logs, and manage student registry.
- **Parent Portal:** Receive real-time check-in/check-out notifications and live pass updates.

### 4. 📱 Responsive Cross-Platform Interface
- Works across **Android**, **iOS**, and **Web Browser** using Expo & React Native.
- Built-in desktop mobile simulator frame for live web presentations and testing.

---

## 🏗️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) (v0.86) + [Expo](https://expo.dev/) (SDK 57)
- **Web Rendering:** `react-native-web` & `@expo/metro-runtime`
- **Icons & Styling:** `lucide-react-native`, custom modern dark theme design system
- **QR Engine:** `qrcode` & `jsqr`
- **Backend Architecture:** Node.js, Express, PostgreSQL (REST API ready)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/go) app installed on your smartphone (Android or iOS)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yohannnnnnnnnn/campusguard-360.git
   cd campusguard-360
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the App

- **Run in Web Browser:**
  ```bash
  npx expo start --web
  ```

- **Run on Mobile Phone (Expo Go):**
  ```bash
  npx expo start --lan
  ```
  *Scan the terminal QR code using the Expo Go app (Android) or Camera app (iOS) on the same Wi-Fi network.*

- **Run on Android Emulator:**
  ```bash
  npx expo start --android
  ```

- **Run on iOS Simulator:**
  ```bash
  npx expo start --ios
  ```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
