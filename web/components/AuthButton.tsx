'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // Don't show error if auth is not configured
      if (error?.code === 'auth/configuration-not-found') {
        alert('Authentication is not configured. You can use the app without signing in.');
      } else {
        alert(error.message || 'Sign in failed. You can use the app without signing in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // Don't show error if auth is not configured
      if (error?.code === 'auth/configuration-not-found') {
        alert('Authentication is not configured. You can use the app without signing in.');
      } else {
        alert(error.message || 'Sign up failed. You can use the app without signing in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    try {
      // Try anonymous sign-in, but don't show error if it fails
      // Authentication is optional since we use direct API calls
      await signInAnonymously(auth).catch((err: any) => {
        // If anonymous auth is not enabled, that's okay - we don't need it
        console.info('Anonymous authentication not available. Continuing without authentication.');
        // Don't show error to user - app works without auth
      });
    } catch (error: any) {
      // Only show error if it's not a configuration error
      if (error?.code !== 'auth/configuration-not-found') {
        console.warn('Auth error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user.email || 'Guest User'}
        </span>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Email address"
          />
        </div>
        <div>
          <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="auth-password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Password"
          />
        </div>
        <button
          onClick={isSignUp ? handleSignUp : handleSignIn}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-blue-600 text-sm hover:underline"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>
        <button
          onClick={handleAnonymousSignIn}
          disabled={loading}
          className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Continue as Guest'}
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Note: Authentication is optional. You can use the app without signing in.
        </p>
      </div>
    </div>
  );
}

