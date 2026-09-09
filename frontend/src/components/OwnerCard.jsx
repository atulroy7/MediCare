import { motion } from 'framer-motion';
import { ownerProfile } from '../data/products';
import Icon from './Icons';

export default function OwnerCard({ compact = false }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`overflow-hidden rounded-[32px] border border-border bg-surface shadow-sm ${compact ? 'p-5' : 'p-6'}`}
        >
            <div className={`flex ${compact ? 'items-center gap-4' : 'flex-col gap-5'} `}>
                <img
                    src="/images/owner.jpg"
                    alt="Madan Mohan Mishra - Proprietor, MediCare"
                    className={`rounded-full object-cover ${compact ? 'h-24 w-24' : 'h-44 w-44'}`}
                    loading="lazy"
                />
                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Owner</p>
                        <h3 className="mt-2 font-display text-3xl font-bold text-text">{ownerProfile.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-text opacity-90">{ownerProfile.title}</p>
                    </div>
                    <p className="text-sm leading-6 text-text opacity-85">{ownerProfile.quote}</p>
                    {!compact ? <p className="text-sm leading-6 text-text opacity-85">{ownerProfile.bio}</p> : null}
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <Icon name="Sparkles" className="h-4 w-4" />
                        Serving your family's health for over {ownerProfile.years} years
                    </div>
                </div>
            </div>
        </motion.div>
    );
}