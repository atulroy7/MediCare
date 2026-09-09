import Icon from '../Icons';

// Comprehensive list of prescription-only drugs matching products.js and Indian Schedule H / H1 regulations
export const RX_RESTRICTED_DRUGS = [
    { name: 'Augmentin 625 Duo', keyword: 'augmentin', schedule: 'Schedule H1 (Broad-spectrum Antibiotic)' },
    { name: 'Amoxicillin 500mg', keyword: 'amoxicillin', schedule: 'Schedule H (Antibiotic)' },
    { name: 'Azithral 500', keyword: 'azithral', schedule: 'Schedule H1 (Macrolide Antibiotic)' },
    { name: 'Azithromycin', keyword: 'azithromycin', schedule: 'Schedule H1 (Antibiotic)' },
    { name: 'Tramadol 50mg', keyword: 'tramadol', schedule: 'Schedule H1 (Controlled Opioid Analgesic)' },
    { name: 'Betnesol 0.5mg', keyword: 'betnesol', schedule: 'Schedule H (Corticosteroid / Steroid)' },
    { name: 'Betamethasone', keyword: 'betamethasone', schedule: 'Schedule H (Corticosteroid)' },
    { name: 'Thyronorm 50mcg', keyword: 'thyronorm', schedule: 'Schedule H (Thyroid Hormone)' },
    { name: 'Levothyroxine', keyword: 'levothyroxine', schedule: 'Schedule H (Endocrine Therapy)' },
    { name: 'Amlopin 5mg', keyword: 'amlopin', schedule: 'Schedule H (Calcium Channel Blocker)' },
    { name: 'Amlodipine', keyword: 'amlodipine', schedule: 'Schedule H (Antihypertensive)' },
    { name: 'Pantocid 40', keyword: 'pantocid', schedule: 'Schedule H (Proton Pump Inhibitor)' },
    { name: 'Pantoprazole', keyword: 'pantoprazole', schedule: 'Schedule H (Gastro-resistant PPI)' },
    { name: 'Metformin SR 500', keyword: 'metformin', schedule: 'Schedule H (Antidiabetic)' },
    { name: 'Cetzine 10', keyword: 'cetzine', schedule: 'Schedule H (Potent Antihistamine)' },
    { name: 'Cetirizine', keyword: 'cetirizine', schedule: 'Schedule H (Antihistamine)' },
    { name: 'Voveran Emulgel', keyword: 'voveran', schedule: 'Schedule H1 (Topical NSAID)' },
    { name: 'Diclofenac', keyword: 'diclofenac', schedule: 'Schedule H1 (NSAID)' },
];

export function analyzeRxRequirements(prescription) {
    if (!prescription) return { requiresVerification: false, detectedDrugs: [] };
    const text = [
        prescription.medicinesSummary || '',
        prescription.notes || '',
        prescription.doctor || '',
    ].join(' ').toLowerCase();

    const matched = RX_RESTRICTED_DRUGS.filter(d => text.includes(d.keyword));
    const requiresVerification = matched.length > 0 || prescription.requiresVerification === true;
    return {
        requiresVerification,
        detectedDrugs: matched,
    };
}

export default function AgentDashboard({
    user,
    agentQueue,
    agentFilter,
    setAgentFilter,
    selectedRx,
    setSelectedRx,
    agentSuggestions,
    setAgentSuggestions,
    handleApprovePrescription,
    handleRejectPrescription,
    handleSaveSuggestion,
    activeTab = 'overview',
}) {
    const filteredQueue = agentQueue.filter(item => {
        if (agentFilter === 'ALL') return true;
        if (agentFilter === 'STRICT_RX') return analyzeRxRequirements(item).requiresVerification;
        return item.status === agentFilter;
    });

    const pendingStrictRxCount = agentQueue.filter(
        q => analyzeRxRequirements(q).requiresVerification && q.status === 'PENDING_VERIFICATION'
    ).length;

    // Stats overview for agent
    const StatsGrid = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Agent Credentials</span>
                    <div className="p-1.5 rounded-lg bg-secondary/10">
                        <Icon name="ShieldCheck" className="w-4 h-4 text-secondary" />
                    </div>
                </div>
                <p className="font-mono font-bold text-sm text-secondary">{user.agentCode || 'AG-8849'}</p>
                <p className="text-[11px] text-text-muted">Lic: <span className="font-mono font-semibold text-text">{user.licenseNumber || 'MH-PHARM-2024-9918'}</span></p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Total Prescriptions</span>
                    <div className="p-1.5 rounded-lg bg-primary/10">
                        <Icon name="FileText" className="w-4 h-4 text-primary" />
                    </div>
                </div>
                <p className="font-serif font-bold text-2xl text-text">{agentQueue.length}</p>
                <p className="text-[11px] text-emerald-600 font-medium">All Incoming Queue</p>
            </div>

            <div className="bg-surface border border-red-500/30 bg-red-500/5 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-red-600 dark:text-red-400 font-bold">
                    <span>Strict Rx Cases</span>
                    <div className="p-1.5 rounded-lg bg-red-500/10">
                        <Icon name="ShieldAlert" className="w-4 h-4 text-red-600" />
                    </div>
                </div>
                <p className="font-serif font-bold text-2xl text-red-600 dark:text-red-400">
                    {pendingStrictRxCount}
                </p>
                <p className="text-[11px] text-red-700 dark:text-red-300 font-medium">Schedule H/H1 Priority</p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 shadow-y-1 space-y-1">
                <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Approved Clearances</span>
                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                        <Icon name="CheckCircle" className="w-4 h-4 text-emerald-500" />
                    </div>
                </div>
                <p className="font-serif font-bold text-2xl text-emerald-600">
                    {agentQueue.filter(q => q.status === 'APPROVED').length}
                </p>
                <p className="text-[11px] text-text-muted">Orders Cleared for Dispatch</p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Awaiting Review</span>
                    <div className="p-1.5 rounded-lg bg-amber-500/10">
                        <Icon name="Clock" className="w-4 h-4 text-amber-500" />
                    </div>
                </div>
                <p className="font-serif font-bold text-2xl text-amber-600">
                    {agentQueue.filter(q => q.status === 'PENDING_VERIFICATION').length}
                </p>
                <p className="text-[11px] text-text-muted">Requires Pharmacist Review</p>
            </div>
        </div>
    );

    // Review queue section
    const ReviewSection = () => (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h2 className="text-lg font-bold font-serif text-text flex items-center gap-2">
                        <Icon name="Stethoscope" className="w-5 h-5 text-secondary" />
                        Clinical Review & Suggestion Workstation
                    </h2>
                    <p className="text-xs text-text-muted mt-1">
                        Review uploaded customer medical prescriptions, verify dosage, attach advisory notes, and approve for fulfillment.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center p-1 bg-bg rounded-xl border border-border text-xs overflow-x-auto gap-1">
                    {[
                        { key: 'ALL', label: 'ALL' },
                        { key: 'STRICT_RX', label: '⚠️ STRICT RX ONLY' },
                        { key: 'PENDING_VERIFICATION', label: 'PENDING' },
                        { key: 'APPROVED', label: 'APPROVED' },
                        { key: 'FULFILLED', label: 'FULFILLED' },
                        { key: 'REJECTED', label: 'REJECTED' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setAgentFilter(key)}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-[11px] uppercase tracking-wider whitespace-nowrap ${
                                agentFilter === key
                                    ? key === 'STRICT_RX'
                                        ? 'bg-red-600 text-white shadow-sm'
                                        : 'bg-primary text-white shadow-sm'
                                    : key === 'STRICT_RX'
                                        ? 'text-red-600 dark:text-red-400 hover:bg-red-500/10'
                                        : 'text-text-muted hover:text-text'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Prescriptions List */}
            {filteredQueue.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                    <Icon name="CheckCircle" className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-text">No Prescriptions Match Filter</h4>
                    <p className="text-xs text-text-muted mt-1">
                        All pending prescriptions for filter &quot;{agentFilter}&quot; have been addressed.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredQueue.map((item) => {
                        const { requiresVerification, detectedDrugs } = analyzeRxRequirements(item);
                        return (
                        <div
                            key={item.id}
                            className={`border rounded-2xl p-5 transition-all space-y-4 shadow-sm ${
                                requiresVerification
                                    ? 'bg-bg border-red-500/30 hover:border-red-500/50'
                                    : 'bg-bg border-border hover:border-primary/30'
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-secondary">{item.id}</span>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                                item.status === 'APPROVED'
                                                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                    : item.status === 'FULFILLED'
                                                    ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                                    : item.status === 'REJECTED'
                                                    ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                                                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                            }`}
                                        >
                                            {item.status ? item.status.replace('_', ' ') : 'PENDING'}
                                        </span>
                                        {requiresVerification ? (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1 shadow-sm">
                                                <Icon name="ShieldAlert" className="w-3 h-3 text-red-600" />
                                                Strict Rx Verification Required (Schedule H/H1)
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/25 flex items-center gap-1">
                                                <Icon name="CheckCircle" className="w-3 h-3" />
                                                Standard / OTC Consultation
                                            </span>
                                        )}
                                        <span className="text-xs text-text-muted">• Uploaded {item.date}</span>
                                    </div>
                                    <h3 className="font-bold text-text text-base">
                                        Patient: {item.patient || item.userEmail}
                                    </h3>
                                    <p className="text-xs text-text-muted">
                                        Doctor Ref: <span className="font-medium text-text">{item.doctor || 'General Physician'}</span>
                                    </p>
                                    {(item.medicinesSummary || item.notes) && (
                                        <p className="text-xs text-text-muted mt-1 bg-surface rounded-lg px-2.5 py-1.5 border border-border">
                                            <span className="font-semibold text-text">Medicines: </span>
                                            {item.medicinesSummary || item.notes}
                                        </p>
                                    )}
                                    {requiresVerification && detectedDrugs.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider">
                                                Restricted Drugs Detected:
                                            </span>
                                            {detectedDrugs.map((d, i) => (
                                                <span key={i} className="text-[10px] font-mono font-bold bg-red-500/15 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-md border border-red-500/25">
                                                    {d.name} ({d.schedule})
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRx(item)}
                                        className="px-3.5 py-2 rounded-xl bg-surface border border-border text-text font-bold text-xs hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Icon name="Eye" className="w-4 h-4" />
                                        Audit File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleApprovePrescription(item.id)}
                                        disabled={item.status === 'APPROVED'}
                                        className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                                            item.status === 'APPROVED'
                                                ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 cursor-default'
                                                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                                        }`}
                                    >
                                        <Icon name="CheckCircle" className="w-4 h-4" />
                                        {item.status === 'APPROVED' ? 'Approved ✓' : 'Approve'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRejectPrescription(item.id)}
                                        disabled={item.status === 'REJECTED'}
                                        className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                                            item.status === 'REJECTED'
                                                ? 'bg-red-500/15 text-red-600 border border-red-500/20 cursor-default'
                                                : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                                        }`}
                                    >
                                        <Icon name="XCircle" className="w-4 h-4" />
                                        {item.status === 'REJECTED' ? 'Rejected ✗' : 'Reject'}
                                    </button>
                                </div>
                            </div>

                            {/* Pharmacist Advice Input Section */}
                            <div className="pt-3 border-t border-border/60 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                <div className="md:col-span-9 space-y-1">
                                    <label className="text-[11px] font-extrabold uppercase text-text-muted tracking-wider flex items-center gap-1">
                                        <Icon name="MessageSquare" className="w-3.5 h-3.5 text-secondary" />
                                        Attach Advisory / Clinical Suggestion for Patient
                                    </label>
                                    <input
                                        type="text"
                                        value={agentSuggestions[item.id] ?? (item.agentSuggestion || '')}
                                        onChange={(e) => setAgentSuggestions({ ...agentSuggestions, [item.id]: e.target.value })}
                                        placeholder="e.g. Take 1 tablet daily after food. Drink plenty of water."
                                        className="w-full text-xs px-3.5 py-2 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <button
                                        type="button"
                                        onClick={() => handleSaveSuggestion(item.id)}
                                        className="w-full py-2 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <Icon name="Send" className="w-3.5 h-3.5" />
                                        Save Advisory
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {activeTab === 'overview' && (
                <>
                    <StatsGrid />
                    <ReviewSection />
                </>
            )}
            {activeTab === 'review' && <ReviewSection />}
        </div>
    );
}
