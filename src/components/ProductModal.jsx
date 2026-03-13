import { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';

export default function ProductModal({ product, store, onClose, onLoginClick }) {
    const { user, addToCart } = useApp();
    const { t, locField } = useLang();
    const [selectedUnit, setSelectedUnit] = useState(product.units[0]);
    const [qty, setQty] = useState(1);
    const [animationClass, setAnimationClass] = useState('modal-enter');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => document.body.style.overflow = 'auto';
    }, []);

    const total = selectedUnit.price * qty;

    const handleClose = () => {
        setAnimationClass('modal-exit');
        setTimeout(onClose, 250);
    };

    const handleAdd = () => {
        if (!user) {
            handleClose();
            setTimeout(onLoginClick, 250);
            return;
        }
        const success = addToCart({ product, store, unit: selectedUnit, qty });
        if (success) {
            handleClose();
        }
    };

    return (
        <div className="overlay" onClick={(e) => {
            if (e.target.classList.contains('overlay')) handleClose();
        }}>
            <div className={`modal ${animationClass}`}>
                <button className="btn-close" onClick={handleClose}>
                    <X size={20} />
                </button>

                <div className="modal-img">
                    {product.images?.[0] ? (
                        <img src={product.images[0]} alt={locField(product, 'name')} />
                    ) : (
                        <span className="product-img-emoji">🍎</span>
                    )}
                </div>

                <div className="modal-body">
                    <div className="modal-store">
                        <span>🏪</span> {locField(store, 'name') || t('modal.defaultStore')}
                    </div>
                    <h2 className="modal-name">{locField(product, 'name')}</h2>
                    <p className="modal-desc">{locField(product, 'description')}</p>

                    <div className="modal-section-label">{t('modal.selectUnit')}</div>
                    <div className="unit-options">
                        {product.units.map((u) => (
                            <div
                                key={u.id}
                                className={`unit-option ${selectedUnit.id === u.id ? 'selected' : ''}`}
                                onClick={() => setSelectedUnit(u)}
                            >
                                <span className="unit-option-label">{locField(u, 'label')}</span>
                                <span className="unit-option-price">฿{u.price.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="qty-row">
                        <span className="qty-label">{t('modal.qty')} {locField(selectedUnit, 'label')}</span>
                        <div className="qty-ctrl">
                            <button
                                className="qty-btn"
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                disabled={qty <= 1}
                            >
                                <Minus size={16} />
                            </button>
                            <div className="qty-val">{qty}</div>
                            <button
                                className="qty-btn"
                                onClick={() => setQty(qty + 1)}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '16px', background: 'var(--primary-lighter)', borderRadius: 'var(--radius)' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-dark)' }}>{t('modal.total')}</span>
                        <span className="modal-total" style={{ margin: 0 }}>฿{total.toLocaleString()}</span>
                    </div>

                    {!user && (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, background: 'var(--bg)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                            <Info size={16} color="var(--primary)" /> {t('modal.loginRequired')}
                        </div>
                    )}

                    <button className="btn-add-cart" onClick={handleAdd}>
                        <ShoppingCart size={20} />
                        {user ? t('modal.addToCart') : t('modal.loginToOrder')}
                    </button>
                </div>
            </div>
        </div>
    );
}
