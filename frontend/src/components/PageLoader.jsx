export default function PageLoader() {
    return (
        <div className="min-h-[60vh] bg-hero-gradient px-4 py-24">
            <div className="mx-auto flex max-w-5xl animate-pulse flex-col gap-6">
                <div className="h-5 w-40 rounded-full bg-brand-100" />
                <div className="h-16 w-full rounded-3xl bg-white shadow-soft" />
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="h-48 rounded-3xl bg-white shadow-soft" />
                    <div className="h-48 rounded-3xl bg-white shadow-soft" />
                    <div className="h-48 rounded-3xl bg-white shadow-soft" />
                </div>
            </div>
        </div>
    );
}