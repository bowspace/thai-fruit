import { useMemo } from 'react';
import { ShoppingCart, Star, MapPin, Store as StoreIcon, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';

const SEASON_PICKS = [
    { id: 'durian', monthRange: 'May – Jul' },
    { id: 'mangosteen', monthRange: 'Apr – Jun' },
    { id: 'mango', monthRange: 'Mar – Jun' },
];

export default function Home({ searchQuery, categoryFilter, setCategoryFilter, onProductClick, onStoreClick }) {
    const { products, stores, categories: CATEGORIES } = useApp();
    const { t, locField } = useLang();

    const filteredProducts = useMemo(() => {
        let filtered = products;

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p => {
                const store = stores.find(s => s.id === p.storeId);
                return (
                    p.name.toLowerCase().includes(q) ||
                    (p.nameEn || '').toLowerCase().includes(q) ||
                    store?.name.toLowerCase().includes(q) ||
                    (store?.nameEn || '').toLowerCase().includes(q) ||
                    store?.address.toLowerCase().includes(q)
                );
            });
        }

        return filtered;
    }, [products, stores, searchQuery, categoryFilter]);

    const isHomeView = !searchQuery && categoryFilter === 'all';

    return (
        <div className="animate-fade-in">
            {/* Category chips — circular shelf */}
            <div className="category-shelf">
                <div className="category-shelf-inner">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-chip ${categoryFilter === cat.id ? 'active' : ''}`}
                            onClick={() => {
                                setCategoryFilter(cat.id);
                                window.scrollTo(0, 0);
                            }}
                        >
                            <span className="category-chip-circle">{cat.icon}</span>
                            <span className="category-chip-label">{locField(cat, 'name')}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
                {/* Editorial hero — Home only */}
                {isHomeView && (
                    <div className="hero hero--editorial">
                        <div className="hero-bg" style={{ backgroundImage: 'url(/images/hero-banner.png)' }}></div>
                        <div className="hero-overlay"></div>
                        <div className="hero-mark" aria-hidden="true">🥭</div>
                        <div className="hero-content">
                            <div className="hero-badge">
                                <Star size={14} /> {t('hero.badge')}
                            </div>
                            <h1 className="hero-title">
                                {t('hero.title1')}
                                <span className="hero-title-display"> {t('hero.title2')} </span>
                                {t('hero.title3')}
                            </h1>
                            <p>{t('hero.desc')}</p>
                            <div className="hero-stats--inline">
                                <span><b>{stores.length}</b>{t('hero.stat.stores')}</span>
                                <span className="hero-stat-divider">·</span>
                                <span><b>{products.length}</b>{t('hero.stat.products')}</span>
                                <span className="hero-stat-divider">·</span>
                                <span><b>5k+</b>{t('hero.stat.customers')}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Meet the farmers — horizontal rail (Home only) */}
                {isHomeView && stores.length > 0 && (
                    <section className="section-container" style={{ marginBottom: 'var(--space-12)' }}>
                        <h2 className="section-title section-title--display">
                            <span className="section-title-icon">🌾</span> {t('section.farmers')}
                        </h2>
                        <div className="farmers-rail">
                            {stores.slice(0, 6).map((store) => (
                                <div key={store.id} className="store-card store-card--rail" onClick={() => onStoreClick(store)}>
                                    <div className="store-avatar">{store.avatar}</div>
                                    <div className="store-info">
                                        <div className="store-name">{locField(store, 'name')}</div>
                                        <div className="store-addr">
                                            <MapPin size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                                            {locField(store, 'address')}
                                        </div>
                                        <div className="store-meta">
                                            <span className="store-badge">⭐ {store.rating} ({store.totalSales}+)</span>
                                            <span className="store-badge" style={{ background: '#fef3c7', color: '#b45309' }}>{t('store.badge.pickup')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* What's in season — Home only */}
                {isHomeView && (
                    <section className="season-strip section-container">
                        <h2 className="section-title section-title--display">
                            <span className="section-title-icon">🌿</span> {t('section.season')}
                        </h2>
                        <p className="section-subtitle" style={{ marginTop: 'calc(-1 * var(--space-3))', marginBottom: 'var(--space-6)' }}>
                            {t('section.seasonDesc')}
                        </p>
                        <div className="season-grid">
                            {SEASON_PICKS.map((pick, i) => {
                                const cat = CATEGORIES.find(c => c.id === pick.id);
                                if (!cat) return null;
                                return (
                                    <div
                                        key={pick.id}
                                        className="season-card"
                                        onClick={() => {
                                            setCategoryFilter(pick.id);
                                            window.scrollTo({ top: 600, behavior: 'smooth' });
                                        }}
                                    >
                                        <div className="season-card-num">{String(i + 1).padStart(2, '0')}</div>
                                        <div className="season-card-meta">{pick.monthRange}</div>
                                        <div className="season-card-fruit">{locField(cat, 'name')}</div>
                                        <span className="season-card-link">
                                            {t('season.view')} <ArrowRight size={14} />
                                        </span>
                                        <span className="season-card-emoji" aria-hidden="true">{cat.icon}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Product grid — always visible */}
                <div className="section-container">
                    <h2 className="section-title section-title--display">
                        <span className="section-title-icon">
                            {searchQuery ? '🔍' : categoryFilter !== 'all' ? CATEGORIES.find(c => c.id === categoryFilter)?.icon : '🍎'}
                        </span>
                        {searchQuery
                            ? `${t('section.results')}: "${searchQuery}"`
                            : categoryFilter !== 'all'
                                ? `${t('section.category')}: ${locField(CATEGORIES.find(c => c.id === categoryFilter), 'name')}`
                                : t('section.seasonal')
                        }
                    </h2>
                    <p className="section-subtitle">{t('section.found', { count: filteredProducts.length })}</p>

                    {filteredProducts.length === 0 ? (
                        <div className="empty">
                            <div className="empty-icon">🔍</div>
                            <h3>{t('empty.title')}</h3>
                            <p>{t('empty.desc')}</p>
                            <button className="btn-secondary" style={{ marginTop: 20 }} onClick={() => {
                                setCategoryFilter('all');
                                const input = document.querySelector('.search-bar input');
                                if (input) {
                                    input.value = '';
                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                            }}>
                                {t('empty.showAll')}
                            </button>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map((p) => {
                                const store = stores.find((s) => s.id === p.storeId);
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
                                            {store && (
                                                <div className="product-store" onClick={(e) => { e.stopPropagation(); onStoreClick(store); }}>
                                                    <StoreIcon size={12} /> {locField(store, 'name')}
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
            </div>
        </div>
    );
}
