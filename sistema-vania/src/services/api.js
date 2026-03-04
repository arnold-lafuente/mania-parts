const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const STORAGE_KEY = 'sv_user';

const getSession = () => {
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
};

const setSession = (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
};

const getHeaders = () => {
    const user = getSession();
    const headers = {
        'Content-Type': 'application/json',
    };
    if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
        throw new Error(error.message || response.statusText);
    }
    const text = await response.text();
    if (!text) return {};
    try {
        return JSON.parse(text);
    } catch (e) {
        return { message: text };
    }
};

const IS_DEV_BYPASS = import.meta.env.VITE_ENV === 'dev';

export const api = {
    // Auth
    login: async (credentials) => {
        if (IS_DEV_BYPASS) {
            const devSession = { token: 'dev-bypass', user: { id: 1, username: 'dev', role: 'admin' } };
            setSession(devSession);
            return devSession;
        }
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const user = await handleResponse(response);
        setSession(user);
        return user;
    },
    logout: () => {
        clearSession();
    },
    getUser: () => {
        return getSession();
    },
    isAuthenticated: () => {
        return !!getSession();
    },

    // Products
    getProducts: async (search = '') => {
        const url = new URL(`${API_URL}/products`);
        if (search) {
            url.searchParams.append('search', search);
        }
        const response = await fetch(url.toString(), {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
    saveProduct: async (product) => {
        const method = product.id ? 'PATCH' : 'POST';
        const url = product.id ? `${API_URL}/products/${product.id}` : `${API_URL}/products`;
        const response = await fetch(url, {
            method,
            headers: getHeaders(),
            body: JSON.stringify(product),
        });
        return handleResponse(response);
    },
    deleteProduct: async (id) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // Batches / Registro de Factura
    registerBatch: async (batchData) => {
        const response = await fetch(`${API_URL}/batches`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(batchData),
        });
        return handleResponse(response);
    },
    getInvoiceHistory: async () => {
        const response = await fetch(`${API_URL}/batches/history`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // Clients
    getClients: async () => {
        const response = await fetch(`${API_URL}/clients`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
    saveClient: async (client) => {
        console.log(client)
        const method = client.id ? 'PUT' : 'POST';
        const url = client.id ? `${API_URL}/clients/${client.id}` : `${API_URL}/clients`;
        const response = await fetch(url, {
            method,
            headers: getHeaders(),
            body: JSON.stringify(client),
        });
        return handleResponse(response);
    },
    deleteClient: async (id) => {
        const response = await fetch(`${API_URL}/clients/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // Proformas / Sales
    getProformas: async () => {
        const response = await fetch(`${API_URL}/proformas`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
    saveProforma: async (proforma) => {
        const payload = {
            clientId: proforma.client?.id ?? proforma.clientId,
            items: (proforma.items || []).map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                price: i.price,
            })),
            discount: proforma.discount ?? 0,
        };
        const response = await fetch(`${API_URL}/proformas`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        return handleResponse(response);
    },
    updateProformaStatus: async (id, status) => {
        const response = await fetch(`${API_URL}/proformas/${id}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    },
};
