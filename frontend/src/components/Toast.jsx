import { Toaster } from 'react-hot-toast';

export default function AppToaster() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                duration: 1000, // 1 sec max
                style: {
                    borderRadius: '16px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    background: 'var(--color-surface, #0c0c0f)',
                    color: 'var(--color-text, #ffffff)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '12px',
                    fontWeight: '600'
                },
                success: {
                    duration: 1000,
                    iconTheme: {
                        primary: '#38bdf8',
                        secondary: '#ffffff',
                    },
                },
                error: {
                    duration: 2500,
                }
            }}
        />
    );
}