import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ msg, type = 'success' }) {
    const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
    const bgColor = type === 'success' ? 'var(--primary)' : '#ef4444';

    return (
        <div className="toast" style={{ background: bgColor }}>
            <Icon size={18} color="white" />
            <span>{msg}</span>
        </div>
    );
}
