const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T; status: string }> {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null;
    const authData = token ? JSON.parse(token) : null;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(authData?.state?.token && {
          Authorization: `Bearer ${authData.state.token}`,
        }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(API_URL);

// Auth
export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/api/auth/login', data),
};

// Conversations
export const conversationsApi = {
  getAll: () => api.get('/api/conversations'),
  getOne: (id: string) => api.get(`/api/conversations/${id}`),
  create: (data: { title?: string }) => api.post('/api/conversations', data),
  update: (id: string, data: { title: string }) => api.patch(`/api/conversations/${id}`, data),
  delete: (id: string) => api.delete(`/api/conversations/${id}`),
};

// Messages
export const messagesApi = {
  getByConversation: (conversationId: string) =>
    api.get(`/api/messages/conversation/${conversationId}`),
};
