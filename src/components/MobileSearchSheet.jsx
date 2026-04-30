import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function MobileSearchSheet({ initialQuery, onSearch, onClose }) {
    const { t } = useLang();
    const [value, setValue] = useState(initialQuery || '');
    const inputRef = useRef(null);

    // Autofocus the field on open and restore body scroll on close.
    useEffect(() => {
        const t = setTimeout(() => inputRef.current?.focus(), 50);
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            clearTimeout(t);
            document.body.style.overflow = original;
        };
    }, []);

    // Close on Escape.
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(value);
        onClose();
    };

    return (
        <div className="search-sheet" role="dialog" aria-modal="true" aria-label={t('search.placeholder')}>
            <form className="search-sheet-bar" onSubmit={handleSubmit}>
                <Search size={18} className="search-sheet-icon" />
                <input
                    ref={inputRef}
                    type="search"
                    inputMode="search"
                    enterKeyHint="search"
                    autoComplete="off"
                    className="search-sheet-input"
                    placeholder={t('search.placeholder')}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                {value && (
                    <button
                        type="button"
                        className="search-sheet-clear"
                        onClick={() => { setValue(''); inputRef.current?.focus(); }}
                        aria-label="clear"
                    >
                        <X size={16} />
                    </button>
                )}
                <button type="button" className="search-sheet-cancel" onClick={onClose}>
                    {t('search.btn')}
                </button>
            </form>
        </div>
    );
}
