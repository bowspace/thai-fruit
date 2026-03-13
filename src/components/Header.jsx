import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Store, User, LogOut, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';

const LANGS = [
    { code: 'th', label: '🇹🇭 ไทย' },
    { code: 'en', label: '🇬🇧 EN' },
    { code: 'cn', label: '🇨🇳 中文' },
];

export default function Header({
    onNavigateHome,
    onNavigateCart,
    onNavigateSeller,
    onSearch,
    searchQuery,
    onLoginClick
}) {
    const { user, cart, logout } = useApp();
    const { lang, switchLang, t } = useLang();
    const [searchInput, setSearchInput] = useState(searchQuery || '');
    const [scrolled, setScrolled] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);

    useEffect(() => {
        setSearchInput(searchQuery || '');
    }, [searchQuery]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchInput);
        if (!searchQuery && searchInput) {
            onNavigateHome();
            setTimeout(() => onSearch(searchInput), 0);
        }
    };

    const cartCount = cart.reduce((total, item) => total + item.qty, 0);

    return (
        <header className="header" style={{ boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.15)' : 'none' }}>
            <div className="header-inner">
                <a href="#" className="logo" onClick={(e) => { e.preventDefault(); onNavigateHome(); }}>
                    <span className="logo-icon">🧺</span>
                    <span className="logo-text">Thai<span>Fruit</span></span>
                </a>

                <form className="search-bar" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder={t('search.placeholder')}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <Search size={16} /> <span className="hide-mobile">{t('search.btn')}</span>
                    </button>
                </form>

                <div className="header-actions">
                    {/* Language Switcher */}
                    <div className="lang-switcher" style={{ position: 'relative' }}>
                        <button
                            className="btn-header"
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            title="Language"
                        >
                            <Globe size={16} />
                            <span className="hide-mobile">{LANGS.find(l => l.code === lang)?.label}</span>
                        </button>
                        {showLangMenu && (
                            <div className="lang-menu">
                                {LANGS.map(l => (
                                    <button
                                        key={l.code}
                                        className={`lang-option ${lang === l.code ? 'active' : ''}`}
                                        onClick={() => {
                                            switchLang(l.code);
                                            setShowLangMenu(false);
                                        }}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="btn-header" onClick={onNavigateSeller}>
                        <Store size={16} /> <span className="hide-mobile">{t('nav.seller')}</span>
                    </button>

                    <button className="btn-header btn-cart" onClick={onNavigateCart}>
                        <ShoppingCart size={16} /> <span className="hide-mobile">{t('nav.cart')}</span>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>

                    {user ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                            <div className="btn-header" style={{ pointerEvents: 'none' }}>
                                <span style={{ fontSize: 16 }}>🧑</span> <span className="hide-mobile">{user.name.split(' ')[0]}</span>
                            </div>
                            <button className="btn-header" onClick={logout} title={t('nav.logout')} style={{ padding: '9px 12px' }}>
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button className="btn-header" onClick={onLoginClick}>
                            <User size={16} /> <span className="hide-mobile">{t('nav.login')}</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
