import Icon from './Icons';

export default function TrustBadges({ badges }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {badges.map((badge) => (
                <div key={badge.title} className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-4 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon name={badge.iconKey} className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold text-text">{badge.title}</p>
                </div>
            ))}
        </div>
    );
}