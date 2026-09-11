# Nivasa Multi-Language + Cross-Platform Mobile App

## Overview
Expand Nivasa rental platform to support 13 Indian languages, build for iOS and Android using Capacitor, and deploy to Play Store + App Store. Same Supabase database, synced with website.

## Requirements

### 1. Multi-Language Support (13 Languages)
| Code | Language | Script |
|------|----------|--------|
| en | English | Latin |
| mr | मराठी | Devanagari |
| hi | हिन्दी | Devanagari |
| bn | বাংলা | Bengali |
| ta | தமிழ் | Tamil |
| te | తెలుగు | Telugu |
| kn | ಕನ್ನಡ | Kannada |
| gu | ગુજરાતી | Gujarati |
| ml | മലയാളം | Malayalam |
| pa | ਪੰਜਾਬੀ | Gurmukhi |
| ur | اردو | Arabic |
| or | ଓଡ଼ିଆ | Odia |
| as | অসমীয়া | Bengali |

### 2. Translation Structure
Each language must have these keys (matching existing structure):
- `nav` - Navigation labels
- `hero` - Homepage hero section
- `search` - Search page
- `onboarding` - AI chat onboarding
- `properties` - Property listing page
- `owner` - Owner listing page
- `chat` - Messaging
- `dashboard` - Owner dashboard
- `pricing` - Pricing page
- `auth` - Login/Signup
- `common` - Shared UI labels
- `footer` - Footer text

### 3. Cross-Platform (iOS + Android)
- **Android**: Already configured via Capacitor
- **iOS**: Add Capacitor iOS platform, configure splash screens, permissions, and signing
- **Both**: Same web codebase, same Supabase database

### 4. Store Deployment
- **Play Store**: Signed AAB, store listing, screenshots
- **App Store**: Signed IPA, store listing, screenshots
- **Both**: Same web assets bundled locally

## Success Criteria
- [ ] All 13 languages working on web and mobile
- [ ] iOS app builds and runs
- [ ] Android APK/AAB builds with proper signing
- [ ] App Store and Play Store listings configured
- [ ] Same database, same data across all platforms
- [ ] No regressions on existing functionality
