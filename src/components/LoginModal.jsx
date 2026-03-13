import { useState } from 'react';
import { MessageCircle, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';

export default function LoginModal({ onClose }) {
    const { login, signup } = useApp();
    const { t } = useLang();
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let success;
        if (mode === 'login') {
            success = await login(email, password);
        } else {
            success = await signup(email, password, name);
        }
        setLoading(false);
        if (success) onClose();
    };

    // Quick login with test account
    const handleTestLogin = async () => {
        setLoading(true);
        const success = await login('buyer@test.com', 'password123');
        setLoading(false);
        if (success) onClose();
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

                    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {mode === 'signup' && (
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder={t('login.name') || 'ชื่อ'}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 12, border: '1px solid var(--border)', fontSize: 15, boxSizing: 'border-box' }}
                                />
                            </div>
                        )}

                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="email"
                                placeholder={t('login.email') || 'อีเมล'}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 12, border: '1px solid var(--border)', fontSize: 15, boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder={t('login.password') || 'รหัสผ่าน'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                                style={{ width: '100%', padding: '12px 40px 12px 40px', borderRadius: 12, border: '1px solid var(--border)', fontSize: 15, boxSizing: 'border-box' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-line"
                            style={{ marginTop: 4 }}
                        >
                            <MessageCircle size={22} />
                            {loading
                                ? '...'
                                : mode === 'login'
                                    ? (t('login.loginBtn') || 'เข้าสู่ระบบ')
                                    : (t('login.signupBtn') || 'สมัครสมาชิก')
                            }
                        </button>
                    </form>

                    <button
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 14, marginTop: 8 }}
                    >
                        {mode === 'login'
                            ? (t('login.switchSignup') || 'ยังไม่มีบัญชี? สมัครสมาชิก')
                            : (t('login.switchLogin') || 'มีบัญชีแล้ว? เข้าสู่ระบบ')
                        }
                    </button>

                    <div style={{ width: '100%', borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
                        <button
                            onClick={handleTestLogin}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '10px 16px', borderRadius: 12,
                                border: '1px solid var(--border)', background: 'var(--bg-secondary)',
                                cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)'
                            }}
                        >
                            🧪 {t('login.testLogin') || 'ทดลองใช้งาน (บัญชีทดสอบ)'}
                        </button>
                    </div>

                    <p className="login-note">{t('login.note')}</p>
                </div>
            </div>
        </div>
    );
}
