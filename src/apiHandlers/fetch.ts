import Cookies from 'js-cookie';

interface FetchOptions {
  includeAuth?: boolean;
  customHeaders?: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchData(
  route: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  payload?: object,
  options: FetchOptions = { includeAuth: true },
) {
  const token = Cookies.get('auth-token') || localStorage.getItem('auth-token');

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.customHeaders,
    },
    credentials: 'include', // Include cookies in requests
  };

  // Add Authorization header if token exists and auth is requested
  if (options.includeAuth && token) {
    (requestOptions.headers as Record<string, string>)['Authorization'] =
      `Bearer ${token}`;
  }

  if (method !== 'GET' && payload) {
    requestOptions.body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + route,
      requestOptions,
    );

    // Handle authentication errors
    if (response.status === 401) {
      // Clear invalid tokens
      Cookies.remove('auth-token');
      localStorage.removeItem('auth-token');

      // Redirect to login or throw error
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      // Try to parse error response
      try {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error in fetching data:', error);
    throw error; // Re-throw to allow proper error handling in components
  }
}
