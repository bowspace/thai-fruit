import { ArrowLeft, MapPin, Store as StoreIcon, Phone, Star, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StoreDetail({ store, onProductClick, onBack }) {
    const { products } = useApp();

    if (!store) return <div className="empty">ไม่พบข้อมูลร้านค้า</div>;

    const storeProducts = products.filter(p => p.storeId === store.id);

    return (
        <div className="animate-fade-in">
            <button
                className="btn-secondary"
                onClick={onBack}
                style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'white' }}
            >
                <ArrowLeft size={16} /> กลับไปหน้าหลัก
            </button>

            <div className="store-detail-header">
                <div className="store-detail-avatar">
                    {store.avatar}
                </div>

                <div style={{ flex: 1 }}>
                    <h1 className="store-detail-name">{store.name}</h1>
                    <div className="store-detail-owner">ดูแลโดย {store.owner}</div>

                    {store.description && (
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                            {store.description}
                        </p>
                    )}

                    <div className="store-detail-info">
                        <div className="store-detail-info-item">
                            <Star size={14} color="var(--orange)" />
                            <span>คะแนน: <span style={{ fontWeight: 700, color: 'var(--text)' }}>{store.rating}</span> (จากลูกค้ารีวิว {store.totalSales}+)</span>
                        </div>
                        <div className="store-detail-info-item">
                            <Phone size={14} color="var(--primary)" />
                            <span>ติดต่อ: {store.phone}</span>
                        </div>
                        <div className="store-detail-info-item">
                            <MapPin size={14} color="var(--primary)" />
                            <span>ที่ตั้งฟาร์ม: {store.address}</span>
                        </div>
                        <div className="store-detail-info-item">
                            <StoreIcon size={14} color="var(--primary)" />
                            <span>จุดรับสินค้า: {store.pickup} (เข้าร่วมปี {store.joinDate})</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-title" style={{ marginTop: 40, marginBottom: 24 }}>
                <span className="section-title-icon">🍎</span> สินค้าทั้งหมดจาก {store.name}
            </div>

            {storeProducts.length === 0 ? (
                <div className="empty" style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <div className="empty-icon">🌱</div>
                    <h3>ร้านนี้กำลังเตรียมผลผลิต</h3>
                    <p>ฤดูกาลถัดไปจะมาอัปเดตสินค้าเพิ่มเติม โปรดติดตาม</p>
                </div>
            ) : (
                <div className="products-grid">
                    {storeProducts.map((p) => {
                        const minPrice = Math.min(...p.units.map((u) => u.price));
                        return (
                            <div key={p.id} className="product-card" onClick={() => onProductClick(p, store)}>
                                <div className="product-img">
                                    {p.featured && <div className="product-featured">⭐ แนะนำ</div>}
                                    {p.images?.[0] ? (
                                        <img src={p.images[0]} alt={p.name} loading="lazy" />
                                    ) : (
                                        <div className="product-img-emoji">🍎</div>
                                    )}
                                </div>
                                <div className="product-body">
                                    <h3 className="product-name" title={p.name}>{p.name}</h3>
                                    <p className="product-desc">{p.description}</p>
                                    <div className="product-price">
                                        ฿{minPrice.toLocaleString()} <span>เริ่มต้น</span>
                                    </div>
                                    <button
                                        className="btn-add"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onProductClick(p, store);
                                        }}
                                    >
                                        <ShoppingCart size={16} /> ใส่ตะกร้า
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
