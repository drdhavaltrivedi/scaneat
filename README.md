# Scaneat - Food Barcode Scanner & Health Analyzer

Scaneat is a cross-platform application (web and mobile) that allows users to scan food product barcodes and receive comprehensive health analysis, ingredient breakdown, and personalized recommendations.

## Features

- **Barcode Scanning**: Scan food product barcodes using your device camera or enter manually
- **Health Analysis**: Get instant health scores based on nutrition, ingredients, additives, and processing level
- **Nutri-Score Integration**: Uses the official Nutri-Score algorithm for food rating
- **Ingredient Analysis**: Detailed breakdown of ingredients with allergen and additive warnings
- **Personalized Recommendations**: Get tailored advice based on the product's health profile
- **User Authentication**: Sign up, sign in, or continue as guest
- **Product History**: Track your scanned products (coming soon)

## Tech Stack

- **Web Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Mobile App**: React Native, Expo, TypeScript
- **Backend**: Firebase (Cloud Functions, Firestore, Authentication)
- **External APIs**: OpenFoodFacts API
- **Barcode Scanning**: 
  - Web: `@zxing/library`
  - Mobile: `expo-camera` with built-in barcode scanning

## Project Structure

```
scaneat/
├── web/                    # Next.js web application
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   └── lib/               # Utilities and Firebase config
├── mobile/                # React Native/Expo mobile app
│   ├── screens/           # App screens
│   ├── components/        # React Native components
│   └── lib/               # Utilities and Firebase config
├── functions/             # Firebase Cloud Functions
│   └── src/               # Function source code
├── shared/                # Shared types and utilities
│   ├── types/             # TypeScript type definitions
│   └── utils/            # Shared utility functions
└── firebase.json          # Firebase configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account with Blaze plan (✅ Already set up: `scaneat-bc079`)
- Expo CLI (for mobile development)

### ⚡ Quick Setup

**Firebase is already connected!** Just enable Firestore API:

1. Visit: https://console.cloud.google.com/apis/api/firestore.googleapis.com/overview?project=scaneat-bc079
2. Click **"Enable"**
3. Follow the [Quick Start Guide](QUICK_START.md) for remaining steps

### Installation

1. Clone the repository:
```bash
cd /home/brilworks/scaneat
```

2. Install dependencies for each project:

```bash
# Web app
cd web
npm install

# Mobile app
cd ../mobile
npm install

# Cloud Functions
cd ../functions
npm install
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable the following services:
   - Authentication (Email/Password and Anonymous)
   - Firestore Database
   - Cloud Functions

3. Create a `.env.local` file in the `web` directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Create a `.env` file in the `mobile` directory:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

5. Initialize Firebase Functions:
```bash
cd functions
firebase login
firebase use --add  # Select your project
```

### Running the Applications

#### Web App

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Mobile App

```bash
cd mobile
npm start
```

Follow the Expo CLI instructions to run on iOS, Android, or web.

#### Cloud Functions

Deploy functions:
```bash
cd functions
npm run build
firebase deploy --only functions
```

Or run locally with emulator:
```bash
firebase emulators:start
```

## Health Analysis Algorithm

The health analysis uses a hybrid approach combining:

1. **Nutri-Score**: Standard algorithm based on nutrients (sugar, salt, fat, fiber, protein)
2. **Ingredient Analysis**: Checks for additives (E-numbers), preservatives, artificial colors
3. **Processing Level**: NOVA classification (1-4, unprocessed to ultra-processed)
4. **Health Scoring**: 0-100 score with grade classification (excellent, good, moderate, poor, avoid)

## API Integration

### OpenFoodFacts API

The app uses the OpenFoodFacts API to fetch product information by barcode. Products are cached in Firestore for 7 days to reduce API calls.

## Development

### Adding New Features

1. **New Health Rules**: Edit `shared/utils/healthRules.ts`
2. **New Components**: Add to `web/components/` or `mobile/components/`
3. **New Cloud Functions**: Add to `functions/src/` and export in `functions/src/index.ts`

### Type Safety

All types are defined in `shared/types/product.ts` and shared between web and mobile apps.

## Deployment

### Web App

Deploy to Vercel, Netlify, or any Next.js-compatible platform:

```bash
cd web
npm run build
```

### Mobile App

Build for production:

```bash
cd mobile
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### Cloud Functions

```bash
cd functions
firebase deploy --only functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Acknowledgments

- [OpenFoodFacts](https://world.openfoodfacts.org/) for providing the food database
- Firebase for backend infrastructure
- Next.js and Expo teams for excellent frameworks
