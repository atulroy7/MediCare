import { motion } from 'framer-motion';
import { ownerProfile } from '../data/products';
import Icon from './Icons';

export default function OwnerCard({ compact = false }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`overflow-hidden rounded-[32px] border border-brand-100 bg-white shadow-soft ${compact ? 'p-5' : 'p-6'}`}
        >
            <div className={`flex ${compact ? 'items-center gap-4' : 'flex-col gap-5'} `}>
                <img
                    src="/images/owner.jpg"
                    alt="Madan Mohan Mishra - Proprietor, Jaya Medical Store"
                    className={`rounded-full object-cover ${compact ? 'h-24 w-24' : 'h-44 w-44'}`}
                    loading="lazy"
                />
                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">Owner</p>
                        <h3 className="mt-2 font-display text-3xl text-slate-900">{ownerProfile.name}</h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">{ownerProfile.title}</p>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{ownerProfile.quote}</p>
                    {!compact ? <p className="text-sm leading-6 text-slate-600">{ownerProfile.bio}</p> : null}
                    <div className="flex items-center gap-2 text-sm text-brand-700">
                        <Icon name="Sparkles" className="h-4 w-4" />
                        Serving your family's health for over {ownerProfile.years} years
                    </div>
                </div>
            </div>
        </motion.div>
    );
}