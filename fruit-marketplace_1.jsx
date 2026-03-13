import { useState, useEffect, useCallback } from "react";

// ==================== MOCK DATA ====================
const MOCK_USER = {
  id: "u1",
  name: "สมชาย ใจดี",
  avatar: "🧑",
  lineId: "somchai.jaidee",
  role: "buyer", // buyer | seller
};

const MOCK_STORES = [
  {
    id: "s1",
    name: "สวนผลไม้ลุงแดง",
    owner: "ลุงแดง มีสุข",
    address: "123/4 ม.5 ต.ท่าช้าง อ.บางกระทุ่ม จ.พิษณุโลก 65110",
    pickup: "หน้าตลาดสดท่าช้าง เปิด 06:00-18:00 ทุกวัน",
    phone: "085-123-4567",
    avatar: "🍊",
    rating: 4.8,
    totalSales: 1240,
    joinDate: "2565",
  },
  {
    id: "s2",
    name: "สวนทุเรียนพี่สาว",
    owner: "สาวใหญ่ ดีมาก",
    address: "88 หมู่ 3 ต.นาดี อ.เมือง จ.จันทบุรี 22000",
    pickup: "บ้านเลขที่ 88 เปิด 07:00-17:00 จันทร์-เสาร์",
    phone: "081-987-6543",
    avatar: "🌿",
    rating: 4.9,
    totalSales: 980,
    joinDate: "2564",
  },
  {
    id: "s3",
    name: "ไร่มะม่วงทองคำ",
    owner: "ทองคำ รักษ์ดิน",
    address: "45 ถ.เพชรเกษม ต.คลองกาน อ.สามพราน จ.นครปฐม 73110",
    pickup: "ไร่มะม่วงทองคำ ริมถนนเพชรเกษม เปิด 08:00-17:00",
    phone: "089-456-7890",
    avatar: "🥭",
    rating: 4.7,
    totalSales: 2100,
    joinDate: "2563",
  },
];

const MOCK_PRODUCTS = [
  {
    id: "p1",
    storeId: "s1",
    name: "ส้มสายน้ำผึ้ง",
    description: "ส้มสายน้ำผึ้งจากสวน หวานฉ่ำ เปลือกบาง คัดเกรด A",
    images: ["🍊", "🍊", "🍊"],
    units: [
      { id: "u1", label: "กิโลกรัม", price: 80 },
      { id: "u2", label: "ลัง (10 กก.)", price: 750 },
      { id: "u3", label: "ตะกร้า (5 กก.)", price: 380 },
    ],
    category: "ส้ม",
    featured: true,
  },
  {
    id: "p2",
    storeId: "s1",
    name: "ส้มโอขาวใหญ่",
    description: "ส้มโอขาวใหญ่ หวานอมเปรี้ยว เนื้อแน่น",
    images: ["🍈", "🍈"],
    units: [
      { id: "u1", label: "ลูก", price: 120 },
      { id: "u2", label: "แพ็ค 3 ลูก", price: 340 },
    ],
    category: "ส้มโอ",
    featured: false,
  },
  {
    id: "p3",
    storeId: "s2",
    name: "ทุเรียนหมอนทอง",
    description: "ทุเรียนหมอนทองแก่จัด เนื้อนุ่ม หวานมัน กลิ่นหอม คัดสวน",
    images: ["🌳", "🌳", "🌳"],
    units: [
      { id: "u1", label: "กิโลกรัม", price: 280 },
      { id: "u2", label: "ลูก (~4 กก.)", price: 1050 },
      { id: "u3", label: "2 ลูก", price: 1950 },
    ],
    category: "ทุเรียน",
    featured: true,
  },
  {
    id: "p4",
    storeId: "s2",
    name: "มังคุดราชินี",
    description: "มังคุดแก่จัด เปลือกม่วงสด เนื้อขาวนวล หวานละมุน",
    images: ["🫐", "🫐"],
    units: [
      { id: "u1", label: "กิโลกรัม", price: 150 },
      { id: "u2", label: "ตะกร้า (3 กก.)", price: 420 },
    ],
    category: "มังคุด",
    featured: false,
  },
  {
    id: "p5",
    storeId: "s3",
    name: "มะม่วงน้ำดอกไม้สีทอง",
    description: "มะม่วงน้ำดอกไม้ เกรดส่งออก หวานกรอบ เนื้อสีเหลือง",
    images: ["🥭", "🥭", "🥭"],
    units: [
      { id: "u1", label: "กิโลกรัม", price: 120 },
      { id: "u2", label: "ลัง (15 กก.)", price: 1650 },
      { id: "u3", label: "ครึ่งลัง (7 กก.)", price: 800 },
    ],
    category: "มะม่วง",
    featured: true,
  },
  {
    id: "p6",
    storeId: "s3",
    name: "มะม่วงเขียวเสวย",
    description: "มะม่วงเขียวเสวยดิบ เปรี้ยวกรอบ เหมาะทำส้มตำ ยำ",
    images: ["🫒", "🫒"],
    units: [
      { id: "u1", label: "กิโลกรัม", price: 60 },
      { id: "u2", label: "โหล (12 กก.)", price: 680 },
    ],
    category: "มะม่วง",
    featured: false,
  },
];

const MOCK_ORDERS = [
  {
    id: "o1",
    storeId: "s1",
    buyerName: "สมหมาย ดีงาม",
    items: [{ productId: "p1", productName: "ส้มสายน้ำผึ้ง", unit: "กิโลกรัม", qty: 5, price: 80 }],
    total: 400,
    status: "pending",
    date: "2567-11-15",
    note: "ต้องการส้มหวาน ไม่เปรี้ยว",
  },
  {
    id: "o2",
    storeId: "s1",
    buyerName: "วิชัย มีทรัพย์",
    items: [
      { productId: "p1", productName: "ส้มสายน้ำผึ้ง", unit: "ลัง (10 กก.)", qty: 2, price: 750 },
      { productId: "p2", productName: "ส้มโอขาวใหญ่", unit: "แพ็ค 3 ลูก", qty: 1, price: 340 },
    ],
    total: 1840,
    status: "confirmed",
    date: "2567-11-14",
    note: "",
  },
  {
    id: "o3",
    storeId: "s2",
    buyerName: "นิดา สุขใจ",
    items: [{ productId: "p3", productName: "ทุเรียนหมอนทอง", unit: "ลูก (~4 กก.)", qty: 3, price: 1050 }],
    total: 3150,
    status: "shipped",
    date: "2567-11-13",
    note: "ส่งด่วน",
  },
];

// ==================== STYLES ====================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --leaf: #2d6a2d;
    --leaf-light: #4a9e4a;
    --leaf-pale: #e8f5e8;
    --sun: #f4a824;
    --sun-deep: #e08a00;
    --earth: #7a4f2d;
    --cream: #faf7f0;
    --white: #ffffff;
    --text: #1a2a1a;
    --text-mid: #4a5a4a;
    --text-light: #8a9a8a;
    --border: #d4e8d4;
    --shadow: 0 4px 20px rgba(45,106,45,0.10);
    --shadow-hover: 0 8px 32px rgba(45,106,45,0.18);
    --radius: 16px;
    --radius-sm: 10px;
  }

  body { font-family: 'Noto Sans Thai', sans-serif; background: var(--cream); color: var(--text); min-height: 100vh; }

  /* HEADER */
  .header {
    background: linear-gradient(135deg, var(--leaf) 0%, #1a4a1a 100%);
    padding: 0 24px;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 20px rgba(0,0,0,0.2);
  }
  .header-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; gap: 16px;
    height: 64px;
  }
  .logo { display: flex; align-items: center; gap: 10px; cursor: pointer; text-decoration: none; }
  .logo-icon { font-size: 28px; line-height: 1; }
  .logo-text { color: white; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
  .logo-text span { color: var(--sun); }
  .search-bar {
    flex: 1; display: flex; align-items: center;
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
    border-radius: 50px; overflow: hidden; backdrop-filter: blur(4px);
  }
  .search-bar input {
    flex: 1; background: none; border: none; outline: none;
    color: white; font-size: 14px; padding: 10px 16px;
    font-family: inherit;
  }
  .search-bar input::placeholder { color: rgba(255,255,255,0.6); }
  .search-btn {
    background: var(--sun); border: none; color: var(--text);
    padding: 10px 20px; font-size: 14px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 6px;
    font-family: inherit; transition: background 0.2s;
  }
  .search-btn:hover { background: var(--sun-deep); color: white; }
  .header-actions { display: flex; align-items: center; gap: 8px; }
  .btn-header {
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
    color: white; padding: 8px 16px; border-radius: 50px; cursor: pointer;
    font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px;
    font-family: inherit; transition: all 0.2s; white-space: nowrap;
  }
  .btn-header:hover { background: rgba(255,255,255,0.25); }
  .btn-cart {
    background: var(--sun); border: 1px solid var(--sun-deep); color: var(--text);
    font-weight: 700; position: relative;
  }
  .btn-cart:hover { background: var(--sun-deep); color: white; }
  .cart-badge {
    position: absolute; top: -6px; right: -6px;
    background: #e53; color: white; border-radius: 50%;
    width: 18px; height: 18px; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }

  /* NAV TABS */
  .nav-tabs {
    background: white; border-bottom: 2px solid var(--border);
    display: flex; gap: 0; overflow-x: auto;
    padding: 0 24px;
  }
  .nav-tab {
    padding: 14px 20px; font-size: 14px; font-weight: 500;
    color: var(--text-mid); cursor: pointer; white-space: nowrap;
    border-bottom: 3px solid transparent; margin-bottom: -2px;
    transition: all 0.2s; font-family: inherit; background: none; border-left: none; border-right: none; border-top: none;
  }
  .nav-tab.active { color: var(--leaf); border-bottom-color: var(--leaf); font-weight: 700; }
  .nav-tab:hover:not(.active) { color: var(--leaf-light); }

  /* MAIN */
  .main { max-width: 1200px; margin: 0 auto; padding: 24px; }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, var(--leaf) 0%, #1a5c1a 50%, var(--leaf-light) 100%);
    border-radius: 24px; padding: 48px 40px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px; overflow: hidden; position: relative;
  }
  .hero::before {
    content: '🍊🥭🌳🍈🫐';
    position: absolute; right: 40px; font-size: 80px;
    opacity: 0.15; letter-spacing: -10px; transform: rotate(-10deg);
  }
  .hero-text h1 { font-size: 36px; font-weight: 800; color: white; line-height: 1.2; margin-bottom: 12px; }
  .hero-text h1 span { color: var(--sun); }
  .hero-text p { color: rgba(255,255,255,0.85); font-size: 16px; max-width: 400px; line-height: 1.6; }
  .hero-stats { display: flex; gap: 32px; margin-top: 24px; }
  .hero-stat { text-align: center; }
  .hero-stat-num { color: var(--sun); font-size: 28px; font-weight: 800; }
  .hero-stat-label { color: rgba(255,255,255,0.7); font-size: 12px; margin-top: 2px; }

  /* SECTION */
  .section-title {
    font-size: 22px; font-weight: 800; color: var(--text);
    margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
  }
  .section-title::after { content: ''; flex: 1; height: 2px; background: var(--border); border-radius: 1px; }

  /* STORE CARDS */
  .stores-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; margin-bottom: 40px; }
  .store-card {
    background: white; border-radius: var(--radius); border: 1px solid var(--border);
    padding: 24px; cursor: pointer; transition: all 0.25s;
    display: flex; gap: 16px; align-items: flex-start;
  }
  .store-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); border-color: var(--leaf-light); }
  .store-avatar {
    width: 56px; height: 56px; background: var(--leaf-pale); border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;
  }
  .store-info { flex: 1; }
  .store-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .store-addr { font-size: 12px; color: var(--text-mid); line-height: 1.5; margin-bottom: 8px; }
  .store-meta { display: flex; gap: 12px; }
  .store-badge {
    font-size: 11px; padding: 3px 8px; border-radius: 50px; font-weight: 600;
    background: var(--leaf-pale); color: var(--leaf);
  }

  /* PRODUCT GRID */
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px; }
  .product-card {
    background: white; border-radius: var(--radius); border: 1px solid var(--border);
    overflow: hidden; cursor: pointer; transition: all 0.25s;
  }
  .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
  .product-img {
    height: 140px; background: linear-gradient(135deg, var(--leaf-pale) 0%, #d4ead4 100%);
    display: flex; align-items: center; justify-content: center; font-size: 64px;
    position: relative;
  }
  .product-featured {
    position: absolute; top: 10px; left: 10px;
    background: var(--sun); color: var(--text); font-size: 10px; font-weight: 700;
    padding: 3px 8px; border-radius: 50px;
  }
  .product-body { padding: 16px; }
  .product-store { font-size: 11px; color: var(--text-light); margin-bottom: 4px; }
  .product-name { font-size: 15px; font-weight: 700; margin-bottom: 6px; line-height: 1.3; }
  .product-desc { font-size: 12px; color: var(--text-mid); line-height: 1.5; margin-bottom: 12px; height: 36px; overflow: hidden; }
  .product-price { font-size: 18px; font-weight: 800; color: var(--leaf); margin-bottom: 12px; }
  .product-price span { font-size: 12px; font-weight: 400; color: var(--text-mid); }
  .btn-add {
    width: 100%; background: var(--leaf); color: white; border: none;
    padding: 10px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-add:hover { background: var(--leaf-light); }

  /* PRODUCT MODAL */
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    z-index: 200; display: flex; align-items: center; justify-content: center;
    padding: 20px; backdrop-filter: blur(4px);
  }
  .modal {
    background: white; border-radius: 24px; width: 100%; max-width: 560px;
    max-height: 90vh; overflow-y: auto;
    animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-img {
    height: 200px; background: linear-gradient(135deg, var(--leaf-pale) 0%, #c8e8c8 100%);
    display: flex; align-items: center; justify-content: center; font-size: 96px;
    border-radius: 24px 24px 0 0;
  }
  .modal-body { padding: 28px; }
  .modal-store { font-size: 12px; color: var(--text-light); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
  .modal-name { font-size: 24px; font-weight: 800; margin-bottom: 10px; }
  .modal-desc { font-size: 14px; color: var(--text-mid); line-height: 1.7; margin-bottom: 20px; }
  .modal-section-label { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 10px; }
  .unit-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .unit-option {
    border: 2px solid var(--border); border-radius: var(--radius-sm);
    padding: 12px 16px; cursor: pointer; transition: all 0.15s;
    display: flex; justify-content: space-between; align-items: center;
  }
  .unit-option.selected { border-color: var(--leaf); background: var(--leaf-pale); }
  .unit-option-label { font-size: 14px; font-weight: 600; }
  .unit-option-price { font-size: 16px; font-weight: 800; color: var(--leaf); }
  .qty-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .qty-label { font-size: 13px; font-weight: 700; flex: 1; }
  .qty-ctrl { display: flex; align-items: center; gap: 0; border: 2px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
  .qty-btn {
    background: var(--leaf-pale); border: none; color: var(--leaf); font-size: 18px; font-weight: 700;
    width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .qty-btn:hover { background: var(--border); }
  .qty-val { width: 48px; text-align: center; font-size: 16px; font-weight: 700; }
  .modal-total { font-size: 20px; font-weight: 800; color: var(--leaf); text-align: right; margin-bottom: 20px; }
  .btn-add-cart {
    width: 100%; background: var(--leaf); color: white; border: none;
    padding: 16px; border-radius: var(--radius-sm); font-size: 16px; font-weight: 700;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-add-cart:hover { background: var(--leaf-light); transform: translateY(-1px); }
  .btn-close {
    position: absolute; top: 16px; right: 16px; background: rgba(0,0,0,0.3);
    border: none; color: white; width: 36px; height: 36px; border-radius: 50%;
    font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }

  /* CART */
  .cart-page { animation: slideUp 0.3s ease; }
  .cart-store-group {
    background: white; border-radius: var(--radius); border: 1px solid var(--border);
    margin-bottom: 20px; overflow: hidden;
  }
  .cart-store-header {
    background: var(--leaf-pale); padding: 16px 20px;
    display: flex; align-items: center; gap: 10px; font-weight: 700;
    border-bottom: 1px solid var(--border); font-size: 15px;
  }
  .cart-item {
    padding: 16px 20px; display: flex; align-items: center; gap: 16px;
    border-bottom: 1px solid var(--border);
  }
  .cart-item:last-child { border-bottom: none; }
  .cart-item-emoji { font-size: 32px; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .cart-item-unit { font-size: 12px; color: var(--text-mid); }
  .cart-item-price { font-size: 15px; font-weight: 800; color: var(--leaf); min-width: 80px; text-align: right; }
  .cart-item-remove {
    background: none; border: 1px solid #fcc; color: #c44; border-radius: 50px;
    padding: 4px 10px; font-size: 12px; cursor: pointer; font-family: inherit;
    transition: all 0.15s;
  }
  .cart-item-remove:hover { background: #fee; }
  .cart-summary {
    background: white; border-radius: var(--radius); border: 2px solid var(--leaf);
    padding: 24px; margin-top: 20px;
  }
  .cart-total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: var(--text-mid); }
  .cart-total-main { display: flex; justify-content: space-between; font-size: 22px; font-weight: 800; color: var(--leaf); margin-top: 12px; padding-top: 12px; border-top: 2px solid var(--border); }
  .btn-checkout {
    width: 100%; background: var(--sun); color: var(--text); border: none;
    padding: 16px; border-radius: var(--radius-sm); font-size: 16px; font-weight: 800;
    cursor: pointer; font-family: inherit; margin-top: 16px; transition: all 0.2s;
  }
  .btn-checkout:hover { background: var(--sun-deep); color: white; transform: translateY(-1px); }

  /* SELLER DASHBOARD */
  .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    background: white; border-radius: var(--radius); border: 1px solid var(--border);
    padding: 20px; text-align: center;
  }
  .stat-num { font-size: 32px; font-weight: 800; color: var(--leaf); }
  .stat-label { font-size: 13px; color: var(--text-mid); margin-top: 4px; }
  .stat-trend { font-size: 12px; color: #4a9; margin-top: 4px; }

  .orders-table { width: 100%; border-collapse: collapse; background: white; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); }
  .orders-table th { background: var(--leaf-pale); padding: 14px 16px; text-align: left; font-size: 13px; font-weight: 700; color: var(--leaf); }
  .orders-table td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid var(--border); }
  .orders-table tr:last-child td { border-bottom: none; }
  .orders-table tr:hover td { background: var(--leaf-pale); }
  .status-badge {
    padding: 4px 10px; border-radius: 50px; font-size: 11px; font-weight: 700;
  }
  .status-pending { background: #fff3cd; color: #856404; }
  .status-confirmed { background: #d1e7dd; color: #0f5132; }
  .status-shipped { background: #cff4fc; color: #055160; }
  .status-done { background: #d4edda; color: #155724; }

  /* SELLER ADD PRODUCT */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-label { font-size: 13px; font-weight: 700; color: var(--text); }
  .form-input, .form-textarea, .form-select {
    border: 2px solid var(--border); border-radius: var(--radius-sm);
    padding: 12px 14px; font-size: 14px; font-family: inherit;
    outline: none; transition: border-color 0.2s; color: var(--text);
    background: white;
  }
  .form-input:focus, .form-textarea:focus, .form-select:focus { border-color: var(--leaf); }
  .form-textarea { resize: vertical; min-height: 80px; }
  .unit-editor { border: 2px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
  .unit-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 0; border-bottom: 1px solid var(--border); }
  .unit-row:last-child { border-bottom: none; }
  .unit-row input { border: none; padding: 10px 14px; font-size: 13px; font-family: inherit; outline: none; }
  .unit-row input:focus { background: var(--leaf-pale); }
  .unit-row-del { background: none; border: none; border-left: 1px solid var(--border); padding: 0 14px; color: #c44; cursor: pointer; font-size: 16px; }
  .btn-add-unit {
    background: var(--leaf-pale); border: 2px dashed var(--leaf-light); color: var(--leaf);
    padding: 10px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: inherit; margin-top: 8px; width: 100%;
    transition: all 0.15s;
  }
  .btn-add-unit:hover { background: var(--leaf); color: white; }
  .btn-primary {
    background: var(--leaf); color: white; border: none;
    padding: 14px 28px; border-radius: var(--radius-sm); font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-primary:hover { background: var(--leaf-light); }

  /* TOAST */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    background: var(--leaf); color: white; padding: 14px 20px;
    border-radius: var(--radius-sm); font-size: 14px; font-weight: 600;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px;
    animation: toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes toastIn { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* LINE LOGIN MODAL */
  .login-modal { padding: 40px; text-align: center; }
  .login-logo { font-size: 64px; margin-bottom: 16px; }
  .login-title { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
  .login-sub { color: var(--text-mid); font-size: 14px; margin-bottom: 32px; line-height: 1.6; }
  .btn-line {
    background: #06c755; color: white; border: none;
    padding: 16px 32px; border-radius: 50px; font-size: 16px; font-weight: 700;
    cursor: pointer; font-family: inherit; display: flex; align-items: center;
    gap: 10px; margin: 0 auto; transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(6,199,85,0.3);
  }
  .btn-line:hover { background: #05b04d; transform: translateY(-2px); }

  /* EMPTY STATE */
  .empty { text-align: center; padding: 60px 20px; color: var(--text-mid); }
  .empty-icon { font-size: 64px; margin-bottom: 16px; }
  .empty h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: var(--text); }

  /* TABS */
  .seller-tabs { display: flex; gap: 0; border-bottom: 2px solid var(--border); margin-bottom: 24px; }
  .seller-tab {
    padding: 12px 20px; font-size: 14px; font-weight: 500; cursor: pointer;
    color: var(--text-mid); border-bottom: 3px solid transparent; margin-bottom: -2px;
    font-family: inherit; background: none; border-left: none; border-right: none; border-top: none;
    transition: all 0.2s;
  }
  .seller-tab.active { color: var(--leaf); border-bottom-color: var(--leaf); font-weight: 700; }

  .tag { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 50px; }
  .tag-green { background: var(--leaf-pale); color: var(--leaf); }

  @media (max-width: 768px) {
    .hero { padding: 32px 24px; }
    .hero-text h1 { font-size: 24px; }
    .form-grid { grid-template-columns: 1fr; }
    .header-inner { gap: 8px; }
    .search-bar { display: none; }
  }
`;

// ==================== COMPONENTS ====================

function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="toast">✅ {msg}</div>;
}

function ProductModal({ product, store, onClose, onAdd }) {
  const [selectedUnit, setSelectedUnit] = useState(product.units[0]);
  const [qty, setQty] = useState(1);

  const total = selectedUnit.price * qty;

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ position: "relative" }}>
        <button className="btn-close" onClick={onClose}>✕</button>
        <div className="modal-img">{product.images[0]}</div>
        <div className="modal-body">
          <div className="modal-store">🏪 {store?.name}</div>
          <div className="modal-name">{product.name}</div>
          <div className="modal-desc">{product.description}</div>

          <div className="modal-section-label">เลือกหน่วยการซื้อ</div>
          <div className="unit-options">
            {product.units.map((u) => (
              <div key={u.id} className={`unit-option ${selectedUnit.id === u.id ? "selected" : ""}`} onClick={() => setSelectedUnit(u)}>
                <span className="unit-option-label">{u.label}</span>
                <span className="unit-option-price">฿{u.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="qty-row">
            <span className="qty-label">จำนวน</span>
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          <div className="modal-total">รวม ฿{total.toLocaleString()}</div>

          <button className="btn-add-cart" onClick={() => { onAdd({ product, store, unit: selectedUnit, qty }); onClose(); }}>
            🛒 เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginModal({ onClose, onLogin }) {
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ position: "relative" }}>
        <button className="btn-close" style={{ color: "var(--text)", background: "var(--border)" }} onClick={onClose}>✕</button>
        <div className="login-modal">
          <div className="login-logo">🛍️</div>
          <div className="login-title">เข้าสู่ระบบ</div>
          <div className="login-sub">เชื่อมต่อบัญชี LINE ของคุณเพื่อสั่งซื้อสินค้า<br />และติดตามออเดอร์ได้สะดวก</div>
          <button className="btn-line" onClick={onLogin}>
            <span style={{ fontSize: 22 }}>💬</span> เข้าสู่ระบบด้วย LINE
          </button>
          <p style={{ marginTop: 16, fontSize: 12, color: "var(--text-light)" }}>ระบบจะขอสิทธิ์เข้าถึงชื่อและรูปโปรไฟล์ LINE เท่านั้น</p>
        </div>
      </div>
    </div>
  );
}

// ==================== PAGES ====================

function HomePage({ stores, products, onProductClick, onStoreClick, searchQuery }) {
  const filtered = searchQuery
    ? products.filter((p) => {
        const store = stores.find((s) => s.id === p.storeId);
        return (
          p.name.includes(searchQuery) ||
          store?.name.includes(searchQuery) ||
          store?.address.includes(searchQuery)
        );
      })
    : products;

  return (
    <div>
      {!searchQuery && (
        <div className="hero">
          <div className="hero-text">
            <h1>ผลไม้สด<br />จาก<span>สวนสู่มือคุณ</span></h1>
            <p>เลือกซื้อผลไม้จากเกษตรกรโดยตรง คุณภาพดี ราคาเป็นธรรม ส่งตรงจากสวน</p>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">{stores.length}</div>
                <div className="hero-stat-label">ร้านค้า</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{products.length}</div>
                <div className="hero-stat-label">สินค้า</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">500+</div>
                <div className="hero-stat-label">ออเดอร์</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!searchQuery && (
        <>
          <div className="section-title">🏪 ร้านค้าทั้งหมด</div>
          <div className="stores-grid">
            {stores.map((store) => (
              <div key={store.id} className="store-card" onClick={() => onStoreClick(store)}>
                <div className="store-avatar">{store.avatar}</div>
                <div className="store-info">
                  <div className="store-name">{store.name}</div>
                  <div className="store-addr">📍 {store.address}</div>
                  <div className="store-addr">🚗 รับสินค้า: {store.pickup}</div>
                  <div className="store-meta">
                    <span className="store-badge">⭐ {store.rating}</span>
                    <span className="store-badge">📦 {store.totalSales} ออเดอร์</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="section-title">{searchQuery ? `🔍 ผลการค้นหา "${searchQuery}"` : "🍎 สินค้าแนะนำ"}</div>
      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <h3>ไม่พบสินค้าที่ค้นหา</h3>
          <p>ลองค้นหาด้วยชื่อสินค้า ชื่อร้าน หรือที่อยู่</p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map((p) => {
            const store = stores.find((s) => s.id === p.storeId);
            const minPrice = Math.min(...p.units.map((u) => u.price));
            return (
              <div key={p.id} className="product-card" onClick={() => onProductClick(p)}>
                <div className="product-img">
                  {p.featured && <div className="product-featured">⭐ แนะนำ</div>}
                  {p.images[0]}
                </div>
                <div className="product-body">
                  <div className="product-store">🏪 {store?.name}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.description}</div>
                  <div className="product-price">฿{minPrice.toLocaleString()} <span>ขึ้นไป</span></div>
                  <button className="btn-add" onClick={(e) => { e.stopPropagation(); onProductClick(p); }}>
                    + เพิ่มลงตะกร้า
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

function CartPage({ cart, stores, onRemove, user, onLogin }) {
  const grouped = cart.reduce((acc, item) => {
    if (!acc[item.store.id]) acc[item.store.id] = { store: item.store, items: [] };
    acc[item.store.id].items.push(item);
    return acc;
  }, {});

  const grandTotal = cart.reduce((s, i) => s + i.unit.price * i.qty, 0);

  if (!user) {
    return (
      <div className="empty">
        <div className="empty-icon">🔒</div>
        <h3>กรุณาเข้าสู่ระบบก่อน</h3>
        <p style={{ marginBottom: 20 }}>เข้าสู่ระบบเพื่อดูตะกร้าสินค้าและสั่งซื้อ</p>
        <button className="btn-line" onClick={onLogin} style={{ margin: "0 auto", display: "flex" }}>
          💬 เข้าสู่ระบบด้วย LINE
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">🛒</div>
        <h3>ตะกร้าสินค้าว่างเปล่า</h3>
        <p>เลือกสินค้าที่ต้องการแล้วเพิ่มลงตะกร้า</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="section-title">🛒 ตะกร้าสินค้า ({cart.length} รายการ)</div>
      {Object.values(grouped).map(({ store, items }) => (
        <div key={store.id} className="cart-store-group">
          <div className="cart-store-header">
            <span style={{ fontSize: 20 }}>{store.avatar}</span>
            {store.name}
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-mid)", fontWeight: 400 }}>
              📍 รับสินค้า: {store.pickup}
            </span>
          </div>
          {items.map((item, i) => (
            <div key={i} className="cart-item">
              <div className="cart-item-emoji">{item.product.images[0]}</div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.product.name}</div>
                <div className="cart-item-unit">{item.unit.label} × {item.qty}</div>
              </div>
              <div className="cart-item-price">฿{(item.unit.price * item.qty).toLocaleString()}</div>
              <button className="cart-item-remove" onClick={() => onRemove(i)}>ลบ</button>
            </div>
          ))}
        </div>
      ))}
      <div className="cart-summary">
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>สรุปคำสั่งซื้อ</div>
        {Object.values(grouped).map(({ store, items }) => {
          const sub = items.reduce((s, i) => s + i.unit.price * i.qty, 0);
          return (
            <div key={store.id} className="cart-total-row">
              <span>{store.name}</span>
              <span>฿{sub.toLocaleString()}</span>
            </div>
          );
        })}
        <div className="cart-total-main">
          <span>รวมทั้งหมด</span>
          <span>฿{grandTotal.toLocaleString()}</span>
        </div>
        <button className="btn-checkout">✅ ยืนยันคำสั่งซื้อ</button>
      </div>
    </div>
  );
}

function SellerPage({ user, onLogin, stores, products, orders, onAddProduct }) {
  const [tab, setTab] = useState("dashboard");
  const [newProduct, setNewProduct] = useState({
    name: "", description: "", category: "",
    units: [{ id: "1", label: "", price: "" }],
  });

  const myStore = stores[0]; // mock: seller owns first store
  const myOrders = orders.filter((o) => o.storeId === myStore?.id);
  const myProducts = products.filter((p) => p.storeId === myStore?.id);

  const totalRevenue = myOrders.reduce((s, o) => s + o.total, 0);

  if (!user) {
    return (
      <div className="empty">
        <div className="empty-icon">🏪</div>
        <h3>เข้าสู่ระบบเพื่อจัดการร้านค้า</h3>
        <p style={{ marginBottom: 20 }}>ผู้ขายต้องเข้าสู่ระบบด้วย LINE เพื่อใช้งาน</p>
        <button className="btn-line" onClick={onLogin} style={{ margin: "0 auto", display: "flex" }}>
          💬 เข้าสู่ระบบด้วย LINE
        </button>
      </div>
    );
  }

  const statusMap = { pending: "รอยืนยัน", confirmed: "ยืนยันแล้ว", shipped: "จัดส่งแล้ว", done: "เสร็จสิ้น" };
  const statusClass = { pending: "status-pending", confirmed: "status-confirmed", shipped: "status-shipped", done: "status-done" };

  return (
    <div>
      <div className="section-title">🏪 แดชบอร์ดผู้ขาย — {myStore?.name}</div>
      <div className="seller-tabs">
        {[["dashboard", "📊 ภาพรวม"], ["orders", "📦 ออเดอร์"], ["products", "🍎 สินค้า"], ["add", "➕ เพิ่มสินค้า"], ["settings", "⚙️ ตั้งค่าร้าน"]].map(([k, l]) => (
          <button key={k} className={`seller-tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "dashboard" && (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-num">{myOrders.length}</div>
              <div className="stat-label">ออเดอร์ทั้งหมด</div>
              <div className="stat-trend">↑ 3 ใหม่วันนี้</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">฿{totalRevenue.toLocaleString()}</div>
              <div className="stat-label">ยอดขายรวม</div>
              <div className="stat-trend">↑ 12% จากเดือนที่แล้ว</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{myProducts.length}</div>
              <div className="stat-label">สินค้าในร้าน</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{myStore?.rating}</div>
              <div className="stat-label">คะแนนเฉลี่ย</div>
              <div className="stat-trend">จาก {myStore?.totalSales} รีวิว</div>
            </div>
          </div>
          <div className="section-title">📦 ออเดอร์ล่าสุด</div>
          <div style={{ overflowX: "auto" }}>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ออเดอร์ #</th>
                  <th>ผู้ซื้อ</th>
                  <th>สินค้า</th>
                  <th>ยอดรวม</th>
                  <th>สถานะ</th>
                  <th>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700 }}>{o.id.toUpperCase()}</td>
                    <td>{o.buyerName}</td>
                    <td>{o.items.map((i) => `${i.productName} (${i.qty} ${i.unit})`).join(", ")}</td>
                    <td style={{ fontWeight: 700, color: "var(--leaf)" }}>฿{o.total.toLocaleString()}</td>
                    <td><span className={`status-badge ${statusClass[o.status]}`}>{statusMap[o.status]}</span></td>
                    <td style={{ color: "var(--text-mid)" }}>{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "orders" && (
        <>
          <div style={{ overflowX: "auto" }}>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ออเดอร์ #</th>
                  <th>ผู้ซื้อ</th>
                  <th>รายการสินค้า</th>
                  <th>หมายเหตุ</th>
                  <th>ยอดรวม</th>
                  <th>สถานะ</th>
                  <th>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700 }}>{o.id.toUpperCase()}</td>
                    <td>{o.buyerName}</td>
                    <td>
                      {o.items.map((i, idx) => (
                        <div key={idx} style={{ fontSize: 12 }}>
                          {i.productName} × {i.qty} {i.unit} = ฿{(i.price * i.qty).toLocaleString()}
                        </div>
                      ))}
                    </td>
                    <td style={{ color: "var(--text-mid)", fontSize: 12 }}>{o.note || "-"}</td>
                    <td style={{ fontWeight: 700, color: "var(--leaf)" }}>฿{o.total.toLocaleString()}</td>
                    <td><span className={`status-badge ${statusClass[o.status]}`}>{statusMap[o.status]}</span></td>
                    <td style={{ color: "var(--text-mid)" }}>{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "products" && (
        <div className="products-grid">
          {myProducts.map((p) => {
            const minPrice = Math.min(...p.units.map((u) => u.price));
            return (
              <div key={p.id} className="product-card">
                <div className="product-img">{p.images[0]}</div>
                <div className="product-body">
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.description}</div>
                  <div className="product-price">฿{minPrice.toLocaleString()} <span>ขึ้นไป</span></div>
                  <div style={{ fontSize: 12, color: "var(--text-mid)" }}>
                    {p.units.map((u) => `${u.label}: ฿${u.price}`).join(" | ")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "add" && (
        <div style={{ background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: 28 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 24 }}>➕ เพิ่มสินค้าใหม่</div>
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">ชื่อสินค้า *</label>
              <input className="form-input" value={newProduct.name} placeholder="เช่น ส้มสายน้ำผึ้ง เกรด A"
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            </div>
            <div className="form-group full">
              <label className="form-label">คำอธิบายสินค้า</label>
              <textarea className="form-textarea" value={newProduct.description} placeholder="บรรยายลักษณะ คุณภาพ วิธีการเก็บ..."
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">หมวดหมู่</label>
              <select className="form-select" value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                <option value="">เลือกหมวดหมู่</option>
                {["ส้ม", "ส้มโอ", "มะม่วง", "ทุเรียน", "มังคุด", "เงาะ", "ลำไย", "ลิ้นจี่", "อื่นๆ"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">รูปภาพสินค้า</label>
              <input className="form-input" type="file" accept="image/*" multiple style={{ padding: "8px 14px" }} />
              <span style={{ fontSize: 11, color: "var(--text-light)" }}>อัปโหลดได้หลายรูป (max 5 MB/รูป)</span>
            </div>
            <div className="form-group full">
              <label className="form-label">หน่วยการขาย & ราคา *</label>
              <div className="unit-editor">
                <div className="unit-row" style={{ background: "var(--leaf-pale)", fontWeight: 700, fontSize: 12, color: "var(--leaf)" }}>
                  <div style={{ padding: "8px 14px" }}>หน่วย</div>
                  <div style={{ padding: "8px 14px", borderLeft: "1px solid var(--border)" }}>ราคา (บาท)</div>
                  <div style={{ padding: "8px 14px", borderLeft: "1px solid var(--border)" }}></div>
                </div>
                {newProduct.units.map((u, i) => (
                  <div key={i} className="unit-row">
                    <input value={u.label} placeholder="เช่น กิโลกรัม, ลัง, แพ็ค"
                      onChange={(e) => {
                        const units = [...newProduct.units];
                        units[i] = { ...u, label: e.target.value };
                        setNewProduct({ ...newProduct, units });
                      }} />
                    <input value={u.price} type="number" placeholder="0"
                      style={{ borderLeft: "1px solid var(--border)" }}
                      onChange={(e) => {
                        const units = [...newProduct.units];
                        units[i] = { ...u, price: e.target.value };
                        setNewProduct({ ...newProduct, units });
                      }} />
                    <button className="unit-row-del" onClick={() => {
                      if (newProduct.units.length > 1)
                        setNewProduct({ ...newProduct, units: newProduct.units.filter((_, j) => j !== i) });
                    }}>✕</button>
                  </div>
                ))}
              </div>
              <button className="btn-add-unit" onClick={() =>
                setNewProduct({ ...newProduct, units: [...newProduct.units, { id: Date.now().toString(), label: "", price: "" }] })
              }>
                + เพิ่มหน่วยการขาย
              </button>
            </div>
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button className="btn-primary" onClick={() => {
              if (!newProduct.name) return alert("กรุณากรอกชื่อสินค้า");
              onAddProduct(newProduct);
              setNewProduct({ name: "", description: "", category: "", units: [{ id: "1", label: "", price: "" }] });
              setTab("products");
            }}>
              ✅ บันทึกสินค้า
            </button>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div style={{ background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: 28 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 24 }}>⚙️ ตั้งค่าร้านค้า</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">ชื่อร้านค้า</label>
              <input className="form-input" defaultValue={myStore?.name} />
            </div>
            <div className="form-group">
              <label className="form-label">เบอร์โทรศัพท์</label>
              <input className="form-input" defaultValue={myStore?.phone} />
            </div>
            <div className="form-group full">
              <label className="form-label">ที่อยู่ร้าน</label>
              <textarea className="form-textarea" defaultValue={myStore?.address} />
            </div>
            <div className="form-group full">
              <label className="form-label">จุดรับสินค้า / เวลาเปิด-ปิด</label>
              <textarea className="form-textarea" defaultValue={myStore?.pickup} />
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <button className="btn-primary">💾 บันทึกการตั้งค่า</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== APP ====================

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const showToast = (msg) => setToast(msg);

  const handleLogin = useCallback(() => {
    setUser(MOCK_USER);
    setShowLogin(false);
    showToast("เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ " + MOCK_USER.name);
  }, []);

  const handleAddToCart = useCallback(({ product, store, unit, qty }) => {
    if (!user) { setShowLogin(true); return; }
    setCart((prev) => [...prev, { product, store, unit, qty }]);
    showToast(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`);
  }, [user]);

  const handleRemoveFromCart = useCallback((idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleProductClick = useCallback((p) => {
    const store = MOCK_STORES.find((s) => s.id === p.storeId);
    setSelectedProduct({ product: p, store });
  }, []);

  const handleAddProduct = useCallback((data) => {
    const newP = {
      id: "p" + Date.now(),
      storeId: MOCK_STORES[0].id,
      name: data.name,
      description: data.description,
      images: ["🍎"],
      units: data.units.map((u) => ({ id: u.id, label: u.label, price: parseFloat(u.price) || 0 })),
      category: data.category,
      featured: false,
    };
    setProducts((prev) => [...prev, newP]);
    showToast("เพิ่มสินค้า " + data.name + " สำเร็จ!");
  }, []);

  const cartCount = cart.length;

  return (
    <>
      <style>{styles}</style>

      <header className="header">
        <div className="header-inner">
          <div className="logo" onClick={() => { setPage("home"); setSearchQuery(""); setSearchInput(""); }}>
            <span className="logo-icon">🧺</span>
            <span className="logo-text">ไทย<span>ฟรุ๊ต</span></span>
          </div>
          <div className="search-bar">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setSearchQuery(searchInput); setPage("home"); } }}
              placeholder="ค้นหาผลไม้ ร้านค้า หรือที่อยู่..."
            />
            <button className="search-btn" onClick={() => { setSearchQuery(searchInput); setPage("home"); }}>
              🔍 ค้นหา
            </button>
          </div>
          <div className="header-actions">
            {user ? (
              <div className="btn-header">
                <span>{user.avatar}</span> {user.name}
              </div>
            ) : (
              <button className="btn-header" onClick={() => setShowLogin(true)}>
                💬 เข้าสู่ระบบ
              </button>
            )}
            <button className="btn-header btn-cart" onClick={() => setPage("cart")}>
              🛒 ตะกร้า
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="btn-header" onClick={() => setPage("seller")}>
              🏪 ผู้ขาย
            </button>
          </div>
        </div>
      </header>

      <nav className="nav-tabs">
        {[
          ["home", "🏠 หน้าแรก"],
          ["home", "🍊 ส้ม"],
          ["home", "🌳 ทุเรียน"],
          ["home", "🥭 มะม่วง"],
          ["home", "🍈 ส้มโอ"],
          ["home", "🫐 มังคุด"],
        ].map(([p, l], i) => (
          <button key={i} className={`nav-tab ${page === p && i === 0 ? "active" : ""}`}
            onClick={() => { setPage(p); if (i > 0) { setSearchQuery(l.slice(3)); setSearchInput(l.slice(3)); } else { setSearchQuery(""); setSearchInput(""); } }}>
            {l}
          </button>
        ))}
      </nav>

      <main className="main">
        {page === "home" && (
          <HomePage
            stores={MOCK_STORES}
            products={products}
            onProductClick={handleProductClick}
            onStoreClick={() => {}}
            searchQuery={searchQuery}
          />
        )}
        {page === "cart" && (
          <CartPage
            cart={cart}
            stores={MOCK_STORES}
            onRemove={handleRemoveFromCart}
            user={user}
            onLogin={() => setShowLogin(true)}
          />
        )}
        {page === "seller" && (
          <SellerPage
            user={user}
            onLogin={() => setShowLogin(true)}
            stores={MOCK_STORES}
            products={products}
            orders={MOCK_ORDERS}
            onAddProduct={handleAddProduct}
          />
        )}
      </main>

      {selectedProduct && (
        <ProductModal
          {...selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={handleAddToCart}
        />
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
