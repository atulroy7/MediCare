import Icon from './Icons';

export default function HowItWorks({ steps }) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            {steps.map((step, index) => (
                <div key={step.title} className="relative rounded-[28px] border border-brand-100 bg-white p-6 shadow-soft">
                    <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-600">
                            <Icon name={step.iconKey} className="h-5 w-5" />
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                            0{index + 1}
                        </div>
                    </div>
                    <h3 className="mt-6 font-display text-2xl text-slate-900">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
                    {index < steps.length - 1 ? (
                        <div className="absolute right-4 top-1/2 hidden h-px w-16 bg-brand-100 xl:block" />
                    ) : null}
                </div>
            ))}
        </div>
    );
}