import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';

export default function LoginModal({ onClose }) {
    const { login } = useApp();
    const { t } = useLang();

    const handleLineLogin = () => {
        login();
        onClose();
    };

    return (
        <div className="overlay" onClick={(e) => {
            if (e.target.classList.contains('overlay')) onClose();
        }}>
            <div className="modal" style={{ maxWidth: 460 }}>
                <button className="btn-close" style={{ color: "var(--text)", background: "var(--border)" }} onClick={onClose}>✕</button>

                <div className="login-modal">
                    <div className="login-logo">🛒</div>
                    <h2 className="login-title">{t('login.title')}</h2>
                    <p className="login-sub">{t('login.desc')}</p>

                    <button className="btn-line" onClick={handleLineLogin}>
                        <MessageCircle size={22} /> {t('login.lineBtn')}
                    </button>

                    <p className="login-note">{t('login.note')}</p>
                </div>
            </div>
        </div>
    );
}
