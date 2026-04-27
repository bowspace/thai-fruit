import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';
import {
    Store, Package, ShoppingBag, Settings, Plus, MapPin, Phone,
    TrendingUp, Star, Search, Filter, ShoppingCart
} from 'lucide-react';

export default function Seller({ onLoginClick }) {
    const { user, stores, products, orders, addProduct, updateStore, categories } = useApp();
    const { t, locField } = useLang();
    const CATEGORIES = categories;
    const [tab, setTab] = useState('dashboard');

    const myStore = user ? stores.find(s => s.ownerId === user.id) : null;
    const myOrders = orders.filter((o) => o.storeId === myStore?.id);
    const myProducts = products.filter((p) => p.storeId === myStore?.id);

    const [newProduct, setNewProduct] = useState({
        name: '', description: '', category: '',
        images: [],
        units: [{ id: Date.now().toString(), label: '', price: '' }],
    });

    if (!user) {
        return (
            <div className="empty animate-fade-in">
                <div className="empty-icon">🏪</div>
                <h3>{t('seller.loginPrompt')}</h3>
                <p style={{ marginBottom: 24 }}>{t('seller.loginDesc')}</p>
                <button className="btn-line" onClick={onLoginClick} style={{ margin: '0 auto' }}>
                    💬 {t('nav.login')}
                </button>
            </div>
        );
    }

    const totalRevenue = myOrders.reduce((s, o) => s + o.total, 0);
    const statusKey = (s) => `seller.status.${s}`;

    const StatCard = ({ title, value, trend, icon: Icon, color = 'var(--primary)' }) => (
        <div className="stat-card">
            <div style={{ color }}>
                <Icon size={28} style={{ marginBottom: 12 }} />
            </div>
            <div className="stat-num" style={{ color }}>{value}</div>
            <div className="stat-label">{title}</div>
            {trend && <div className="stat-trend">{trend}</div>}
        </div>
    );

    // Live preview product card for the add-product form
    const previewMinPrice = (() => {
        const prices = newProduct.units.map(u => parseFloat(u.price)).filter(n => !isNaN(n) && n > 0);
        return prices.length ? Math.min(...prices) : null;
    })();

    return (
        <div className="animate-fade-in">
            {/* Header strip */}
            <header className="seller-header">
                <div className="seller-header-avatar">{myStore?.avatar || '🏪'}</div>
                <div className="seller-header-info">
                    <div className="seller-header-name">{locField(myStore || {}, 'name') || ''}</div>
                    <div className="seller-header-meta">
                        <Store size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} />
                        {t('seller.workshop')}
                    </div>
                </div>
                <span className="seller-header-pill">{t('seller.openToday')}</span>
            </header>

            <div className="seller-tabs">
                <button className={`seller-tab ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>
                    {t('seller.tab.dashboard')}
                </button>
                <button className={`seller-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
                    {t('seller.tab.orders')} ({myOrders.length})
                </button>
                <button className={`seller-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
                    {t('seller.tab.products')} ({myProducts.length})
                </button>
                <button className={`seller-tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>
                    {t('seller.tab.add')}
                </button>
                <button className={`seller-tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
                    {t('seller.tab.settings')}
                </button>
            </div>

            {tab === 'dashboard' && (
                <div className="animate-fade-in">
                    <div className="dashboard-grid">
                        <StatCard
                            title={t('seller.stat.orders')}
                            value={myOrders.length}
                            icon={Package}
                        />
                        <StatCard
                            title={t('seller.stat.revenue')}
                            value={`฿${totalRevenue.toLocaleString()}`}
                            icon={TrendingUp}
                            color="var(--accent-dark)"
                        />
                        <StatCard
                            title={t('seller.stat.products')}
                            value={myProducts.length}
                            icon={ShoppingBag}
                        />
                        <StatCard
                            title={t('seller.stat.rating')}
                            value={myStore?.rating || '0.0'}
                            trend={t('seller.stat.fromReviews', { n: myStore?.totalSales || 0 })}
                            icon={Star}
                            color="var(--orange)"
                        />
                    </div>

                    <div style={{ marginTop: 'var(--space-10)', marginBottom: 'var(--space-5)' }}>
                        <h3 className="section-title section-title--display">
                            <span className="section-title-icon">📦</span> {t('seller.recentOrders')}
                        </h3>
                        {myOrders.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>{t('seller.noOrders')}</p>
                        ) : (
                            <div className="orders-table-wrap">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>{t('seller.col.orderNo')}</th>
                                            <th>{t('seller.col.buyer')}</th>
                                            <th>{t('seller.col.total')}</th>
                                            <th>{t('seller.col.status')}</th>
                                            <th>{t('seller.col.date')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myOrders.slice(0, 5).map((o) => (
                                            <tr key={o.id}>
                                                <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{o.id.toString().slice(0, 8).toUpperCase()}</td>
                                                <td>{o.buyerName}</td>
                                                <td style={{ fontWeight: 700, color: 'var(--orange)', fontVariantNumeric: 'tabular-nums' }}>฿{o.total.toLocaleString()}</td>
                                                <td><span className={`status-badge status-${o.status}`}>{t(statusKey(o.status))}</span></td>
                                                <td style={{ color: 'var(--text-muted)' }}>{o.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {tab === 'orders' && (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
                        <div className="search-bar" style={{ background: 'white', maxWidth: 300, border: '1px solid var(--border)' }}>
                            <Search size={16} color="var(--text-muted)" style={{ marginLeft: 16 }} />
                            <input type="text" placeholder={t('seller.searchOrder')} style={{ color: 'var(--text)' }} />
                        </div>
                        <button className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Filter size={16} /> {t('seller.filterStatus')}
                        </button>
                    </div>

                    {myOrders.length === 0 ? (
                        <div className="empty"><p>{t('seller.noOrdersFull')}</p></div>
                    ) : (
                        <div className="orders-table-wrap">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>{t('seller.col.orderNo')}</th>
                                        <th>{t('seller.col.buyer')}</th>
                                        <th>{t('seller.col.items')}</th>
                                        <th>{t('seller.col.note')}</th>
                                        <th>{t('seller.col.total')}</th>
                                        <th>{t('seller.col.status')}</th>
                                        <th>{t('seller.col.date')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOrders.map((o) => (
                                        <tr key={o.id}>
                                            <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{o.id.toString().slice(0, 8).toUpperCase()}</td>
                                            <td style={{ fontWeight: 600 }}>{o.buyerName}</td>
                                            <td>
                                                {o.items.map((i, idx) => (
                                                    <div key={idx} style={{ fontSize: 12, marginBottom: 4 }}>
                                                        {i.productName} <span style={{ color: 'var(--text-muted)' }}>({i.qty} {i.unit})</span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: 12, maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {o.note || '-'}
                                            </td>
                                            <td style={{ fontWeight: 800, color: 'var(--orange)', fontVariantNumeric: 'tabular-nums' }}>฿{o.total.toLocaleString()}</td>
                                            <td><span className={`status-badge status-${o.status}`}>{t(statusKey(o.status))}</span></td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{o.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {tab === 'products' && (
                <div className="animate-fade-in products-grid">
                    {myProducts.length === 0 ? (
                        <div className="empty" style={{ gridColumn: '1 / -1' }}>
                            <div className="empty-icon">🍎</div>
                            <p>{t('seller.noProducts')}</p>
                        </div>
                    ) : (
                        myProducts.map((p) => {
                            const minPrice = Math.min(...p.units.map((u) => u.price));
                            return (
                                <div key={p.id} className="product-card">
                                    <div className="product-img">
                                        {p.images?.[0] ? (
                                            <img src={p.images[0]} alt={locField(p, 'name')} loading="lazy" />
                                        ) : (
                                            <div className="product-img-emoji">🍎</div>
                                        )}
                                    </div>
                                    <div className="product-body">
                                        <h3 className="product-name">{locField(p, 'name')}</h3>
                                        <div className="product-price">฿{minPrice.toLocaleString()} <span>{t('product.from')}</span></div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                                            {p.units.map((u) => `${locField(u, 'label')} ฿${u.price}`).join(' • ')}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {tab === 'add' && (
                <div className="add-product-layout animate-fade-in">
                    <div className="form-card">
                        <h2 className="form-card-title"><Plus size={20} /> {t('seller.add.title')}</h2>

                        <div className="form-grid">
                            <div className="form-group full">
                                <label className="form-label">{t('seller.form.name')}</label>
                                <input
                                    className="form-input"
                                    value={newProduct.name}
                                    placeholder={t('seller.form.namePh')}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group full">
                                <label className="form-label">{t('seller.form.desc')}</label>
                                <textarea
                                    className="form-textarea"
                                    value={newProduct.description}
                                    placeholder={t('seller.form.descPh')}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('seller.form.category')}</label>
                                <select
                                    className="form-select"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                >
                                    <option value="">{t('seller.form.categoryPh')}</option>
                                    {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                                        <option key={c.id} value={c.id}>{locField(c, 'name')}</option>
                                    ))}
                                    <option value="other">{t('seller.form.others')}</option>
                                </select>
                            </div>

                            <div className="form-group full" style={{ marginTop: 12 }}>
                                <label className="form-label">{t('seller.form.images')}</label>
                                <p className="form-hint" style={{ marginBottom: 8 }}>{t('seller.form.imagesHint')}</p>

                                <div className="image-upload-area" onClick={() => {
                                    setNewProduct({ ...newProduct, images: ['/images/fruits-collection.png'] });
                                }}>
                                    <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                                    <div style={{ fontWeight: 600 }}>{t('seller.form.imagesUpload')}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('seller.form.imagesMock')}</div>
                                </div>

                                {newProduct.images.length > 0 && (
                                    <div className="image-preview-grid">
                                        {newProduct.images.map((img, i) => (
                                            <div key={i} className="image-preview-item">
                                                <img src={img} alt="preview" />
                                                <button className="image-preview-remove" onClick={() => setNewProduct({ ...newProduct, images: [] })}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-group full" style={{ marginTop: 12 }}>
                                <label className="form-label">{t('seller.form.units')}</label>

                                <div className="unit-editor">
                                    <div className="unit-row" style={{ background: 'var(--primary-lighter)', color: 'var(--primary)', fontWeight: 700, fontSize: 13 }}>
                                        <div style={{ padding: '8px 16px' }}>{t('seller.form.unitCol')} <span style={{ fontWeight: 400, fontSize: 11 }}>{t('seller.form.unitColHint')}</span></div>
                                        <div style={{ padding: '8px 16px', borderLeft: '1px solid var(--border)' }}>{t('seller.form.priceCol')}</div>
                                        <div style={{ padding: '8px 16px', borderLeft: '1px solid var(--border)' }}></div>
                                    </div>

                                    {newProduct.units.map((u, i) => (
                                        <div key={i} className="unit-row">
                                            <input
                                                value={u.label}
                                                placeholder={t('seller.form.unitPh')}
                                                onChange={(e) => {
                                                    const units = [...newProduct.units];
                                                    units[i] = { ...u, label: e.target.value };
                                                    setNewProduct({ ...newProduct, units });
                                                }}
                                            />
                                            <input
                                                value={u.price}
                                                type="number"
                                                placeholder="0"
                                                style={{ borderLeft: '1px solid var(--border)', fontWeight: 600, color: 'var(--orange)' }}
                                                onChange={(e) => {
                                                    const units = [...newProduct.units];
                                                    units[i] = { ...u, price: e.target.value };
                                                    setNewProduct({ ...newProduct, units });
                                                }}
                                            />
                                            <button
                                                className="unit-row-del"
                                                onClick={() => {
                                                    if (newProduct.units.length > 1)
                                                        setNewProduct({ ...newProduct, units: newProduct.units.filter((_, j) => j !== i) });
                                                }}
                                            >✕</button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="btn-add-unit"
                                    onClick={() => setNewProduct({
                                        ...newProduct,
                                        units: [...newProduct.units, { id: Date.now().toString(), label: '', price: '' }]
                                    })}
                                >
                                    {t('seller.form.addUnit')}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', gap: 16 }}>
                            <button
                                className="btn-primary"
                                onClick={() => {
                                    if (!newProduct.name || !newProduct.category || !newProduct.units[0].label || !newProduct.units[0].price) {
                                        alert(t('seller.requiredAlert'));
                                        return;
                                    }
                                    addProduct(newProduct);
                                    setNewProduct({ name: '', description: '', category: '', images: [], units: [{ id: Date.now().toString(), label: '', price: '' }] });
                                    setTab('products');
                                    window.scrollTo(0, 0);
                                }}
                            >
                                {t('seller.save')}
                            </button>
                            <button className="btn-secondary" onClick={() => setTab('products')}>{t('seller.cancel')}</button>
                        </div>
                    </div>

                    {/* Live preview */}
                    <div className="add-product-preview">
                        <div className="add-product-preview-title">{t('seller.preview.title')}</div>
                        <div className="add-product-preview-hint">{t('seller.preview.hint')}</div>
                        <div className="product-card" style={{ cursor: 'default' }}>
                            <div className="product-img">
                                {newProduct.images?.[0] ? (
                                    <img src={newProduct.images[0]} alt="preview" />
                                ) : (
                                    <div className="product-img-emoji">🍎</div>
                                )}
                            </div>
                            <div className="product-body">
                                <h3 className="product-name">
                                    {newProduct.name || t('seller.preview.placeholderName')}
                                </h3>
                                <p className="product-desc">
                                    {newProduct.description || t('seller.preview.placeholderDesc')}
                                </p>
                                <div className="product-price">
                                    ฿{previewMinPrice ? previewMinPrice.toLocaleString() : '—'} <span>{t('product.from')}</span>
                                </div>
                                <button className="btn-add" disabled style={{ opacity: 0.5, cursor: 'default' }}>
                                    <ShoppingCart size={16} /> {t('product.addToCart')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'settings' && (
                <div className="form-card animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h2 className="form-card-title"><Settings size={20} /> {t('seller.settings.title')}</h2>

                    <div className="form-grid">
                        <div className="form-group full" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div className="store-avatar" style={{ width: 80, height: 80, fontSize: 40 }}>{myStore?.avatar}</div>
                            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>{t('seller.settings.changePhoto')}</button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('seller.settings.name')}</label>
                            <input className="form-input" defaultValue={myStore?.name} id="store-name" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('seller.settings.owner')}</label>
                            <input className="form-input" defaultValue={myStore?.owner} id="store-owner" />
                        </div>

                        <div className="form-group">
                            <label className="form-label"><Phone size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> {t('seller.settings.phone')}</label>
                            <input className="form-input" defaultValue={myStore?.phone} id="store-phone" />
                        </div>

                        <div className="form-group full" style={{ marginTop: 12 }}>
                            <label className="form-label">{t('seller.settings.desc')}</label>
                            <textarea className="form-textarea" defaultValue={myStore?.description} id="store-desc" style={{ minHeight: 80 }} />
                        </div>

                        <div className="form-group full" style={{ marginTop: 12 }}>
                            <label className="form-label"><MapPin size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> {t('seller.settings.address')}</label>
                            <textarea className="form-textarea" defaultValue={myStore?.address} id="store-address" style={{ minHeight: 80 }} />
                        </div>

                        <div className="form-group full" style={{ marginTop: 12 }}>
                            <label className="form-label">{t('seller.settings.pickup')}</label>
                            <textarea className="form-textarea" defaultValue={myStore?.pickup} id="store-pickup" style={{ minHeight: 60 }} />
                            <p className="form-hint">{t('seller.settings.pickupHint')}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                updateStore(myStore.id, {
                                    name: document.getElementById('store-name').value,
                                    owner: document.getElementById('store-owner').value,
                                    phone: document.getElementById('store-phone').value,
                                    description: document.getElementById('store-desc').value,
                                    address: document.getElementById('store-address').value,
                                    pickup: document.getElementById('store-pickup').value,
                                });
                            }}
                        >
                            {t('seller.settings.save')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
