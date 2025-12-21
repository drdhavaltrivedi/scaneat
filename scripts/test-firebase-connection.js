#!/usr/bin/env node

/**
 * Test script to verify Firebase connection
 * Run: node scripts/test-firebase-connection.js
 */

const path = require('path');
const admin = require(path.join(__dirname, '../functions/node_modules/firebase-admin'));

// Initialize Firebase Admin with service account
try {
  const serviceAccount = require('/home/brilworks/.firebase-mcp/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'scaneat-bc079',
  });
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function testConnection() {
  console.log('\n🧪 Testing Firebase connection...\n');

  // Test 1: Write to Firestore
  try {
    const testRef = db.collection('_system').doc('test');
    await testRef.set({
      test: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Test 1: Write to Firestore - SUCCESS');
  } catch (error) {
    console.error('❌ Test 1: Write to Firestore - FAILED');
    console.error('   Error:', error.message);
    if (error.message.includes('PERMISSION_DENIED') || error.message.includes('not been used')) {
      console.error('   💡 Enable Firestore API: https://console.cloud.google.com/apis/api/firestore.googleapis.com/overview?project=scaneat-bc079');
    }
  }

  // Test 2: Read from Firestore
  try {
    const testRef = db.collection('_system').doc('test');
    const doc = await testRef.get();
    if (doc.exists) {
      console.log('✅ Test 2: Read from Firestore - SUCCESS');
    } else {
      console.log('⚠️  Test 2: Read from Firestore - Document not found');
    }
  } catch (error) {
    console.error('❌ Test 2: Read from Firestore - FAILED');
    console.error('   Error:', error.message);
  }

  // Test 3: Check collections
  try {
    const collections = await db.listCollections();
    console.log('✅ Test 3: List collections - SUCCESS');
    console.log('   Collections:', collections.map(c => c.id).join(', ') || 'None');
  } catch (error) {
    console.error('❌ Test 3: List collections - FAILED');
    console.error('   Error:', error.message);
  }

  console.log('\n✨ Connection test complete!\n');
  process.exit(0);
}

testConnection().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

