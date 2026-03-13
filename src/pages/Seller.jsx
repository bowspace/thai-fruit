import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    Store, Package, ShoppingBag, Settings, Plus, MapPin, Phone,
    TrendingUp, Star, Search, Filter
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function Seller({ onLoginClick }) {
    const { user, stores, products, orders, addProduct, updateStore } = useApp();
    const [tab, setTab] = useState('dashboard');

    const myStore = stores[0]; // MOCK: assumption current user owns the first store
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
                <h3>ผู้ขายโปรดเข้าสู่ระบบ</h3>
                <p style={{ marginBottom: 24 }}>เชื่อมต่อบัญชีเพื่อจัดการร้านค้า ออเดอร์ และสินค้าของคุณ</p>
                <button className="btn-line" onClick={onLoginClick} style={{ margin: '0 auto' }}>
                    💬 เข้าสู่ระบบด้วย LINE
                </button>
            </div>
        );
    }

    const totalRevenue = myOrders.reduce((s, o) => s + o.total, 0);
    const statusMap = { pending: 'รอยืนยัน', confirmed: 'ยืนยันแล้ว', shipped: 'จัดส่งแล้ว', done: 'เสร็จสิ้น' };

    // Helper for rendering stat cards
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

    return (
        <div className="animate-fade-in">
            <div className="section-title" style={{ marginBottom: 24 }}>
                <Store size={24} className="section-title-icon" color="var(--primary)" />
                ระบบจัดการร้านค้า — {myStore?.name}
            </div>

            <div className="seller-tabs">
                <button className={`seller-tab ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>
                    📊 ภาพรวม
                </button>
                <button className={`seller-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
                    📦 ออเดอร์ ({myOrders.length})
                </button>
                <button className={`seller-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
                    🍎 สินค้า ({myProducts.length})
                </button>
                <button className={`seller-tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>
                    ➕ เพิ่มสินค้า
                </button>
                <button className={`seller-tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
                    ⚙️ ตั้งค่าร้าน
                </button>
            </div>

            {tab === 'dashboard' && (
                <div className="animate-fade-in">
                    <div className="dashboard-grid">
                        <StatCard
                            title="ออเดอร์ทั้งหมด"
                            value={myOrders.length}
                            trend="↑ 3 ใหม่วันนี้"
                            icon={Package}
                        />
                        <StatCard
                            title="ยอดขายรวม"
                            value={`฿${totalRevenue.toLocaleString()}`}
                            trend="↑ 12% จากสัปดาห์ก่อน"
                            icon={TrendingUp}
                            color="var(--accent-dark)"
                        />
                        <StatCard
                            title="สินค้าในร้าน"
                            value={myProducts.length}
                            icon={ShoppingBag}
                        />
                        <StatCard
                            title="คะแนนเฉลี่ย"
                            value={myStore?.rating || '0.0'}
                            trend={`จาก ${myStore?.totalSales || 0} รีวิว`}
                            icon={Star}
                            color="var(--orange)"
                        />
                    </div>

                    <div style={{ marginTop: 40, marginBottom: 20 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>ออเดอร์ล่าสุด</h3>
                        {myOrders.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>ยังไม่มีออเดอร์ในขณะนี้</p>
                        ) : (
                            <div className="orders-table-wrap">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>เลขที่สั่งซื้อ</th>
                                            <th>ผู้ซื้อ</th>
                                            <th>ยอดรวม</th>
                                            <th>สถานะ</th>
                                            <th>วันที่ทำรายการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myOrders.slice(0, 5).map((o) => (
                                            <tr key={o.id}>
                                                <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{o.id.toUpperCase()}</td>
                                                <td>{o.buyerName}</td>
                                                <td style={{ fontWeight: 700, color: 'var(--orange)' }}>฿{o.total.toLocaleString()}</td>
                                                <td><span className={`status-badge status-${o.status}`}>{statusMap[o.status]}</span></td>
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
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                        <div className="search-bar" style={{ background: 'white', maxWidth: 300, border: '1px solid var(--border)' }}>
                            <Search size={16} color="var(--text-muted)" style={{ marginLeft: 16 }} />
                            <input type="text" placeholder="ค้นหาเลขออเดอร์ หรือชื่อลูกค้า..." style={{ color: 'var(--text)' }} />
                        </div>
                        <button className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Filter size={16} /> กรองสถานะ
                        </button>
                    </div>

                    {myOrders.length === 0 ? (
                        <div className="empty"><p>ยังไม่มีออเดอร์</p></div>
                    ) : (
                        <div className="orders-table-wrap">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>ออเดอร์ #</th>
                                        <th>ผู้ซื้อ</th>
                                        <th>รายการสินค้า</th>
                                        <th>หมายเหตุให้ผู้ขาย</th>
                                        <th>ยอดสุทธิ</th>
                                        <th>สถานะ</th>
                                        <th>วันที่</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOrders.map((o) => (
                                        <tr key={o.id}>
                                            <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{o.id.toUpperCase()}</td>
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
                                            <td style={{ fontWeight: 800, color: 'var(--orange)' }}>฿{o.total.toLocaleString()}</td>
                                            <td><span className={`status-badge status-${o.status}`}>{statusMap[o.status]}</span></td>
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
                            <p>ยังไม่มีสินค้าในร้าน กดปุ่ม "เพิ่มสินค้า" เพื่อเริ่มขาย</p>
                        </div>
                    ) : (
                        myProducts.map((p) => {
                            const minPrice = Math.min(...p.units.map((u) => u.price));
                            return (
                                <div key={p.id} className="product-card">
                                    <div className="product-img">
                                        {p.images?.[0] ? (
                                            <img src={p.images[0]} alt={p.name} loading="lazy" />
                                        ) : (
                                            <div className="product-img-emoji">🍎</div>
                                        )}
                                    </div>
                                    <div className="product-body">
                                        <h3 className="product-name">{p.name}</h3>
                                        <div className="product-price">฿{minPrice.toLocaleString()} <span>เริ่มต้น</span></div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                                            {p.units.map((u) => `${u.label} ฿${u.price}`).join(' • ')}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {tab === 'add' && (
                <div className="form-card animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h2 className="form-card-title"><Plus size={20} /> เพิ่มสินค้าใหม่</h2>

                    <div className="form-grid">
                        <div className="form-group full">
                            <label className="form-label">ชื่อสินค้า *</label>
                            <input
                                className="form-input"
                                value={newProduct.name}
                                placeholder="เช่น ส้มสายน้ำผึ้ง เกรด A, ทุเรียนหมอนทอง จันทบุรี"
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group full">
                            <label className="form-label">คำอธิบาย</label>
                            <textarea
                                className="form-textarea"
                                value={newProduct.description}
                                placeholder="บรรยายลักษณะสินค้า รสชาติ แหล่งปลูก วิธีการเก็บรักษา..."
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">หมวดหมู่ผลไม้ *</label>
                            <select
                                className="form-select"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                                <option value="">เลือกหมวดหมู่</option>
                                {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                                <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                        </div>

                        <div className="form-group full" style={{ marginTop: 12 }}>
                            <label className="form-label">รูปภาพสินค้า</label>
                            <p className="form-hint" style={{ marginBottom: 8 }}>อัปโหลดได้สูงสุด 5 รูป (รูปแบบ JPG, PNG)</p>

                            <div className="image-upload-area" onClick={() => {
                                // Mock adding the default photo
                                setNewProduct({ ...newProduct, images: ['/images/fruits-collection.png'] });
                            }}>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                                <div style={{ fontWeight: 600 }}>คลิกเพื่อเลือกไฟล์รูปภาพ</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>MOCK: จะใช้รูปตัวอย่างรวมผลไม้</div>
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
                            <label className="form-label">ตัวเลือกขนาด / หน่วยการขาย / ราคา *</label>

                            <div className="unit-editor">
                                <div className="unit-row" style={{ background: 'var(--primary-lighter)', color: 'var(--primary)', fontWeight: 700, fontSize: 13 }}>
                                    <div style={{ padding: '8px 16px' }}>หน่วย/ขนาด <span style={{ fontWeight: 400, fontSize: 11 }}>(เช่น กิโลกรัม, ลัง 10 กก.)</span></div>
                                    <div style={{ padding: '8px 16px', borderLeft: '1px solid var(--border)' }}>ราคา (บาท)</div>
                                    <div style={{ padding: '8px 16px', borderLeft: '1px solid var(--border)' }}></div>
                                </div>

                                {newProduct.units.map((u, i) => (
                                    <div key={i} className="unit-row">
                                        <input
                                            value={u.label}
                                            placeholder="เช่น กิโลกรัม, ลัง, แพ็ค"
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
                                + เพิ่มตัวเลือกหน่วยการขาย
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', gap: 16 }}>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                if (!newProduct.name || !newProduct.category || !newProduct.units[0].label || !newProduct.units[0].price) {
                                    alert("กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อ, หมวดหมู่, หน่วยการขาย)");
                                    return;
                                }
                                addProduct(newProduct);
                                setNewProduct({ name: '', description: '', category: '', images: [], units: [{ id: Date.now().toString(), label: '', price: '' }] });
                                setTab('products');
                                window.scrollTo(0, 0);
                            }}
                        >
                            บันทึกสินค้า
                        </button>
                        <button className="btn-secondary" onClick={() => setTab('products')}>ยกเลิก</button>
                    </div>
                </div>
            )}

            {tab === 'settings' && (
                <div className="form-card animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h2 className="form-card-title"><Settings size={20} /> ตั้งค่าร้านค้า</h2>

                    <div className="form-grid">
                        <div className="form-group full" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div className="store-avatar" style={{ width: 80, height: 80, fontSize: 40 }}>{myStore?.avatar}</div>
                            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>เปลี่ยนรูปโปรไฟล์ร้าน</button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">ชื่อร้านค้า</label>
                            <input className="form-input" defaultValue={myStore?.name} id="store-name" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">ชื่อเจ้าของ / ผู้ดูแล</label>
                            <input className="form-input" defaultValue={myStore?.owner} id="store-owner" />
                        </div>

                        <div className="form-group">
                            <label className="form-label"><Phone size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> เบอร์โทรศัพท์ติดต่อ</label>
                            <input className="form-input" defaultValue={myStore?.phone} id="store-phone" />
                        </div>

                        <div className="form-group full" style={{ marginTop: 12 }}>
                            <label className="form-label">รายละเอียด / คำอธิบายร้าน</label>
                            <textarea className="form-textarea" defaultValue={myStore?.description} id="store-desc" style={{ minHeight: 80 }} />
                        </div>

                        <div className="form-group full" style={{ marginTop: 12 }}>
                            <label className="form-label"><MapPin size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> ที่อยู่ฟาร์ม / ร้านค้า</label>
                            <textarea className="form-textarea" defaultValue={myStore?.address} id="store-address" style={{ minHeight: 80 }} />
                        </div>

                        <div className="form-group full" style={{ marginTop: 12 }}>
                            <label className="form-label">จุดรับสินค้า / เวลาทำการ</label>
                            <textarea className="form-textarea" defaultValue={myStore?.pickup} id="store-pickup" style={{ minHeight: 60 }} />
                            <p className="form-hint">ข้อมูลนี้จะแสดงให้ลูกค้าเห็นเพื่อประกอบการตัดสินใจนัดรับสินค้า</p>
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
                            บันทึกการตั้งค่า
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
