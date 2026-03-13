import { useState, useRef } from 'react';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Seller from './pages/Seller';
import StoreDetail from './pages/StoreDetail';
import ProductDetail from './pages/ProductDetail';
import { useApp } from './context/AppContext';
import { useLang } from './context/LangContext';

export default function App() {
  const [page, setPage] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const previousPage = useRef('home');

  const { toast } = useApp();
  const { t } = useLang();

  const handleNavigateHome = () => {
    setPage('home');
    setSearchQuery('');
    setCategoryFilter('all');
    setSelectedStore(null);
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  const handleNavigateCart = () => {
    setPage('cart');
    window.scrollTo(0, 0);
  };

  const handleNavigateSeller = () => {
    setPage('seller');
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product, store) => {
    previousPage.current = page;
    setSelectedProduct({ product, store });
    setPage('product_detail');
    window.scrollTo(0, 0);
  };

  const handleProductBack = () => {
    const prev = previousPage.current;
    setPage(prev);
    if (prev === 'home') {
      setSelectedProduct(null);
    }
    window.scrollTo(0, 0);
  };

  const handleStoreClick = (store) => {
    previousPage.current = page;
    setSelectedStore(store);
    setPage('store_detail');
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      <Header
        onNavigateHome={handleNavigateHome}
        onNavigateCart={handleNavigateCart}
        onNavigateSeller={handleNavigateSeller}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onLoginClick={() => setShowLogin(true)}
      />

      <main className="main">
        {page === 'home' && (
          <Home
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            onProductClick={handleProductClick}
            onStoreClick={handleStoreClick}
          />
        )}
        {page === 'cart' && <Cart onLoginClick={() => setShowLogin(true)} />}
        {page === 'seller' && <Seller onLoginClick={() => setShowLogin(true)} />}
        {page === 'store_detail' && (
          <StoreDetail
            store={selectedStore}
            onProductClick={handleProductClick}
            onBack={handleNavigateHome}
          />
        )}
        {page === 'product_detail' && selectedProduct && (
          <ProductDetail
            key={selectedProduct.product.id}
            product={selectedProduct.product}
            store={selectedProduct.store}
            onBack={handleProductBack}
            onProductClick={handleProductClick}
            onStoreClick={handleStoreClick}
            onLoginClick={() => setShowLogin(true)}
          />
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>🧺 Thai<span>Fruit</span></h3>
            <p>{t('footer.desc')}</p>
          </div>
          <div className="footer-section">
            <h4>{t('footer.about')}</h4>
            <ul>
              <li>{t('footer.aboutUs')}</li>
              <li>{t('footer.howToOrder')}</li>
              <li>{t('footer.shipping')}</li>
              <li>{t('footer.privacy')}</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.forSellers')}</h4>
            <ul>
              <li>{t('footer.openStore')}</li>
              <li>{t('footer.guide')}</li>
              <li>{t('footer.support')}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} {t('footer.copyright')}. All rights reserved.
        </div>
      </footer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
