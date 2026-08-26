import Icon from './Icons';

export default function TrustBadges({ badges }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {badges.map((badge) => (
                <div key={badge.title} className="flex items-center gap-4 rounded-3xl border border-brand-100 bg-white p-4 shadow-soft">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                        <Icon name={badge.iconKey} className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{badge.title}</p>
                </div>
            ))}
        </div>
    );
}