import Icon from '../Icons';

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
        return item.status === agentFilter;
    });

    // Stats overview for agent
    const StatsGrid = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-[11px] text-emerald-600 font-medium">Active Clinical Workstation</p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
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
                <div className="flex items-center p-1 bg-bg rounded-xl border border-border text-xs overflow-x-auto">
                    {['ALL', 'PENDING_VERIFICATION', 'APPROVED', 'FULFILLED', 'REJECTED'].map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setAgentFilter(filter)}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-[11px] uppercase tracking-wider whitespace-nowrap ${
                                agentFilter === filter
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-text-muted hover:text-text'
                            }`}
                        >
                            {filter === 'PENDING_VERIFICATION' ? 'PENDING' : filter}
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
                    {filteredQueue.map((item) => (
                        <div
                            key={item.id}
                            className="bg-bg border border-border hover:border-primary/30 rounded-2xl p-5 transition-all space-y-4 shadow-sm"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
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
                                        <span className="text-xs text-text-muted">• Uploaded {item.date}</span>
                                    </div>
                                    <h3 className="font-bold text-text text-base">
                                        Patient: {item.patient || item.userEmail}
                                    </h3>
                                    <p className="text-xs text-text-muted">
                                        Doctor Ref: <span className="font-medium text-text">{item.doctor || 'General Physician'}</span>
                                    </p>
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
                    ))}
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
