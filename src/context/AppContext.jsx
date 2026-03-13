import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USER, MOCK_STORES, MOCK_PRODUCTS, MOCK_ORDERS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [stores, setStores] = useState(MOCK_STORES);
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const login = useCallback(() => {
        setUser(MOCK_USER);
        showToast('เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ' + MOCK_USER.name);
    }, [showToast]);

    const logout = useCallback(() => {
        setUser(null);
        showToast('ออกจากระบบเรียบร้อย');
    }, [showToast]);

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

    const addProduct = useCallback((data) => {
        const newP = {
            id: 'p' + Date.now(),
            storeId: stores[0]?.id,
            name: data.name,
            description: data.description,
            images: data.images?.length ? data.images : ['/images/fruits-collection.png'],
            units: data.units.map(u => ({
                id: u.id || Date.now().toString(),
                label: u.label,
                price: parseFloat(u.price) || 0,
            })),
            category: data.category,
            featured: false,
        };
        setProducts(prev => [...prev, newP]);
        showToast('เพิ่มสินค้า ' + data.name + ' สำเร็จ!');
        return newP;
    }, [stores, showToast]);

    const updateStore = useCallback((storeId, data) => {
        setStores(prev => prev.map(s => s.id === storeId ? { ...s, ...data } : s));
        showToast('บันทึกข้อมูลร้านค้าเรียบร้อย');
    }, [showToast]);

    const placeOrder = useCallback(() => {
        if (!user || cart.length === 0) return;
        const grouped = cart.reduce((acc, item) => {
            if (!acc[item.store.id]) acc[item.store.id] = { store: item.store, items: [] };
            acc[item.store.id].items.push(item);
            return acc;
        }, {});

        const newOrders = Object.values(grouped).map(({ store, items }) => ({
            id: 'o' + Date.now() + Math.random().toString(36).slice(2, 6),
            storeId: store.id,
            buyerName: user.name,
            items: items.map(i => ({
                productId: i.product.id,
                productName: i.product.name,
                unit: i.unit.label,
                qty: i.qty,
                price: i.unit.price,
            })),
            total: items.reduce((s, i) => s + i.unit.price * i.qty, 0),
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            note: '',
        }));

        setOrders(prev => [...newOrders, ...prev]);
        setCart([]);
        showToast('สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ');
    }, [user, cart, showToast]);

    const value = {
        user, login, logout,
        cart, addToCart, removeFromCart, clearCart,
        products, addProduct,
        stores, updateStore,
        orders,
        toast, showToast,
        placeOrder,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
