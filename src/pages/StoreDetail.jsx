import { ArrowLeft, MapPin, Store as StoreIcon, Phone, Star, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';

export default function StoreDetail({ store, onProductClick, onBack }) {
    const { products } = useApp();
    const { t, locField } = useLang();

    if (!store) {
        return (
            <div className="empty">
                <div className="empty-icon">🏪</div>
                <h3>{t('store.notFound')}</h3>
            </div>
        );
    }

    const storeProducts = products.filter(p => p.storeId === store.id);

    return (
        <div className="animate-fade-in">
            <button
                className="btn-secondary"
                onClick={onBack}
                style={{ marginBottom: 'var(--space-5)', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'white' }}
            >
                <ArrowLeft size={16} /> {t('store.backHome')}
            </button>

            {/* Cinematic cover */}
            <header className="store-detail-cover">
                <div className="store-detail-cover-overlay" />
                <span className="store-detail-cover-mark" aria-hidden="true">{store.avatar}</span>
                <div className="store-detail-cover-body">
                    <h1 className="store-detail-cover-name">{locField(store, 'name')}</h1>
                    {store.owner && (
                        <p className="store-detail-cover-owner">{t('store.tendedBy')} {store.owner}</p>
                    )}
                    <span className="store-detail-cover-rating">
                        <Star size={14} color="var(--accent)" fill="var(--accent)" />
                        {store.rating} · {store.totalSales}+ {t('store.reviews')}
                    </span>
                </div>
            </header>

            {/* Info ribbon */}
            <div className="store-detail-ribbon">
                {locField(store, 'address') && (
                    <div className="store-detail-ribbon-item">
                        <MapPin size={14} color="var(--primary)" />
                        <span>{locField(store, 'address')}</span>
                    </div>
                )}
                {store.phone && (
                    <div className="store-detail-ribbon-item">
                        <Phone size={14} color="var(--primary)" />
                        <span>{store.phone}</span>
                    </div>
                )}
                {locField(store, 'pickup') && (
                    <div className="store-detail-ribbon-item">
                        <StoreIcon size={14} color="var(--primary)" />
                        <span><strong>{t('store.pickupAt')}:</strong>{locField(store, 'pickup')}</span>
                    </div>
                )}
            </div>

            {/* About */}
            {locField(store, 'description') && (
                <p className="store-detail-about">{locField(store, 'description')}</p>
            )}

            {/* Today at {store name} */}
            <h2 className="section-title section-title--display">
                <span className="section-title-icon">🍎</span>
                {t('store.todayAt', { name: locField(store, 'name') })}
            </h2>

            {storeProducts.length === 0 ? (
                <div className="empty" style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <div className="empty-icon">🌱</div>
                    <h3>{t('store.preparing')}</h3>
                    <p>{t('store.preparingDesc')}</p>
                </div>
            ) : (
                <div className="products-grid">
                    {storeProducts.map((p) => {
                        const minPrice = Math.min(...p.units.map((u) => u.price));
                        return (
                            <div key={p.id} className="product-card" onClick={() => onProductClick(p, store)}>
                                <div className="product-img">
                                    {p.featured && <div className="product-featured">{t('product.featured')}</div>}
                                    {p.images?.[0] ? (
                                        <img src={p.images[0]} alt={locField(p, 'name')} loading="lazy" />
                                    ) : (
                                        <div className="product-img-emoji">🍎</div>
                                    )}
                                </div>
                                <div className="product-body">
                                    <h3 className="product-name" title={locField(p, 'name')}>{locField(p, 'name')}</h3>
                                    <p className="product-desc">{locField(p, 'description')}</p>
                                    <div className="product-price">
                                        ฿{minPrice.toLocaleString()} <span>{t('product.from')}</span>
                                    </div>
                                    <button
                                        className="btn-add"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onProductClick(p, store);
                                        }}
                                    >
                                        <ShoppingCart size={16} /> {t('product.addToCart')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
