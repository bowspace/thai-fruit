import { useMemo } from 'react';
import { ShoppingCart, Star, MapPin, Store as StoreIcon } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';

export default function Home({ searchQuery, categoryFilter, setCategoryFilter, onProductClick, onStoreClick }) {
    const { products, stores } = useApp();
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
            {/* Category Tabs */}
            <div className="category-nav">
                <div className="category-nav-inner">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-tab ${categoryFilter === cat.id ? 'active' : ''}`}
                            onClick={() => {
                                setCategoryFilter(cat.id);
                                window.scrollTo(0, 0);
                            }}
                        >
                            <span>{cat.icon}</span> {locField(cat, 'name')}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 24 }}>
                {/* Hero Banner */}
                {isHomeView && (
                    <div className="hero">
                        <div className="hero-bg" style={{ backgroundImage: 'url(/images/hero-banner.png)' }}></div>
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                            <div className="hero-badge">
                                <Star size={14} /> {t('hero.badge')}
                            </div>
                            <h1>{t('hero.title1')}<br /><span>{t('hero.title2')}</span>{t('hero.title3')}</h1>
                            <p>{t('hero.desc')}</p>

                            <div className="hero-stats">
                                <div className="hero-stat">
                                    <div className="hero-stat-num">{stores.length}</div>
                                    <div className="hero-stat-label">{t('hero.stat.stores')}</div>
                                </div>
                                <div className="hero-stat">
                                    <div className="hero-stat-num">{products.length}</div>
                                    <div className="hero-stat-label">{t('hero.stat.products')}</div>
                                </div>
                                <div className="hero-stat">
                                    <div className="hero-stat-num">5k+</div>
                                    <div className="hero-stat-label">{t('hero.stat.customers')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Store list (Home only) */}
                {isHomeView && (
                    <div className="section-container" style={{ marginBottom: 48 }}>
                        <h2 className="section-title">
                            <span className="section-title-icon">🏪</span> {t('section.stores')}
                        </h2>
                        <div className="stores-grid">
                            {stores.slice(0, 3).map((store) => (
                                <div key={store.id} className="store-card" onClick={() => onStoreClick(store)}>
                                    <div className="store-avatar">{store.avatar}</div>
                                    <div className="store-info">
                                        <div className="store-name">{locField(store, 'name')}</div>
                                        <div className="store-addr">
                                            <MapPin size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                                            {locField(store, 'address')?.includes('จ.')
                                                ? (store.addressEn ? locField(store, 'address') : `จ.${store.address.split(' จ.')[1]}`)
                                                : locField(store, 'address')
                                            }
                                        </div>
                                        <div className="store-meta">
                                            <span className="store-badge">⭐ {store.rating} ({store.totalSales}+)</span>
                                            <span className="store-badge" style={{ background: '#fef3c7', color: '#b45309' }}>{t('store.badge.pickup')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                <div className="section-container">
                    <h2 className="section-title">
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
