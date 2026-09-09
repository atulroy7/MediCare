import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import Icon from '../components/Icons';

export default function NotFound() {
    return (
        <>
            <Seo title="Page not found" description="The requested page could not be found." />
            <section className="page-shell section-pad">
                <Reveal className="glass-card mx-auto grid max-w-4xl gap-8 overflow-hidden p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div className="space-y-5">
                        <p className="kicker">404</p>
                        <h1 className="display-heading text-4xl sm:text-5xl">This page is unavailable</h1>
                        <p className="text-sm leading-7 text-text opacity-90">
                            The page you were looking for does not exist. Return to the home page to continue browsing the store.
                        </p>
                        <Link
                            to="/"
                            className="glass-button-primary"
                        >
                            Go home
                            <Icon name="ArrowRight" className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="relative rounded-[32px] bg-black p-10 text-white border border-border">
                        <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-primary/20" />
                        <div className="absolute right-10 top-16 h-14 w-14 rounded-full bg-secondary/20" />
                        <div className="relative flex h-full min-h-[320px] items-center justify-center rounded-[28px] border border-white/10 bg-white/5">
                            <div className="text-center">
                                <Icon name="PackageSearch" className="mx-auto h-14 w-14 text-white" />
                                <p className="mt-5 font-display text-4xl font-bold text-white">Page not found</p>
                                <p className="mt-3 text-sm leading-6 text-white opacity-90">Try the home page or browse products instead.</p>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </section>
        </>
    );
}