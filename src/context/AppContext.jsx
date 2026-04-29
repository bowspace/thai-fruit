import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

const AppContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch data from the backend API on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const [cats, sts, prodResp] = await Promise.all([
                    api.categories.list(),
                    api.stores.list(),
                    api.products.list({ limit: 100 }),
                ]);
                setCategories(cats);
                setStores(sts);
                setProducts(prodResp.products);
            } catch (err) {
                console.error('Failed to fetch data from API:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const showToast = useCallback((msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // Auth: login via backend API (handles email confirmation properly)
    const login = useCallback(async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                showToast(data.error || data.message || 'Login failed', 'error');
                return false;
            }

            // Set Supabase session so client is authenticated for RLS
            if (data.session) {
                await supabase.auth.setSession({
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                });
            }

            setUser({
                id: data.user.id,
                email: email,
                name: data.user.name || email,
                nameEn: data.user.name_en,
                avatar: data.user.avatar_url,
                role: data.user.role || 'buyer',
            });
            showToast('เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ' + (data.user.name || email));
            return true;
        } catch (err) {
            showToast('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', 'error');
            return false;
        }
    }, [showToast]);

    // Auth: signup via backend API (auto-confirms email)
    const signup = useCallback(async (email, password, name, role = 'buyer') => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name, role }),
            });
            const data = await res.json();
            if (!res.ok) {
                showToast(data.error || data.message || 'Signup failed', 'error');
                return false;
            }

            // Set Supabase session so client is authenticated for RLS
            if (data.session) {
                await supabase.auth.setSession({
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                });
            }

            setUser({
                id: data.user.id,
                email: email,
                name: name,
                role: role,
            });
            showToast('สมัครสมาชิกสำเร็จ! ยินดีต้อนรับ ' + name);
            return true;
        } catch (err) {
            showToast('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', 'error');
            return false;
        }
    }, [showToast]);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        showToast('ออกจากระบบเรียบร้อย');
    }, [showToast]);

    // Check existing session on mount
    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: profile?.name || session.user.email,
                    nameEn: profile?.name_en,
                    avatar: profile?.avatar_url,
                    role: profile?.role || 'buyer',
                    lineId: profile?.line_id,
                });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const addToCart = useCallback(({ product, store, unit, qty }) => {
        if (!user) return false;
        setCart(prev => [...prev, { product, store, unit, qty, addedAt: Date.now() }]);
        showToast(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`);
        return true;
    }, [user, showToast]);

    const removeFromCart = useCallback((idx) => {
        setCart(prev => prev.filter((_, i) => i !== idx));
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const addProduct = useCallback(async (data) => {
        if (!user) return null;

        const store = stores.find(s => s.ownerId === user.id);
        if (!store) {
            showToast('คุณยังไม่มีร้านค้า', 'error');
            return null;
        }

        try {
            const newProduct = await api.products.create({
                name: data.name,
                name_en: data.nameEn || undefined,
                description: data.description || undefined,
                description_en: data.descriptionEn || undefined,
                category_id: data.category || undefined,
                images: data.images?.length ? data.images : [],
                is_featured: false,
                units: (data.units || []).map((u, i) => ({
                    label: u.label,
                    label_en: u.labelEn || undefined,
                    price: parseFloat(u.price) || 0,
                    sort_order: i + 1,
                })),
            });
            setProducts(prev => [...prev, newProduct]);
            showToast('เพิ่มสินค้า ' + data.name + ' สำเร็จ!');
            return newProduct;
        } catch (err) {
            showToast('เพิ่มสินค้าไม่สำเร็จ: ' + err.message, 'error');
            return null;
        }
    }, [user, stores, showToast]);

    const updateStore = useCallback(async (storeId, data) => {
        try {
            const updated = await api.stores.update(storeId, {
                name: data.name,
                name_en: data.nameEn || undefined,
                description: data.description || undefined,
                description_en: data.descriptionEn || undefined,
                address: data.address || undefined,
                address_en: data.addressEn || undefined,
                pickup_info: data.pickup || undefined,
                pickup_info_en: data.pickupEn || undefined,
                phone: data.phone || undefined,
            });
            setStores(prev => prev.map(s => s.id === storeId ? updated : s));
            showToast('บันทึกข้อมูลร้านค้าเรียบร้อย');
        } catch (err) {
            showToast('บันทึกไม่สำเร็จ: ' + err.message, 'error');
        }
    }, [showToast]);

    const placeOrder = useCallback(async () => {
        if (!user || cart.length === 0) return;

        try {
            const newOrders = await api.orders.create({
                items: cart.map(i => ({
                    product_id: i.product.id,
                    unit_id: i.unit.id,
                    qty: i.qty,
                })),
            });

            // Adapt the API order shape to the local-state shape that Seller.jsx renders today.
            // (The seller dashboard reads o.buyerName / item.unit / item.price / o.date — kept stable.)
            const adapted = newOrders.map(o => ({
                id: o.id,
                orderNumber: o.orderNumber,
                storeId: o.storeId,
                buyerName: user.name,
                items: o.items.map(it => ({
                    productId: it.productId,
                    productName: it.productName,
                    unit: it.unitLabel,
                    qty: it.qty,
                    price: it.unitPrice,
                })),
                total: o.total,
                status: o.status,
                date: (o.createdAt || new Date().toISOString()).split('T')[0],
                note: o.note || '',
            }));
            setOrders(prev => [...adapted, ...prev]);
            setCart([]);
            showToast('สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ');
        } catch (err) {
            showToast('สั่งซื้อไม่สำเร็จ: ' + err.message, 'error');
        }
    }, [user, cart, showToast]);

    const value = {
        user, login, logout, signup,
        cart, addToCart, removeFromCart, clearCart,
        products, addProduct,
        stores, updateStore,
        categories,
        orders,
        toast, showToast,
        placeOrder,
        loading,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
