// Single egress to the backend. Reads VITE_API_URL, attaches the JWT from
// localStorage, normalises errors, and exposes resource-grouped methods.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
const TOKEN_KEY = 'thaifruit-token';

export const tokenStore = {
    get: () => {
        try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
    },
    set: (token) => {
        try { localStorage.setItem(TOKEN_KEY, token); } catch { /* noop */ }
    },
    clear: () => {
        try { localStorage.removeItem(TOKEN_KEY); } catch { /* noop */ }
    },
};

export class ApiError extends Error {
    constructor(message, status, body) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.body = body;
    }
}

async function request(method, path, { body, query, isFormData } = {}) {
    let url = `${BASE}${path}`;
    if (query) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(query)) {
            if (v != null && v !== '') params.append(k, v);
        }
        const qs = params.toString();
        if (qs) url += `?${qs}`;
    }

    const headers = { Accept: 'application/json' };
    if (!isFormData && body !== undefined) headers['Content-Type'] = 'application/json';
    // ngrok free tier shows an HTML interstitial on browser visits — this header bypasses it.
    headers['ngrok-skip-browser-warning'] = 'true';

    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;

    const init = { method, headers };
    if (body !== undefined) {
        init.body = isFormData ? body : JSON.stringify(body);
    }

    const res = await fetch(url, init);
    const ct = res.headers.get('content-type') || '';
    const data = ct.includes('application/json')
        ? await res.json().catch(() => null)
        : await res.text();

    if (!res.ok) {
        const msg = (data && typeof data === 'object' && (data.error || data.message)) || `HTTP ${res.status}`;
        throw new ApiError(msg, res.status, data);
    }

    return data;
}

const get = (path, query) => request('GET', path, { query });
const post = (path, body) => request('POST', path, { body });
const put = (path, body) => request('PUT', path, { body });
const patch = (path, body) => request('PATCH', path, { body });
const del = (path) => request('DELETE', path);

export const api = {
    auth: {
        signup: (payload) => post('/auth/signup', payload),
        login: (payload) => post('/auth/login', payload),
        me: () => get('/auth/me'),
        // No server-side logout endpoint yet — clear the local token only.
        logout: async () => { tokenStore.clear(); },
    },
    categories: {
        list: () => get('/categories'),
    },
    stores: {
        list: () => get('/stores'),
        get: (id) => get(`/stores/${id}`),
        create: (payload) => post('/stores', payload),
        update: (id, payload) => put(`/stores/${id}`, payload),
    },
    products: {
        list: (query) => get('/products', query),
        get: (id) => get(`/products/${id}`),
        create: (payload) => post('/products', payload),
        update: (id, payload) => put(`/products/${id}`, payload),
        remove: (id) => del(`/products/${id}`),
    },
    orders: {
        list: () => get('/orders'),
        get: (id) => get(`/orders/${id}`),
        create: (payload) => post('/orders', payload),
        updateStatus: (id, status) => patch(`/orders/${id}/status`, { status }),
    },
    upload: {
        image: (file) => {
            const fd = new FormData();
            fd.append('image', file);
            return request('POST', '/upload/image', { body: fd, isFormData: true });
        },
    },
};
