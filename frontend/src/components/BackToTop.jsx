import { useEffect, useState } from 'react';
import Icon from './Icons';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 500);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="glass-icon-button fixed bottom-24 right-8 z-40 h-12 w-12"
            aria-label="Back to top"
        >
            <Icon name="ArrowUp" className="h-5 w-5" />
        </button>
    );
}