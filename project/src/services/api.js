const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || null;
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }
  // Complaint endpoints
  async getComplaints() {
    return this.request('/complaints');
  }

  async createComplaint(complaintData) {
    return this.request('/complaints', {
      method: 'POST',
      body: complaintData,
    });
  }

  // Club endpoints
  async getClubs() {
    return this.request('/clubs');
  }

  async createClub(clubData) {
    return this.request('/clubs', {
      method: 'POST',
      body: clubData,
    });
  }

  // Post endpoints
  async getPosts() {
    return this.request('/posts');
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: postData,
    });
  }

  // Election endpoints
  async getElections() {
    return this.request('/elections');
  }

  async createElection(electionData) {
    return this.request('/elections', {
      method: 'POST',
      body: electionData,
    });
  }

  async voteInElection(electionId, candidateId) {
    return this.request(`/elections/${electionId}/vote`, {
      method: 'POST',
      body: { candidateId },
    });
  }

  async announceElectionResults(electionId) {
    return this.request(`/elections/${electionId}/announce`, {
      method: 'POST',
    });
  }

  async updateElectionStatus(electionId, status) {
    return this.request(`/elections/${electionId}/status`, {
      method: 'PATCH',
      body: { status },
    });
  }

  async deleteElection(electionId) {
    return this.request(`/elections/${electionId}`, {
      method: 'DELETE',
    });
  }

  // Contact endpoints
  async submitContactMessage(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: contactData,
    });
  }
}

export const apiService = new ApiService();
export default apiService;