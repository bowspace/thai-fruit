import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Transform DB snake_case rows to frontend camelCase
function mapStore(s) {
    return {
        id: s.id,
        ownerId: s.owner_id,
        name: s.name,
        nameEn: s.name_en,
        nameCn: s.name_cn,
        owner: s.owner_name,
        description: s.description,
        descriptionEn: s.description_en,
        descriptionCn: s.description_cn,
        address: s.address,
        addressEn: s.address_en,
        addressCn: s.address_cn,
        pickup: s.pickup_info,
        pickupEn: s.pickup_info_en,
        pickupCn: s.pickup_info_cn,
        phone: s.phone,
        avatar: s.avatar_url || '🏪',
        rating: parseFloat(s.rating) || 0,
        totalSales: s.total_sales || 0,
        isActive: s.is_active,
        createdAt: s.created_at,
    };
}

function mapProduct(p, units = []) {
    return {
        id: p.id,
        storeId: p.store_id,
        name: p.name,
        nameEn: p.name_en,
        nameCn: p.name_cn,
        description: p.description,
        descriptionEn: p.description_en,
        descriptionCn: p.description_cn,
        category: p.category_id,
        images: p.images || [],
        featured: p.is_featured,
        units: units
            .filter(u => u.product_id === p.id)
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map(u => ({
                id: u.id,
                label: u.label,
                labelEn: u.label_en,
                labelCn: u.label_cn,
                price: parseFloat(u.price),
            })),
    };
}

function mapCategory(c) {
    return {
        id: c.id,
        name: c.name,
        nameEn: c.name_en,
        nameCn: c.name_cn,
        icon: c.icon,
        sortOrder: c.sort_order,
    };
}

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch data from Supabase on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const [catRes, storeRes, prodRes, unitRes] = await Promise.all([
                    supabase.from('categories').select('*').order('sort_order'),
                    supabase.from('stores').select('*').eq('is_active', true),
                    supabase.from('products').select('*').eq('is_active', true),
                    supabase.from('product_units').select('*').order('sort_order'),
                ]);

                if (catRes.data) setCategories(catRes.data.map(mapCategory));
                if (storeRes.data) setStores(storeRes.data.map(mapStore));
                if (prodRes.data && unitRes.data) {
                    setProducts(prodRes.data.map(p => mapProduct(p, unitRes.data)));
                }
            } catch (err) {
                console.error('Failed to fetch data from Supabase:', err);
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

        // Find user's store
        const store = stores.find(s => s.ownerId === user.id);
        if (!store) {
            showToast('คุณยังไม่มีร้านค้า', 'error');
            return null;
        }

        const { data: newProduct, error } = await supabase
            .from('products')
            .insert({
                store_id: store.id,
                name: data.name,
                name_en: data.nameEn || null,
                description: data.description,
                description_en: data.descriptionEn || null,
                category_id: data.category || null,
                images: data.images?.length ? data.images : [],
                is_featured: false,
            })
            .select()
            .single();

        if (error) {
            showToast('เพิ่มสินค้าไม่สำเร็จ: ' + error.message, 'error');
            return null;
        }

        // Insert units
        if (data.units?.length) {
            const { data: newUnits } = await supabase
                .from('product_units')
                .insert(data.units.map((u, i) => ({
                    product_id: newProduct.id,
                    label: u.label,
                    label_en: u.labelEn || null,
                    price: parseFloat(u.price) || 0,
                    sort_order: i + 1,
                })))
                .select();

            const mapped = mapProduct(newProduct, newUnits || []);
            setProducts(prev => [...prev, mapped]);
            showToast('เพิ่มสินค้า ' + data.name + ' สำเร็จ!');
            return mapped;
        }

        const mapped = mapProduct(newProduct, []);
        setProducts(prev => [...prev, mapped]);
        showToast('เพิ่มสินค้า ' + data.name + ' สำเร็จ!');
        return mapped;
    }, [user, stores, showToast]);

    const updateStore = useCallback(async (storeId, data) => {
        const { error } = await supabase
            .from('stores')
            .update({
                name: data.name,
                name_en: data.nameEn,
                description: data.description,
                description_en: data.descriptionEn,
                address: data.address,
                address_en: data.addressEn,
                pickup_info: data.pickup,
                pickup_info_en: data.pickupEn,
                phone: data.phone,
                updated_at: new Date().toISOString(),
            })
            .eq('id', storeId);

        if (error) {
            showToast('บันทึกไม่สำเร็จ: ' + error.message, 'error');
            return;
        }

        setStores(prev => prev.map(s => s.id === storeId ? { ...s, ...data } : s));
        showToast('บันทึกข้อมูลร้านค้าเรียบร้อย');
    }, [showToast]);

    const placeOrder = useCallback(async () => {
        if (!user || cart.length === 0) return;

        const grouped = cart.reduce((acc, item) => {
            if (!acc[item.store.id]) acc[item.store.id] = { store: item.store, items: [] };
            acc[item.store.id].items.push(item);
            return acc;
        }, {});

        for (const { store, items } of Object.values(grouped)) {
            const total = items.reduce((s, i) => s + i.unit.price * i.qty, 0);
            const orderNumber = 'TF' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

            const { data: order, error } = await supabase
                .from('orders')
                .insert({
                    order_number: orderNumber,
                    store_id: store.id,
                    buyer_id: user.id,
                    total: total,
                    status: 'pending',
                })
                .select()
                .single();

            if (error) {
                showToast('สั่งซื้อไม่สำเร็จ: ' + error.message, 'error');
                return;
            }

            await supabase.from('order_items').insert(
                items.map(i => ({
                    order_id: order.id,
                    product_id: i.product.id,
                    product_name: i.product.name,
                    unit_label: i.unit.label,
                    unit_price: i.unit.price,
                    qty: i.qty,
                    subtotal: i.unit.price * i.qty,
                }))
            );

            setOrders(prev => [{
                id: order.id,
                orderNumber: order.order_number,
                storeId: store.id,
                buyerName: user.name,
                items: items.map(i => ({
                    productId: i.product.id,
                    productName: i.product.name,
                    unit: i.unit.label,
                    qty: i.qty,
                    price: i.unit.price,
                })),
                total,
                status: 'pending',
                date: new Date().toISOString().split('T')[0],
                note: '',
            }, ...prev]);
        }

        setCart([]);
        showToast('สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ');
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
