import Icon from './Icons';

export default function HowItWorks({ steps }) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            {steps.map((step, index) => (
                <div key={step.title} className="relative rounded-[28px] border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                            <Icon name={step.iconKey} className="h-5 w-5" />
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            0{index + 1}
                        </div>
                    </div>
                    <h3 className="mt-6 font-display text-2xl font-bold text-text">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-text opacity-85">{step.text}</p>
                    {index < steps.length - 1 ? (
                        <div className="absolute right-4 top-1/2 hidden h-px w-16 bg-border xl:block" />
                    ) : null}
                </div>
            ))}
        </div>
    );
}