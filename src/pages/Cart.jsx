import { ShoppingBag, MapPin, Store, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';

export default function Cart({ onLoginClick }) {
    const { user, cart, removeFromCart, placeOrder } = useApp();
    const { t, locField } = useLang();

    const grouped = cart.reduce((acc, item) => {
        if (!acc[item.store.id]) acc[item.store.id] = { store: item.store, items: [] };
        acc[item.store.id].items.push(item);
        return acc;
    }, {});

    const grandTotal = cart.reduce((s, i) => s + i.unit.price * i.qty, 0);

    if (!user) {
        return (
            <div className="empty animate-fade-in">
                <div className="empty-icon">🔒</div>
                <h3>{t('cart.loginFirst')}</h3>
                <p style={{ marginBottom: 24 }}>{t('login.desc')}</p>
                <button className="btn-line" onClick={onLoginClick} style={{ margin: '0 auto' }}>
                    💬 {t('nav.login')}
                </button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="empty animate-fade-in">
                <div className="empty-icon">🛒</div>
                <h3>{t('cart.empty')}</h3>
                <p>{t('cart.emptyDesc')}</p>
            </div>
        );
    }

    return (
        <div className="cart-page animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="section-title">
                <ShoppingBag size={24} className="section-title-icon" /> {t('cart.title')} ({cart.length})
            </h2>

            {Object.values(grouped).map(({ store, items }) => (
                <div key={store.id} className="cart-store-group">
                    <div className="cart-store-header">
                        <Store size={18} />
                        <span>{locField(store, 'name')}</span>
                        <span className="cart-store-pickup">
                            <MapPin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: '-2px' }} />
                            {t('cart.pickup')}
                        </span>
                    </div>

                    {items.map((item, i) => (
                        <div key={i} className="cart-item">
                            <div className="cart-item-img">
                                {item.product.images?.[0] ? (
                                    <img src={item.product.images[0]} alt={locField(item.product, 'name')} />
                                ) : (
                                    <span style={{ fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🍎</span>
                                )}
                            </div>

                            <div className="cart-item-info">
                                <div className="cart-item-name">{locField(item.product, 'name')}</div>
                                <div className="cart-item-unit">
                                    {locField(item.unit, 'label')} × {item.qty} (@ ฿{item.unit.price})
                                </div>
                            </div>

                            <div className="cart-item-price">
                                ฿{(item.unit.price * item.qty).toLocaleString()}
                            </div>

                            <button
                                className="cart-item-remove"
                                onClick={() => removeFromCart(i)}
                                title={t('cart.remove')}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            ))}

            <div className="cart-summary">
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>{t('cart.title')} ({cart.length})</div>

                {Object.values(grouped).map(({ store, items }) => {
                    const sub = items.reduce((s, i) => s + i.unit.price * i.qty, 0);
                    return (
                        <div key={store.id} className="cart-total-row">
                            <span>{locField(store, 'name')}</span>
                            <span>฿{sub.toLocaleString()}</span>
                        </div>
                    );
                })}

                <div className="cart-total-row">
                    <span>{t('cart.shipping')}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('cart.free')}</span>
                </div>

                <div className="cart-total-main">
                    <span>{t('cart.total')}</span>
                    <span>฿{grandTotal.toLocaleString()}</span>
                </div>

                <button
                    className="btn-checkout"
                    onClick={placeOrder}
                >
                    {t('cart.checkout')} <ArrowRight size={18} style={{ verticalAlign: '-4px', marginLeft: 4 }} />
                </button>
            </div>
        </div>
    );
}
