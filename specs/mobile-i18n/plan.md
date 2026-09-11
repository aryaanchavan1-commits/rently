# Implementation Plan: Multi-Language + Cross-Platform

## Phase 1: Add 10 New Languages (Translations)

### Step 1.1: Add Tamil (ta) translations
- Add complete Tamil translation object to `src/lib/translations.ts`
- Covers all 12 translation sections (nav, hero, search, onboarding, properties, owner, chat, dashboard, pricing, auth, common, footer)

### Step 1.2: Add Telugu (te) translations
- Add complete Telugu translation object

### Step 1.3: Add Kannada (kn) translations
- Add complete Kannada translation object

### Step 1.4: Add Gujarati (gu) translations
- Add complete Gujarati translation object

### Step 1.5: Add Bengali (bn) translations
- Add complete Bengali translation object

### Step 1.6: Add Malayalam (ml) translations
- Add complete Malayalam translation object

### Step 1.7: Add Punjabi (pa) translations
- Add complete Punjabi translation object

### Step 1.8: Add Urdu (ur) translations
- Add complete Urdu translation object

### Step 1.9: Add Odia (or) translations
- Add complete Odia translation object

### Step 1.10: Add Assamese (as) translations
- Add complete Assamese translation object

## Phase 2: Update Language Infrastructure

### Step 2.1: Update LangContext
- Expand `LangKey` type to include all 13 languages
- Update `LangProvider` to handle all language codes
- Update localStorage validation

### Step 2.2: Update LanguageSelector
- Show all 13 languages in the selector
- Add proper labels for each language
- Group by script family (Devanagari, Dravidian, etc.)

### Step 2.3: Update AIChat
- Ensure AI prompts work with all languages
- Update default language detection

## Phase 3: iOS Configuration

### Step 3.1: Add iOS Platform
- Run `npx cap add ios`
- Configure iOS project settings

### Step 3.2: iOS Permissions
- Add location permission (for commute search)
- Add camera permission (for future features)
- Configure Info.plist

### Step 3.3: iOS Splash Screens
- Generate iOS splash screens for all sizes
- Configure LaunchScreen.storyboard

### Step 3.4: iOS App Icons
- Generate iOS app icons for all sizes (20x20 to 1024x1024)

### Step 3.5: iOS Signing
- Configure development team
- Set bundle identifier

## Phase 4: Store Deployment Configuration

### Step 4.1: Play Store Metadata
- App title, description, screenshots
- Category: Housing & Real Estate
- Content rating
- Privacy policy URL

### Step 4.2: App Store Metadata
- App title, description, screenshots
- Category: Lifestyle
- Content rating
- Privacy policy URL

### Step 4.3: Build Scripts
- Create build-android.sh and build-ios.sh
- Add version bumping
- Add store upload automation

## Phase 5: Testing & Polish

### Step 5.1: Test All Languages
- Verify each language renders correctly
- Test RTL for Urdu
- Test font rendering for all scripts

### Step 5.2: Test Cross-Platform
- Test on Android device
- Test on iOS simulator (if Mac available)
- Test website sync

### Step 5.3: Performance
- Optimize bundle size per language
- Lazy load translations
- Cache management

## Dependencies
- Supabase database (existing)
- Capacitor (existing)
- Google Fonts for Indian scripts
- Apple Developer Account (for iOS)
- Google Play Developer Account (for Android)

## Timeline
- Phase 1: 2-3 hours (translations)
- Phase 2: 30 minutes (infrastructure)
- Phase 3: 1 hour (iOS config)
- Phase 4: 30 minutes (store config)
- Phase 5: 1 hour (testing)
- **Total: ~5-6 hours**
