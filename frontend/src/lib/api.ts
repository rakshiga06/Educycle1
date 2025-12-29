// API utility functions for backend communication
import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Get Firebase ID token for authenticated requests
 */
async function getAuthToken(): Promise<string | null> {
  if (!auth || !auth.currentUser) {
    return null;
  }
  
  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = {
      message: `API request failed: ${response.statusText}`,
      status: response.status,
    };
    
    try {
      const errorData = await response.json();
      error.message = errorData.detail || errorData.message || error.message;
    } catch {
      // If response is not JSON, use default error message
    }
    
    throw error;
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return {} as T;
}

/**
 * Make a multipart/form-data request (for file uploads)
 */
async function apiRequestMultipart<T>(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const headers: HeadersInit = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    method: options.method || 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error: ApiError = {
      message: `API request failed: ${response.statusText}`,
      status: response.status,
    };
    
    try {
      const errorData = await response.json();
      error.message = errorData.detail || errorData.message || error.message;
    } catch {
      // If response is not JSON, use default error message
    }
    
    throw error;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return {} as T;
}

// Books API
export const booksApi = {
  search: async (filters: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return apiRequest(`/books/search?${params.toString()}`);
  },

  getById: async (bookId: string) => {
    return apiRequest(`/books/${bookId}`);
  },

  donate: async (bookData: any, images: File[]) => {
    const formData = new FormData();
    
    // Add book data as JSON string in a field
    formData.append('payload', JSON.stringify(bookData));
    
    // Add images
    images.forEach((image) => {
      formData.append('images', image);
    });

    return apiRequestMultipart('/books/donate', formData);
  },
};

// Requests API
export const requestsApi = {
  list: async () => {
    return apiRequest('/requests/');
  },

  getById: async (requestId: string) => {
    return apiRequest(`/requests/${requestId}`);
  },

  create: async (bookId: string, donorUid: string) => {
    return apiRequest('/requests/', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId, donor_uid: donorUid }),
    });
  },

  approve: async (requestId: string) => {
    return apiRequest(`/requests/${requestId}/approve`, {
      method: 'POST',
    });
  },

  complete: async (requestId: string) => {
    return apiRequest(`/requests/${requestId}/complete`, {
      method: 'POST',
    });
  },
};

// Chats API
export const chatsApi = {
  getById: async (chatId: string) => {
    return apiRequest(`/chats/${chatId}`);
  },

  getMessages: async (chatId: string) => {
    return apiRequest(`/chats/${chatId}/messages`);
  },

  sendMessage: async (chatId: string, message: string) => {
    return apiRequest(`/chats/${chatId}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

// Notes API
export const notesApi = {
  list: async (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const queryString = params.toString();
    return apiRequest(`/notes${queryString ? `?${queryString}` : ''}`);
  },

  upload: async (noteData: any, file: File) => {
    const formData = new FormData();
    formData.append('payload', JSON.stringify(noteData));
    formData.append('file', file);

    return apiRequestMultipart('/notes/', formData);
  },
};

// NGO API
export const ngoApi = {
  listBulkRequests: async () => {
    return apiRequest('/ngo/bulk-request');
  },

  createBulkRequest: async (requestData: any) => {
    return apiRequest('/ngo/bulk-request', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
};

// Feedback API
export const feedbackApi = {
  submit: async (toUid: string, feedbackData: any) => {
    return apiRequest('/feedback/', {
      method: 'POST',
      body: JSON.stringify({ to_uid: toUid, ...feedbackData }),
    });
  },
};

// Impact API
export const impactApi = {
  getUserImpact: async () => {
    return apiRequest('/impact/');
  },
};

// Auth API
export const authApi = {
  bootstrap: async (role: string = 'student') => {
    return apiRequest('/auth/bootstrap', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },

  bootstrapNGO: async (metadata?: { organization_name: string; city: string; area: string }) => {
    return apiRequest('/auth/bootstrap', {
      method: 'POST',
      body: JSON.stringify({ 
        role: 'ngo',
        ...(metadata && { metadata })
      }),
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

