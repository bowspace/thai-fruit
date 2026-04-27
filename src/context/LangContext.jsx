import { createContext, useContext, useState, useCallback } from 'react';

const LangContext = createContext(null);

const translations = {
    // Header
    'search.placeholder': {
        th: 'ค้นหาผลไม้ ร้านค้า...',
        en: 'Search fruits, stores...',
        cn: '搜索水果、店铺...',
    },
    'search.btn': {
        th: 'ค้นหา',
        en: 'Search',
        cn: '搜索',
    },
    'nav.seller': {
        th: 'ผู้ขาย',
        en: 'Seller',
        cn: '卖家',
    },
    'nav.cart': {
        th: 'ตะกร้า',
        en: 'Cart',
        cn: '购物车',
    },
    'nav.login': {
        th: 'เข้าสู่ระบบ',
        en: 'Sign In',
        cn: '登录',
    },
    'nav.logout': {
        th: 'ออกจากระบบ',
        en: 'Sign Out',
        cn: '退出',
    },

    // Hero
    'hero.badge': {
        th: 'สินค้าคุณภาพคัดกรองพิเศษ',
        en: 'Hand-picked Premium Quality',
        cn: '精选优质水果',
    },
    'hero.title1': {
        th: 'ผลไม้เกรดพรีเมียม',
        en: 'Premium Thai Fruits',
        cn: '泰国优质水果',
    },
    'hero.title2': {
        th: 'ส่งตรงจากสวน ',
        en: 'Fresh from Farm ',
        cn: '从果园 ',
    },
    'hero.title3': {
        th: 'ถึงหน้าบ้านคุณ',
        en: 'to Your Door',
        cn: '直达您家',
    },
    'hero.desc': {
        th: 'เลือกซื้อผลไม้สดใหม่ รสชาติอร่อยจากเกษตรกรชาวสวนโดยตรง ได้ประโยชน์เต็มๆ ในราคายุติธรรม',
        en: 'Shop fresh tropical fruits directly from Thai farmers. Authentic taste, fair prices, delivered to your doorstep.',
        cn: '直接从泰国果农手中购买新鲜热带水果。正宗风味，公平价格，送货上门。',
    },
    'hero.stat.stores': {
        th: 'ร้านค้าและฟาร์ม',
        en: 'Farms & Stores',
        cn: '果园和店铺',
    },
    'hero.stat.products': {
        th: 'ผลไม้คัดเกรด',
        en: 'Premium Fruits',
        cn: '优选水果',
    },
    'hero.stat.customers': {
        th: 'ลูกค้าที่ไว้วางใจ',
        en: 'Happy Customers',
        cn: '满意顾客',
    },

    // Sections
    'section.stores': {
        th: 'ร้านค้าและสวนผลไม้แนะนำ',
        en: 'Featured Farms & Orchards',
        cn: '推荐果园和店铺',
    },
    'section.farmers': {
        th: 'พบกับเกษตรกร',
        en: 'Meet our farmers',
        cn: '认识我们的农户',
    },
    'section.season': {
        th: 'ผลไม้ตามฤดูกาล',
        en: 'What’s in season',
        cn: '当季水果',
    },
    'section.seasonDesc': {
        th: 'เก็บเกี่ยวในช่วงเวลาที่หวานที่สุดของปี',
        en: 'Picked at peak ripeness, this week',
        cn: '本周最新鲜的当季水果',
    },
    'season.view': {
        th: 'ดูสินค้า',
        en: 'View',
        cn: '查看',
    },
    'section.seasonal': {
        th: 'ผลไม้ขายดีประจำฤดูกาล',
        en: 'Best-Selling Seasonal Fruits',
        cn: '当季畅销水果',
    },
    'section.results': {
        th: 'ผลการค้นหา',
        en: 'Search Results',
        cn: '搜索结果',
    },
    'section.category': {
        th: 'ผลไม้ประเภท',
        en: 'Category',
        cn: '类别',
    },
    'section.found': {
        th: 'พบสินค้าทั้งหมด {count} รายการ',
        en: '{count} products found',
        cn: '共找到 {count} 件商品',
    },
    'store.badge.pickup': {
        th: 'รับที่สวนได้',
        en: 'Farm Pickup',
        cn: '可自提',
    },

    // Product
    'product.from': {
        th: 'เริ่มต้น',
        en: 'from',
        cn: '起',
    },
    'product.addToCart': {
        th: 'ใส่ตะกร้า',
        en: 'Add to Cart',
        cn: '加入购物车',
    },
    'product.featured': {
        th: '⭐ แนะนำ',
        en: '⭐ Featured',
        cn: '⭐ 推荐',
    },

    // Empty state
    'empty.title': {
        th: 'ไม่พบสินค้าที่คุณค้นหา',
        en: 'No products found',
        cn: '未找到商品',
    },
    'empty.desc': {
        th: 'ลองใช้คำค้นหาอื่น หรือดูสินค้าประเภทอื่นแทน',
        en: 'Try different keywords or browse other categories',
        cn: '请尝试其他关键词或浏览其他类别',
    },
    'empty.showAll': {
        th: 'แสดงสินค้าทั้งหมด',
        en: 'Show All Products',
        cn: '显示所有商品',
    },

    // Product Modal
    'modal.selectUnit': {
        th: 'เลือกหน่วยการซื้อ',
        en: 'Select Unit',
        cn: '选择规格',
    },
    'modal.qty': {
        th: 'จำนวน',
        en: 'Quantity',
        cn: '数量',
    },
    'modal.total': {
        th: 'ยอดรวมสุทธิ',
        en: 'Total',
        cn: '合计',
    },
    'modal.loginRequired': {
        th: 'ต้องเข้าสู่ระบบก่อนเพิ่มลงตะกร้า',
        en: 'Please sign in to add items to cart',
        cn: '请先登录再加入购物车',
    },
    'modal.addToCart': {
        th: 'เพิ่มลงตะกร้า',
        en: 'Add to Cart',
        cn: '加入购物车',
    },
    'modal.loginToOrder': {
        th: 'เข้าสู่ระบบเพื่อสั่งซื้อ',
        en: 'Sign In to Order',
        cn: '登录后下单',
    },
    'modal.defaultStore': {
        th: 'ร้านค้าทั่วไป',
        en: 'General Store',
        cn: '普通店铺',
    },

    // Product Detail page
    'pd.back': {
        th: 'กลับ',
        en: 'Back',
        cn: '返回',
    },
    'pd.sales': {
        th: 'ยอดขาย',
        en: 'sales',
        cn: '销量',
    },
    'pd.aboutStore': {
        th: 'เกี่ยวกับร้านค้า',
        en: 'About the Store',
        cn: '关于店铺',
    },
    'pd.related': {
        th: 'สินค้าที่คุณอาจชอบ',
        en: 'You May Also Like',
        cn: '猜你喜欢',
    },

    // Login
    'login.title': {
        th: 'เข้าสู่ระบบ',
        en: 'Sign In',
        cn: '登录',
    },
    'login.desc': {
        th: 'เข้าสู่ระบบเพื่อเริ่มสั่งซื้อสินค้าและติดตามสถานะออเดอร์ได้สะดวกรวดเร็ว',
        en: 'Sign in to start ordering and track your deliveries easily.',
        cn: '登录后轻松下单并追踪订单状态。',
    },
    'login.email': {
        th: 'อีเมล',
        en: 'Email',
        cn: '邮箱',
    },
    'login.password': {
        th: 'รหัสผ่าน',
        en: 'Password',
        cn: '密码',
    },
    'login.name': {
        th: 'ชื่อ',
        en: 'Name',
        cn: '姓名',
    },
    'login.loginBtn': {
        th: 'เข้าสู่ระบบ',
        en: 'Sign In',
        cn: '登录',
    },
    'login.signupBtn': {
        th: 'สมัครสมาชิก',
        en: 'Sign Up',
        cn: '注册',
    },
    'login.switchSignup': {
        th: 'ยังไม่มีบัญชี? สมัครสมาชิก',
        en: "Don't have an account? Sign Up",
        cn: '没有账号？注册',
    },
    'login.switchLogin': {
        th: 'มีบัญชีแล้ว? เข้าสู่ระบบ',
        en: 'Already have an account? Sign In',
        cn: '已有账号？登录',
    },
    'login.testLogin': {
        th: 'ทดลองใช้งาน (บัญชีทดสอบ)',
        en: 'Try it out (Test Account)',
        cn: '试用（测试账号）',
    },
    'login.roleBuyer': {
        th: 'ผู้ซื้อ',
        en: 'Buyer',
        cn: '买家',
    },
    'login.roleSeller': {
        th: 'ผู้ขาย',
        en: 'Seller',
        cn: '卖家',
    },
    'login.note': {
        th: 'ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย',
        en: 'Your data is kept secure and private.',
        cn: '您的数据将被安全保存。',
    },

    // Footer
    'footer.desc': {
        th: 'ตลาดผลไม้สดออนไลน์ สั่งทุเรียน มังคุด มะม่วง ส้ม และผลไม้ตามฤดูกาล ส่งตรงจากสวนของเกษตรกรถึงมือคุณ',
        en: 'Online tropical fruit marketplace. Order durian, mangosteen, mango, and seasonal fruits delivered fresh from Thai farms.',
        cn: '在线热带水果市场。订购榴莲、山竹、芒果和时令水果，从泰国果园新鲜直达。',
    },
    'footer.about': {
        th: 'เกี่ยวกับเรา',
        en: 'About Us',
        cn: '关于我们',
    },
    'footer.aboutUs': {
        th: 'รู้จักไทยฟรุ๊ต',
        en: 'About ThaiFruit',
        cn: '关于ThaiFruit',
    },
    'footer.howToOrder': {
        th: 'วิธีการสั่งซื้อ',
        en: 'How to Order',
        cn: '如何下单',
    },
    'footer.shipping': {
        th: 'การจัดส่งสินค้า',
        en: 'Shipping Info',
        cn: '配送信息',
    },
    'footer.privacy': {
        th: 'นโยบายความเป็นส่วนตัว',
        en: 'Privacy Policy',
        cn: '隐私政策',
    },
    'footer.forSellers': {
        th: 'สำหรับผู้ขาย',
        en: 'For Sellers',
        cn: '卖家专区',
    },
    'footer.openStore': {
        th: 'เปิดร้านกับเรา',
        en: 'Open a Store',
        cn: '开店入驻',
    },
    'footer.guide': {
        th: 'คู่มือการใช้งาน',
        en: 'User Guide',
        cn: '使用指南',
    },
    'footer.support': {
        th: 'ติดต่อฝ่ายสนับสนุน',
        en: 'Contact Support',
        cn: '联系客服',
    },
    'footer.copyright': {
        th: 'ไทยฟรุ๊ต - ตลาดผลไม้สดออนไลน์',
        en: 'ThaiFruit — Online Tropical Fruit Marketplace',
        cn: 'ThaiFruit — 在线热带水果市场',
    },

    // Cart page
    'cart.title': {
        th: 'ตะกร้าสินค้า',
        en: 'Shopping Cart',
        cn: '购物车',
    },
    'cart.empty': {
        th: 'ตะกร้าว่างเปล่า',
        en: 'Your cart is empty',
        cn: '购物车为空',
    },
    'cart.emptyDesc': {
        th: 'ยังไม่มีสินค้าในตะกร้า เลือกซื้อผลไม้สดๆ ได้เลย!',
        en: 'No items in your cart yet. Start shopping for fresh fruits!',
        cn: '购物车中还没有商品。快去选购新鲜水果吧！',
    },
    'cart.remove': {
        th: 'ลบ',
        en: 'Remove',
        cn: '删除',
    },
    'cart.subtotal': {
        th: 'ยอดรวมสินค้า',
        en: 'Subtotal',
        cn: '小计',
    },
    'cart.shipping': {
        th: 'ค่าจัดส่ง',
        en: 'Shipping',
        cn: '运费',
    },
    'cart.free': {
        th: 'ฟรี',
        en: 'Free',
        cn: '免费',
    },
    'cart.total': {
        th: 'ยอดรวมทั้งหมด',
        en: 'Total',
        cn: '总计',
    },
    'cart.checkout': {
        th: 'สั่งซื้อสินค้า',
        en: 'Place Order',
        cn: '下单',
    },
    'cart.loginFirst': {
        th: 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อ',
        en: 'Please sign in to place an order',
        cn: '请先登录再下单',
    },
    'cart.pickup': {
        th: 'รับที่สวนได้',
        en: 'Farm pickup available',
        cn: '可到园自提',
    },
};

export function LangProvider({ children }) {
    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('thaifruit-lang') || 'th';
        }
        return 'th';
    });

    const switchLang = useCallback((newLang) => {
        setLang(newLang);
        localStorage.setItem('thaifruit-lang', newLang);
    }, []);

    const t = useCallback((key, params) => {
        const entry = translations[key];
        if (!entry) return key;
        let text = entry[lang] || entry.th;
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, v);
            });
        }
        return text;
    }, [lang]);

    // Get localized field from data objects (nameEn, nameCn, etc.)
    const locField = useCallback((obj, field) => {
        if (lang === 'th') return obj[field];
        if (lang === 'en') return obj[`${field}En`] || obj[field];
        if (lang === 'cn') return obj[`${field}Cn`] || obj[`${field}En`] || obj[field];
        return obj[field];
    }, [lang]);

    return (
        <LangContext.Provider value={{ lang, switchLang, t, locField }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}
