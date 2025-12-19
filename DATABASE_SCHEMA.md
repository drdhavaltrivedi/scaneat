# Scaneat Database Schema

## Firestore Collections

### `products/{barcode}`

Stores product information fetched from OpenFoodFacts API.

**Document Structure:**
```typescript
{
  barcode: string;                    // Product barcode (document ID)
  name: string;                       // Product name
  brand?: string;                     // Brand name
  category?: string;                  // Product category
  imageUrl?: string;                  // Product image URL
  ingredients: Ingredient[];          // List of ingredients
  nutrition: NutritionInfo;           // Nutritional information
  allergens?: string[];               // Allergen tags
  additives?: Additive[];            // Additives list
  novaGroup?: number;                 // NOVA classification (1-4)
  nutriScore?: string;               // Nutri-Score grade (A-E)
  healthScore: HealthScore;           // Calculated health score
  createdAt: Timestamp;              // Creation timestamp
  updatedAt: Timestamp;               // Last update timestamp
}
```

**Access Rules:**
- Read: Public (anyone can read)
- Write: Cloud Functions only

**Indexes:**
- None required (single document lookups by barcode)

---

### `users/{userId}`

User account data and preferences.

**Document Structure:**
```typescript
{
  userId: string;                     // User ID (document ID)
  email?: string;                     // User email (if authenticated)
  createdAt: Timestamp;                // Account creation date
  updatedAt: Timestamp;               // Last update timestamp
}
```

**Subcollections:**

#### `users/{userId}/preferences/{preferenceId}`

User dietary preferences and health goals.

```typescript
{
  dietaryRestrictions: DietaryRestriction[];  // e.g., ['vegetarian', 'vegan']
  healthGoals: HealthGoal[];                  // e.g., ['weight_loss', 'heart_health']
  allergenWarnings: string[];                 // Allergens to warn about
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `users/{userId}/history/{historyId}`

Scanned product history.

```typescript
{
  barcode: string;                     // Product barcode
  scannedAt: Timestamp;                // When product was scanned
  product: Product;                    // Full product data snapshot
}
```

**Indexes:**
- `userId` (ASC) + `scannedAt` (DESC) - For history queries

#### `users/{userId}/favorites/{favoriteId}`

Favorite products.

```typescript
{
  barcode: string;                     // Product barcode
  addedAt: Timestamp;                  // When added to favorites
}
```

**Access Rules:**
- Read/Write: User can only access their own data
- Requires authentication

---

### `_system/{docId}`

System metadata and health checks.

**Document Structure:**
```typescript
{
  status: string;                      // e.g., 'healthy', 'initialized'
  message?: string;                    // Status message
  timestamp: Timestamp;                // Last update
}
```

**Documents:**
- `_system/health` - Database health check
- `_system/init` - Initialization marker

**Access Rules:**
- Read: Public
- Write: Cloud Functions only

---

## Data Flow

### Product Scanning Flow

1. User scans barcode → Frontend calls `getProduct` Cloud Function
2. Function checks `products/{barcode}` in Firestore
3. If found and cache < 7 days old → Return cached data
4. If not found or stale → Fetch from OpenFoodFacts API
5. Parse and normalize product data
6. Save to `products/{barcode}` in Firestore
7. Return product data to frontend

### Health Analysis Flow

1. Frontend calls `analyzeHealth` Cloud Function with barcode
2. Function reads `products/{barcode}` from Firestore
3. Calculate health score using hybrid algorithm
4. Update `products/{barcode}` with `healthScore` field
5. Return health score to frontend

### User History Flow

1. User scans product → Product saved to `users/{userId}/history/{historyId}`
2. User views history → Query `users/{userId}/history` ordered by `scannedAt` DESC
3. User adds favorite → Create document in `users/{userId}/favorites/{favoriteId}`

---

## Security Rules Summary

```javascript
// Products: Public read, functions-only write
match /products/{barcode} {
  allow read: if true;
  allow write: if false;  // Only Cloud Functions
}

// Users: User can only access their own data
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  
  // Subcollections inherit parent rules
  match /preferences/{preferenceId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  
  match /history/{historyId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  
  match /favorites/{favoriteId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```

---

## Indexes Required

Defined in `firestore.indexes.json`:

1. **User History Query**
   - Collection: `users/{userId}/history`
   - Fields: `userId` (ASC), `scannedAt` (DESC)
   - Used for: Listing user's scanned products in reverse chronological order

---

## Caching Strategy

- **Products**: Cached for 7 days in Firestore
- **Health Scores**: Cached for 1 day in product document
- **User Data**: Always fresh, no caching

---

## Data Retention

- **Products**: Permanent (never auto-deleted)
- **User History**: Keep last 100 scans per user (implement cleanup function)
- **Favorites**: Permanent until user removes

---

## Backup & Recovery

- Firestore automatically backs up data
- Point-in-time recovery available with Blaze plan
- Export data: Use `gcloud firestore export`

