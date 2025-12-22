/**
 * Utility to extract user-friendly error messages from Firebase errors
 */

export interface FirebaseError {
  code?: string;
  message?: string;
  details?: string;
}

export function getErrorMessage(error: any): string {
  // Handle null/undefined errors
  if (!error) {
    return 'An unknown error occurred. Please try again.';
  }
  
  // Handle empty object errors
  if (typeof error === 'object' && Object.keys(error).length === 0) {
    console.error('Empty error object received. This may indicate a network or API issue.');
    return 'An unexpected error occurred. Please check your internet connection and try again. If the problem persists, the OpenFoodFacts API may be temporarily unavailable.';
  }
  
  // Handle Firebase Functions errors
  if (error?.code) {
    switch (error.code) {
      case 'functions/not-found':
        return 'Product not found. Please try a different barcode.';
      
      case 'functions/invalid-argument':
        return 'Invalid barcode format. Please check and try again.';
      
      case 'functions/permission-denied':
        return 'Permission denied. Please sign in and try again.';
      
      case 'functions/unauthenticated':
        return 'Authentication required. Please sign in.';
      
      case 'functions/unavailable':
        return 'Service temporarily unavailable. Please try again later.';
      
      case 'functions/deadline-exceeded':
        return 'Request timed out. Please try again.';
      
      case 'functions/internal':
        // Try to extract more details from internal errors
        const details = error.details || error.message || error.toString();
        
        // Check for specific error patterns
        if (details?.includes('not found') || details?.includes('not-found')) {
          return 'Product not found. This barcode may not exist in our database.';
        }
        if (details?.includes('Firestore') || details?.includes('firestore')) {
          return 'Database connection error. Please try again in a moment.';
        }
        if (details?.includes('OpenFoodFacts') || details?.includes('openfoodfacts')) {
          return 'Unable to fetch product information from OpenFoodFacts. The product may not be available.';
        }
        if (details?.includes('authenticated') || details?.includes('permission')) {
          return 'Authentication error. Please refresh the page and try again.';
        }
        if (details?.includes('timeout') || details?.includes('deadline')) {
          return 'Request timed out. Please check your internet connection and try again.';
        }
        
        // Log full error for debugging with all properties
        const errorLog: any = {
          code: error.code,
          message: error.message,
          details: error.details,
        };
        
        // Try to get all properties safely
        try {
          if (error && typeof error === 'object') {
            Object.getOwnPropertyNames(error).forEach(key => {
              try {
                const value = (error as any)[key];
                // Only include serializable values
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined) {
                  errorLog[key] = value;
                } else if (typeof value === 'object' && value !== null) {
                  errorLog[key] = '[Object]';
                } else {
                  errorLog[key] = String(value);
                }
              } catch (e) {
                errorLog[key] = '[Unable to access]';
              }
            });
          }
        } catch (e) {
          errorLog.propertyExtractionError = String(e);
        }
        
        console.error('Internal error details:', JSON.stringify(errorLog, null, 2));
        
        // Check for CORS errors specifically
        const errorMsg = String(error.message || '');
        if (errorMsg.includes('CORS') || errorMsg.includes('cors') || errorMsg.includes('Access-Control') || errorMsg.includes('CORS_ERROR')) {
          return 'CORS Error: The server is blocking requests from localhost. This is a Firebase Functions configuration issue. The functions need to allow requests from your origin.';
        }
        
        // Return user-friendly message
        if (details && typeof details === 'string' && details.length > 0 && details !== 'internal') {
          return `Server error: ${details}`;
        }
        return 'An internal server error occurred. This might be due to CORS, authentication, or network issues. Please check the browser console for more details.';
      
      default:
        return error.message || `Error: ${error.code}`;
    }
  }
  
  // Handle network errors
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  // Handle generic errors
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

