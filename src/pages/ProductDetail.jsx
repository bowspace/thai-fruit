import { useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart, Info, Star, MapPin, Store as StoreIcon, Phone, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';

export default function ProductDetail({ product, store, onBack, onProductClick, onStoreClick, onLoginClick }) {
    const { user, addToCart, products, stores, categories } = useApp();
    const { t, locField } = useLang();
    const [selectedUnit, setSelectedUnit] = useState(product.units[0]);
    const [qty, setQty] = useState(1);
    const [activeImg, setActiveImg] = useState(0);

    const total = selectedUnit.price * qty;
    const category = categories.find(c => c.id === product.category);
    const province = (() => {
        const addr = locField(store, 'address') || '';
        if (addr.includes('จ.')) return `จ.${addr.split(' จ.')[1]}`;
        return addr;
    })();

    const handleAdd = () => {
        if (!user) {
            onLoginClick();
            return;
        }
        addToCart({ product, store, unit: selectedUnit, qty });
    };

    // Related products: same category first, then same store, exclude current
    const relatedProducts = products
        .filter(p => p.id !== product.id)
        .sort((a, b) => {
            const aScore = (a.category === product.category ? 2 : 0) + (a.storeId === product.storeId ? 1 : 0);
            const bScore = (b.category === product.category ? 2 : 0) + (b.storeId === product.storeId ? 1 : 0);
            return bScore - aScore;
        })
        .slice(0, 4);

    return (
        <div className="animate-fade-in">
            {/* Back button */}
            <button
                className="btn-secondary"
                onClick={onBack}
                style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'white' }}
            >
                <ArrowLeft size={16} /> {t('pd.back')}
            </button>

            {/* Main content: two columns */}
            <div className="pd-layout">
                {/* Left: Image */}
                <div className="pd-image-section">
                    <div className="pd-main-image">
                        {product.images?.[activeImg] ? (
                            <img src={product.images[activeImg]} alt={locField(product, 'name')} />
                        ) : (
                            <span className="product-img-emoji">🍎</span>
                        )}
                        {product.featured && (
                            <div className="product-featured">{t('product.featured')}</div>
                        )}
                    </div>
                    {product.images?.length > 1 && (
                        <div className="pd-thumbnails">
                            {product.images.map((img, i) => (
                                <div
                                    key={i}
                                    className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                                    onClick={() => setActiveImg(i)}
                                >
                                    <img src={img} alt="" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div className="pd-info-section">
                    {/* Store link */}
                    <div
                        className="pd-store-link"
                        onClick={() => onStoreClick(store)}
                    >
                        <div className="pd-store-avatar">{store.avatar}</div>
                        <div>
                            <div className="pd-store-name">{locField(store, 'name')}</div>
                            <div className="pd-store-meta">
                                <Star size={12} color="var(--orange)" />
                                {store.rating} · {store.totalSales}+ {t('pd.sales')}
                            </div>
                        </div>
                    </div>

                    <h1 className="pd-product-name">{locField(product, 'name')}</h1>
                    <p className="pd-product-desc">{locField(product, 'description')}</p>

                    {/* Tags row */}
                    <div className="pd-tags">
                        {category && (
                            <span className="pd-tag">
                                <span aria-hidden="true">{category.icon}</span>
                                {locField(category, 'name')}
                            </span>
                        )}
                        {province && (
                            <span className="pd-tag">
                                <MapPin size={12} color="var(--primary)" />
                                {province}
                            </span>
                        )}
                        <span className="pd-tag">
                            <Leaf size={12} color="var(--primary)" />
                            {t('pd.fresh')}
                        </span>
                    </div>

                    {/* Display price (reflects selected unit) */}
                    <div className="pd-price-display">
                        <sup>฿</sup>{selectedUnit.price.toLocaleString()}
                    </div>
                    <div className="pd-price-unit">{t('pd.per')} {locField(selectedUnit, 'label')}</div>

                    {/* Unit selection — horizontal pills */}
                    <div className="modal-section-label">{t('modal.selectUnit')}</div>
                    <div className="unit-options unit-options--row">
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

                    {/* Quantity */}
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

                    {/* Total */}
                    <div className="pd-total-bar">
                        <span className="pd-total-label">{t('modal.total')}</span>
                        <span className="pd-total-price">฿{total.toLocaleString()}</span>
                    </div>

                    {/* Login hint */}
                    {!user && (
                        <div className="pd-login-hint">
                            <Info size={16} color="var(--primary)" /> {t('modal.loginRequired')}
                        </div>
                    )}

                    {/* Add to cart */}
                    <button className="btn-add-cart" onClick={handleAdd}>
                        <ShoppingCart size={20} />
                        {user ? t('modal.addToCart') : t('modal.loginToOrder')}
                    </button>
                </div>
            </div>

            {/* Store info card */}
            <div className="pd-store-card">
                <h3 className="pd-section-title">
                    <StoreIcon size={20} /> {t('pd.aboutStore')}
                </h3>
                <div className="pd-store-card-body" onClick={() => onStoreClick(store)} style={{ cursor: 'pointer' }}>
                    <div className="pd-store-card-avatar">{store.avatar}</div>
                    <div className="pd-store-card-info">
                        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{locField(store, 'name')}</div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>
                            {locField(store, 'description')}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Star size={13} color="var(--orange)" /> {store.rating}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={13} color="var(--primary)" /> {locField(store, 'address')}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Phone size={13} color="var(--primary)" /> {store.phone}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* More from this farm */}
            {relatedProducts.length > 0 && (
                <div className="pd-related">
                    <h3 className="pd-section-title section-title--display">
                        <span>🌾</span> {t('pd.relatedFarm')}
                    </h3>
                    <div className="products-grid">
                        {relatedProducts.map((p) => {
                            const pStore = stores.find(s => s.id === p.storeId);
                            const minPrice = Math.min(...p.units.map(u => u.price));
                            return (
                                <div
                                    key={p.id}
                                    className="product-card"
                                    onClick={() => onProductClick(p, pStore)}
                                >
                                    <div className="product-img">
                                        {p.featured && <div className="product-featured">{t('product.featured')}</div>}
                                        {p.images?.[0] ? (
                                            <img src={p.images[0]} alt={locField(p, 'name')} loading="lazy" />
                                        ) : (
                                            <div className="product-img-emoji">🍎</div>
                                        )}
                                    </div>
                                    <div className="product-body">
                                        {pStore && (
                                            <div className="product-store">
                                                <StoreIcon size={12} /> {locField(pStore, 'name')}
                                            </div>
                                        )}
                                        <h3 className="product-name" title={locField(p, 'name')}>{locField(p, 'name')}</h3>
                                        <p className="product-desc">{locField(p, 'description')}</p>
                                        <div className="product-price">
                                            ฿{minPrice.toLocaleString()} <span>{t('product.from')}</span>
                                        </div>
                                        <button
                                            className="btn-add"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onProductClick(p, pStore);
                                            }}
                                        >
                                            <ShoppingCart size={16} /> {t('product.addToCart')}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
