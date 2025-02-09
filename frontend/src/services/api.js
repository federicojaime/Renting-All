const API_URL = import.meta.env.VITE_API_URL;

class ApiService {
    static handleTokenError(responseData) {
        if (responseData.msg === 'Token not found.') {
            localStorage.removeItem('token');
            window.location.href = '/renting-all/';
        }
    }

    static getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token
        };
    }

    static async get(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: this.getAuthHeaders()
            });
            const responseData = await response.json();
            this.handleTokenError(responseData);
            return responseData;
        } catch (error) {
            console.error('API Get Error:', error);
            throw error;
        }
    }

    static async post(endpoint, data) {
        try {
            console.log('Enviando request a:', `${API_URL}${endpoint}`);
            console.log('Datos:', data);

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    ...this.getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            console.log('Respuesta del servidor:', responseData);

            this.handleTokenError(responseData);

            if (!response.ok) {
                throw new Error(responseData.errores[0] || 'Error en la respuesta del servidor');
            }

            return responseData;
        } catch (error) {
            console.error('API Post Error:', error);
            throw error;
        }
    }

    static async patch(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PATCH',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            this.handleTokenError(responseData);
            return responseData;
        } catch (error) {
            console.error('API Patch Error:', error);
            throw error;
        }
    }

    static async delete(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            const responseData = await response.json();
            this.handleTokenError(responseData);
            return responseData;
        } catch (error) {
            console.error('API Delete Error:', error);
            throw error;
        }
    }
}

export default ApiService;