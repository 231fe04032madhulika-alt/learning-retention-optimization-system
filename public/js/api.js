const API_URL = 'http://localhost:3000/api';

const api = {
    // Utility for generic fetch logic
    async fetchJSON(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    app.logout();
                }
                throw new Error(data?.message || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth API
    auth: {
        async login(email, password) {
            const data = await api.fetchJSON('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            localStorage.setItem('token', data.token);
            return data;
        },
        async signup(userData) {
            const data = await api.fetchJSON('/auth/signup', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            localStorage.setItem('token', data.token);
            return data;
        },
        async me() {
            return await api.fetchJSON('/auth/me', { method: 'GET' });
        },
        async updateProfile(profileData) {
            return await api.fetchJSON('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
        },
        async changePassword(currentPassword, newPassword) {
            return await api.fetchJSON('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({ currentPassword, newPassword })
            });
        },
        async requestEmailChange(currentPassword, newEmail) {
            return await api.fetchJSON('/auth/request-email-change', {
                method: 'POST',
                body: JSON.stringify({ currentPassword, newEmail })
            });
        },
        async verifyEmailChange(otp) {
            return await api.fetchJSON('/auth/verify-email-change', {
                method: 'POST',
                body: JSON.stringify({ otp })
            });
        },
        async requestPasswordReset(email) {
            return await api.fetchJSON('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
        },
        async resetPasswordWithOtp(email, otp, newPassword) {
            return await api.fetchJSON('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email, otp, newPassword })
            });
        }
    },

    // Schedule API
    schedule: {
        async generate() {
            return await api.fetchJSON('/schedule/generate', { method: 'POST' });
        },
        async getToday() {
            return await api.fetchJSON('/schedule/today', { method: 'GET' });
        },
        async markDone(scheduleId) {
            return await api.fetchJSON('/schedule/done', {
                method: 'POST',
                body: JSON.stringify({ scheduleId })
            });
        }
    },
    
    // Syllabus API
    syllabus: {
        async upload(payload) {
            return await api.fetchJSON('/syllabus/upload', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        },
        async extract(formData) {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
            const response = await fetch(`${API_URL}/extract`, {
                method: 'POST',
                headers, // do NOT set Content-Type to application/json so the browser fills boundaries
                body: formData
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'File extraction failed');
            return data;
        }
    },

    // Tests API
    tests: {
        async get(level, topic) {
            return await api.fetchJSON(`/test/${level}?topic=${encodeURIComponent(topic)}`, { method: 'GET' });
        },
        async submit(topic, level, answers) {
            return await api.fetchJSON('/test/submit', {
                method: 'POST',
                body: JSON.stringify({ topic, level, answers })
            });
        }
    },

    // Admin API
    admin: {
        async getStats() {
            return await api.fetchJSON('/admin/stats', { method: 'GET' });
        },
        async getUsers() {
            return await api.fetchJSON('/admin/users', { method: 'GET' });
        },
        async deleteUser(id) {
            return await api.fetchJSON(`/admin/users/${id}`, { method: 'DELETE' });
        },
        async getSyllabuses() {
            return await api.fetchJSON('/admin/syllabuses', { method: 'GET' });
        },
        async deleteSyllabus(id) {
            return await api.fetchJSON(`/admin/syllabuses/${id}`, { method: 'DELETE' });
        },
        async getSchedules() {
            return await api.fetchJSON('/admin/schedules', { method: 'GET' });
        },
        async deleteSchedule(id) {
            return await api.fetchJSON(`/admin/schedules/${id}`, { method: 'DELETE' });
        },
        async getMockTests() {
            return await api.fetchJSON('/admin/mocktests', { method: 'GET' });
        },
        async deleteMockTest(id) {
            return await api.fetchJSON(`/admin/mocktests/${id}`, { method: 'DELETE' });
        }
    }
};
