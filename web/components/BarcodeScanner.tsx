'use client';

import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: Error) => void;
}

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('prompt');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check if we're on HTTPS (required for camera access)
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
      const isLocalNetwork = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname);
      const isSecure = window.location.protocol === 'https:' || isLocalhost;
      
      // Only show error for non-local, non-HTTPS connections
      if (!isSecure && !isLocalNetwork) {
        setPermissionError('Camera access requires HTTPS. Please access this site over a secure connection.');
        setPermissionStatus('denied');
      }

      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError('Camera access is not supported in this browser. Please use a modern browser or enter the barcode manually.');
        setPermissionStatus('denied');
      }
    }

    return () => {
      // Cleanup on unmount
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      setPermissionError(null);
      setPermissionStatus('checking');
      
      // Check if we're on HTTPS or localhost (required for camera access)
      // Allow localhost, 127.0.0.1, and local network IPs for development
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
      const isLocalNetwork = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname);
      const isSecure = window.location.protocol === 'https:' || isLocalhost;
      
      // For local network IPs, try anyway (some browsers may allow it)
      // But warn if it's not HTTPS
      if (!isSecure && !isLocalNetwork) {
        throw new Error('HTTPS_REQUIRED');
      }
      
      // Warn but don't block for local network without HTTPS
      if (isLocalNetwork && window.location.protocol !== 'https:') {
        console.warn('Camera access may not work over HTTP on mobile devices. Use HTTPS or access via localhost.');
      }

      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('API_NOT_AVAILABLE');
      }

      // Request camera permission - browser will show native prompt
      // On mobile, this must be called in direct response to user gesture
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Store stream reference for cleanup
      streamRef.current = stream;
      
      // Permission granted
      setPermissionStatus('granted');
      return true;
    } catch (error: any) {
      console.error('Camera permission error:', error);
      setIsScanning(false);
      
      if (error.message === 'HTTPS_REQUIRED') {
        setPermissionStatus('denied');
        const hostname = window.location.hostname;
        const isLocalNetwork = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname);
        
        if (isLocalNetwork) {
          setPermissionError('Camera access requires HTTPS on mobile devices. For local development, try accessing via localhost on your computer, or set up HTTPS for your local server.');
        } else {
          setPermissionError('Camera access requires a secure connection (HTTPS). Please access this site over HTTPS.');
        }
        if (onError) {
          onError(new Error('HTTPS required for camera access.'));
        }
      } else if (error.message === 'API_NOT_AVAILABLE') {
        setPermissionStatus('denied');
        setPermissionError('Camera access is not supported in this browser. Please use a modern browser or enter the barcode manually.');
        if (onError) {
          onError(new Error('Camera API not available.'));
        }
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionStatus('denied');
        setPermissionError('Camera permission was denied. Please click "Allow" when your browser asks for camera access. On mobile, look for the permission prompt at the top of your screen.');
        if (onError) {
          onError(new Error('Camera permission denied. Please allow camera access when prompted.'));
        }
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setPermissionStatus('denied');
        setPermissionError('No camera found on your device. Please use manual barcode entry instead.');
        if (onError) {
          onError(new Error('No camera found on your device.'));
        }
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setPermissionStatus('denied');
        setPermissionError('Camera is already in use by another application. Please close other apps using the camera and try again.');
        if (onError) {
          onError(new Error('Camera is already in use.'));
        }
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        // Try again with simpler constraints for mobile devices
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
          });
          streamRef.current = stream;
          setPermissionStatus('granted');
          return true;
        } catch (retryError: any) {
          setPermissionStatus('denied');
          setPermissionError('Unable to access camera with requested settings. Please try again or use manual barcode entry.');
          if (onError) {
            onError(new Error('Camera constraint error.'));
          }
        }
      } else {
        setPermissionStatus('denied');
        setPermissionError('Unable to access camera. Please check your browser settings and ensure camera permissions are enabled. On mobile, make sure you clicked "Allow" when prompted.');
        if (onError) {
          onError(new Error('Unable to access camera.'));
        }
      }
      return false;
    }
  };

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setPermissionError(null);
      
      // Request camera permission first
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        setIsScanning(false);
        return;
      }

      // Get the stream again for the video element
      // We need a new stream because we might have stopped the previous one
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        streamRef.current = stream;
        
        // Attach stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }
      } catch (streamError: any) {
        // If we can't get stream with ideal settings, try simpler constraints
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => {
              console.error('Error playing video:', err);
            });
          }
        } catch (simpleError) {
          console.error('Error getting camera stream:', simpleError);
          setIsScanning(false);
          setPermissionError('Unable to start camera. Please try again.');
          return;
        }
      }

      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      // Try to list devices, but continue even if it fails
      let selectedDeviceId: string | undefined;
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length > 0) {
          // Prefer back camera if available
          const backCamera = videoInputDevices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          selectedDeviceId = backCamera?.deviceId || videoInputDevices[0].deviceId;
        }
      } catch (listError) {
        // If enumeration fails, use undefined (default camera)
        console.warn('Could not enumerate devices, using default camera:', listError);
      }

      if (videoRef.current) {
        codeReader.decodeFromVideoDevice(
          selectedDeviceId || null,
          videoRef.current,
          (result, error) => {
            if (result) {
              const barcode = result.getText();
              onScan(barcode);
              stopScanning();
            }
            if (error && error.name !== 'NotFoundException') {
              console.error('Scan error:', error);
              if (onError) {
                onError(error as Error);
              }
            }
          }
        );
      }
    } catch (error) {
      console.error('Error starting scanner:', error);
      setIsScanning(false);
      if (onError) {
        onError(error as Error);
      }
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Scan Barcode</h2>
        
        {/* Camera Scanner */}
        <div className="mb-6">
          <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{ display: isScanning ? 'block' : 'none' }}
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <p>Camera ready</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Permission Error Message */}
          {permissionError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-2">{permissionError}</p>
                  {permissionStatus === 'denied' && (
                    <div className="text-xs text-red-700">
                      <p className="font-semibold mb-1">To enable camera access:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>On Mobile:</strong> Look for the permission prompt at the top of your screen and tap "Allow"</li>
                        <li><strong>On Desktop:</strong> Look for the browser permission prompt and click "Allow"</li>
                        <li>If you don't see a prompt, go to your browser Settings → Privacy → Site Settings → Camera</li>
                        <li>Allow camera access for this site, then refresh and try again</li>
                        <li>Make sure you're accessing the site over HTTPS (secure connection)</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Permission Status Info */}
          {permissionStatus === 'checking' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Requesting camera access...
              </p>
            </div>
          )}

          {permissionStatus === 'granted' && !isScanning && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Camera permission granted. Ready to scan!
              </p>
            </div>
          )}
          
          <div className="flex gap-2">
            {!isScanning ? (
              <button
                onClick={startScanning}
                disabled={permissionStatus === 'checking'}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-semibold text-base sm:text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {permissionStatus === 'checking' ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Requesting Access...
                  </>
                ) : permissionStatus === 'denied' ? (
                  'Try Again - Request Permission'
                ) : (
                  'Start Scanning'
                )}
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-semibold text-base sm:text-lg"
              >
                Stop Scanning
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Manual Entry */}
        <div>
          <label 
            htmlFor="barcode-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Barcode Manually
          </label>
          <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              id="barcode-input"
              name="barcode"
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="Enter barcode (e.g., 8901058851298)"
              autoComplete="off"
              inputMode="numeric"
              className="flex-1 px-3 sm:px-4 py-3 text-base sm:text-lg font-mono border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 w-full"
              style={{ fontSize: '16px', letterSpacing: '0.5px' }}
              aria-label="Barcode input field"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-semibold text-base sm:text-lg whitespace-nowrap w-full sm:w-auto"
              aria-label="Search for product by barcode"
            >
              Search
            </button>
          </form>
          {manualBarcode && (
            <p className="mt-2 text-sm text-gray-600 font-mono" role="status" aria-live="polite">
              Barcode: <span className="font-bold text-gray-900">{manualBarcode}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

