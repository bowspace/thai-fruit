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
    'pd.relatedFarm': {
        th: 'สินค้าอื่นจากสวนนี้',
        en: 'More from this farm',
        cn: '该农场其他产品',
    },
    'pd.fresh': {
        th: 'เก็บสดจากสวน',
        en: 'Direct from farm',
        cn: '农场直供',
    },
    'pd.per': {
        th: 'ราคาต่อ',
        en: 'per',
        cn: '每',
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
    'cart.farmDirect': {
        th: 'ส่งตรงจากเกษตรกร · ไม่มีพ่อค้าคนกลาง',
        en: 'Direct from farmers · No middlemen',
        cn: '直接来自农户 · 无中间商',
    },

    // Store Detail
    'store.backHome': {
        th: 'กลับไปหน้าหลัก',
        en: 'Back to home',
        cn: '返回首页',
    },
    'store.notFound': {
        th: 'ไม่พบข้อมูลร้านค้า',
        en: 'Store not found',
        cn: '未找到该店铺',
    },
    'store.tendedBy': {
        th: 'ดูแลโดย',
        en: 'Tended by',
        cn: '由',
    },
    'store.reviews': {
        th: 'รีวิว',
        en: 'reviews',
        cn: '评价',
    },
    'store.pickupAt': {
        th: 'จุดรับสินค้า',
        en: 'Pickup at',
        cn: '取货点',
    },
    'store.todayAt': {
        th: 'วันนี้ที่ {name}',
        en: 'Today at {name}',
        cn: '今日在 {name}',
    },
    'store.preparing': {
        th: 'ร้านนี้กำลังเตรียมผลผลิต',
        en: 'This farm is preparing the next harvest',
        cn: '该农场正在准备下一批产品',
    },
    'store.preparingDesc': {
        th: 'ฤดูกาลถัดไปจะมาอัปเดตสินค้าเพิ่มเติม โปรดติดตาม',
        en: 'New products coming next season — stay tuned',
        cn: '下个季节将上新商品，敬请期待',
    },

    // Seller — gate / title
    'seller.loginPrompt': {
        th: 'ผู้ขายโปรดเข้าสู่ระบบ',
        en: 'Sellers, please sign in',
        cn: '卖家请先登录',
    },
    'seller.loginDesc': {
        th: 'เชื่อมต่อบัญชีเพื่อจัดการร้านค้า ออเดอร์ และสินค้าของคุณ',
        en: 'Sign in to manage your store, orders, and products',
        cn: '登录以管理您的店铺、订单和商品',
    },
    'seller.title': {
        th: 'ระบบจัดการร้านค้า — {name}',
        en: 'Store Workshop — {name}',
        cn: '店铺管理 — {name}',
    },
    'seller.workshop': {
        th: 'ระบบจัดการร้านค้า',
        en: 'Store Workshop',
        cn: '店铺管理',
    },
    'seller.openToday': {
        th: 'เปิดรับออเดอร์วันนี้',
        en: 'Open today',
        cn: '今日开放',
    },
    'seller.tab.dashboard': { th: '📊 ภาพรวม', en: '📊 Overview', cn: '📊 概览' },
    'seller.tab.orders': { th: '📦 ออเดอร์', en: '📦 Orders', cn: '📦 订单' },
    'seller.tab.products': { th: '🍎 สินค้า', en: '🍎 Products', cn: '🍎 商品' },
    'seller.tab.add': { th: '➕ เพิ่มสินค้า', en: '➕ Add product', cn: '➕ 添加商品' },
    'seller.tab.settings': { th: '⚙️ ตั้งค่าร้าน', en: '⚙️ Store settings', cn: '⚙️ 店铺设置' },

    // Seller — stats
    'seller.stat.orders': { th: 'ออเดอร์ทั้งหมด', en: 'Total orders', cn: '订单总数' },
    'seller.stat.revenue': { th: 'ยอดขายรวม', en: 'Total revenue', cn: '总销售额' },
    'seller.stat.products': { th: 'สินค้าในร้าน', en: 'Products in store', cn: '在售商品' },
    'seller.stat.rating': { th: 'คะแนนเฉลี่ย', en: 'Average rating', cn: '平均评分' },
    'seller.stat.fromReviews': { th: 'จาก {n} รีวิว', en: 'from {n} reviews', cn: '基于 {n} 条评价' },

    // Seller — orders table
    'seller.recentOrders': { th: 'ออเดอร์ล่าสุด', en: 'Recent orders', cn: '最近订单' },
    'seller.noOrders': { th: 'ยังไม่มีออเดอร์ในขณะนี้', en: 'No orders yet', cn: '暂无订单' },
    'seller.noOrdersFull': {
        th: 'ยังไม่มีออเดอร์',
        en: 'No orders yet — your first order will appear here',
        cn: '暂无订单 — 第一个订单将出现在这里',
    },
    'seller.col.orderNo': { th: 'เลขที่สั่งซื้อ', en: 'Order #', cn: '订单号' },
    'seller.col.buyer': { th: 'ผู้ซื้อ', en: 'Buyer', cn: '买家' },
    'seller.col.items': { th: 'รายการสินค้า', en: 'Items', cn: '商品' },
    'seller.col.note': { th: 'หมายเหตุ', en: 'Note', cn: '备注' },
    'seller.col.total': { th: 'ยอดสุทธิ', en: 'Total', cn: '总价' },
    'seller.col.status': { th: 'สถานะ', en: 'Status', cn: '状态' },
    'seller.col.date': { th: 'วันที่', en: 'Date', cn: '日期' },
    'seller.searchOrder': {
        th: 'ค้นหาเลขออเดอร์ หรือชื่อลูกค้า...',
        en: 'Search order # or customer...',
        cn: '搜索订单号或客户...',
    },
    'seller.filterStatus': { th: 'กรองสถานะ', en: 'Filter status', cn: '筛选状态' },

    // Seller — order status
    'seller.status.pending': { th: 'รอยืนยัน', en: 'Pending', cn: '待确认' },
    'seller.status.confirmed': { th: 'ยืนยันแล้ว', en: 'Confirmed', cn: '已确认' },
    'seller.status.shipped': { th: 'จัดส่งแล้ว', en: 'Shipped', cn: '已发货' },
    'seller.status.done': { th: 'เสร็จสิ้น', en: 'Done', cn: '完成' },

    // Seller — products tab
    'seller.noProducts': {
        th: 'ยังไม่มีสินค้าในร้าน กดปุ่ม "เพิ่มสินค้า" เพื่อเริ่มขาย',
        en: 'No products yet — click “Add product” to start selling',
        cn: '暂无商品 — 点击「添加商品」开始销售',
    },

    // Seller — add product form
    'seller.add.title': { th: 'เพิ่มสินค้าใหม่', en: 'Add a new product', cn: '添加新商品' },
    'seller.form.name': { th: 'ชื่อสินค้า *', en: 'Product name *', cn: '商品名称 *' },
    'seller.form.namePh': {
        th: 'เช่น ส้มสายน้ำผึ้ง เกรด A, ทุเรียนหมอนทอง จันทบุรี',
        en: 'e.g. Honey-sweet oranges Grade A, Monthong durian from Chanthaburi',
        cn: '例如：A 级蜜柑、尖竹汶金枕榴莲',
    },
    'seller.form.desc': { th: 'คำอธิบาย', en: 'Description', cn: '描述' },
    'seller.form.descPh': {
        th: 'บรรยายลักษณะสินค้า รสชาติ แหล่งปลูก วิธีการเก็บรักษา...',
        en: 'Describe taste, origin, storage tips...',
        cn: '描述口感、产地、储存方式...',
    },
    'seller.form.category': { th: 'หมวดหมู่ผลไม้ *', en: 'Fruit category *', cn: '水果类别 *' },
    'seller.form.categoryPh': { th: 'เลือกหมวดหมู่', en: 'Select a category', cn: '选择类别' },
    'seller.form.others': { th: 'อื่นๆ', en: 'Others', cn: '其他' },
    'seller.form.images': { th: 'รูปภาพสินค้า', en: 'Product images', cn: '商品图片' },
    'seller.form.imagesHint': {
        th: 'อัปโหลดได้สูงสุด 5 รูป (รูปแบบ JPG, PNG)',
        en: 'Up to 5 images (JPG, PNG)',
        cn: '最多 5 张 (JPG / PNG)',
    },
    'seller.form.imagesUpload': {
        th: 'คลิกเพื่อเลือกไฟล์รูปภาพ',
        en: 'Click to choose images',
        cn: '点击选择图片',
    },
    'seller.form.imagesMock': {
        th: 'MOCK: จะใช้รูปตัวอย่างรวมผลไม้',
        en: 'MOCK: a sample collage will be used',
        cn: '模拟：将使用示例图片',
    },
    'seller.form.units': { th: 'ตัวเลือกขนาด / หน่วยการขาย / ราคา *', en: 'Sizes / units / prices *', cn: '规格 / 单位 / 价格 *' },
    'seller.form.unitCol': {
        th: 'หน่วย/ขนาด',
        en: 'Unit / Size',
        cn: '单位 / 规格',
    },
    'seller.form.unitColHint': {
        th: '(เช่น กิโลกรัม, ลัง 10 กก.)',
        en: '(e.g. kg, crate of 10 kg)',
        cn: '（例如：千克、10公斤箱）',
    },
    'seller.form.priceCol': { th: 'ราคา (บาท)', en: 'Price (THB)', cn: '价格 (泰铢)' },
    'seller.form.unitPh': {
        th: 'เช่น กิโลกรัม, ลัง, แพ็ค',
        en: 'e.g. kg, crate, pack',
        cn: '例如：千克、箱、包',
    },
    'seller.form.addUnit': {
        th: '+ เพิ่มตัวเลือกหน่วยการขาย',
        en: '+ Add a unit option',
        cn: '+ 添加单位选项',
    },
    'seller.save': { th: 'บันทึกสินค้า', en: 'Save product', cn: '保存商品' },
    'seller.cancel': { th: 'ยกเลิก', en: 'Cancel', cn: '取消' },
    'seller.requiredAlert': {
        th: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อ, หมวดหมู่, หน่วยการขาย)',
        en: 'Please fill in name, category, and at least one unit',
        cn: '请填写名称、类别和至少一个单位',
    },
    'seller.preview.title': { th: 'ตัวอย่างหน้าร้าน', en: 'Live preview', cn: '实时预览' },
    'seller.preview.hint': {
        th: 'ลูกค้าจะเห็นสินค้าของคุณแบบนี้',
        en: 'How buyers will see your card',
        cn: '买家将看到的样子',
    },
    'seller.preview.placeholderName': { th: 'ชื่อสินค้าของคุณ', en: 'Your product name', cn: '您的商品名称' },
    'seller.preview.placeholderDesc': {
        th: 'คำอธิบายสินค้าจะปรากฏที่นี่',
        en: 'Your description appears here',
        cn: '商品描述将显示在此',
    },

    // Seller — settings
    'seller.settings.title': { th: 'ตั้งค่าร้านค้า', en: 'Store settings', cn: '店铺设置' },
    'seller.settings.changePhoto': { th: 'เปลี่ยนรูปโปรไฟล์ร้าน', en: 'Change store photo', cn: '更换店铺照片' },
    'seller.settings.name': { th: 'ชื่อร้านค้า', en: 'Store name', cn: '店铺名称' },
    'seller.settings.owner': { th: 'ชื่อเจ้าของ / ผู้ดูแล', en: 'Owner / Caretaker', cn: '店主 / 看护人' },
    'seller.settings.phone': { th: 'เบอร์โทรศัพท์ติดต่อ', en: 'Contact phone', cn: '联系电话' },
    'seller.settings.desc': { th: 'รายละเอียด / คำอธิบายร้าน', en: 'Store description', cn: '店铺描述' },
    'seller.settings.address': { th: 'ที่อยู่ฟาร์ม / ร้านค้า', en: 'Farm / store address', cn: '农场 / 店铺地址' },
    'seller.settings.pickup': { th: 'จุดรับสินค้า / เวลาทำการ', en: 'Pickup point / hours', cn: '取货点 / 营业时间' },
    'seller.settings.pickupHint': {
        th: 'ข้อมูลนี้จะแสดงให้ลูกค้าเห็นเพื่อประกอบการตัดสินใจนัดรับสินค้า',
        en: 'Shown to buyers when planning pickup',
        cn: '将展示给买家以便安排取货',
    },
    'seller.settings.save': { th: 'บันทึกการตั้งค่า', en: 'Save settings', cn: '保存设置' },
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
