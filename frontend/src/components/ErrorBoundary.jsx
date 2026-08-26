import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('UI Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[rgb(var(--color-bg))] flex flex-col items-center justify-center p-6 text-center">
                    <div className="glass-card max-w-md p-8 border border-border space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold text-2xl">
                            !
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-text">Something went wrong</h2>
                        <p className="text-sm text-text-muted">
                            {this.state.error?.message || 'An unexpected rendering issue occurred.'}
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.href = '/';
                            }}
                            className="glass-button-primary w-full py-3"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
