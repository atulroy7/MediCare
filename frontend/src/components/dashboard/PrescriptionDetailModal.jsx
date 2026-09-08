import { useState } from 'react';
import Icon from '../Icons';

export default function PrescriptionDetailModal({ selectedRx, onClose, onApprove, onReject, onSaveSuggestion, agentSuggestions, setAgentSuggestions, isAgent }) {
    const [fullImageZoom, setFullImageZoom] = useState(false);

    if (!selectedRx) return null;

    const hasFile = selectedRx.photoUrl && selectedRx.photoUrl.startsWith('data:');
    const isPdf = hasFile && selectedRx.photoUrl.startsWith('data:application/pdf');
    const hasImage = hasFile && !isPdf;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                <div className="bg-surface border border-border rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold font-mono tracking-wider text-secondary uppercase bg-secondary/10 px-2.5 py-0.5 rounded-full border border-secondary/15">
                                    Prescription Audit File #{selectedRx.id}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                    selectedRx.status === 'APPROVED' 
                                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                                        : selectedRx.status === 'FULFILLED'
                                        ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                        : selectedRx.status === 'REJECTED' 
                                        ? 'bg-red-500/10 text-red-600 border border-red-500/20' 
                                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                }`}>
                                    {selectedRx.status ? selectedRx.status.replace('_', ' ') : 'PENDING'}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold font-serif text-text mt-1">
                                {selectedRx.patient || selectedRx.userName || 'Patient Prescription'}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-xl text-text-muted hover:bg-bg hover:text-text transition-all"
                        >
                            <Icon name="X" className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Document Preview Box */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-extrabold uppercase text-text-muted tracking-wider flex items-center justify-between">
                                <span>Uploaded Rx Document</span>
                                <span className="text-[11px] text-primary font-mono">{selectedRx.filename || 'prescription.jpg'}</span>
                            </h4>

                            <div className="rounded-2xl bg-bg border border-border p-3 flex flex-col items-center justify-center text-center overflow-hidden min-h-[280px] relative group">
                                {hasImage ? (
                                    <div className="w-full space-y-3">
                                        <div className="relative overflow-hidden rounded-xl border border-border bg-black/5 dark:bg-white/5 cursor-pointer" onClick={() => setFullImageZoom(true)}>
                                            <img
                                                src={selectedRx.photoUrl}
                                                alt={`Prescription ${selectedRx.id}`}
                                                className="max-h-72 w-full object-contain mx-auto rounded-xl transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5">
                                                <Icon name="ZoomIn" className="w-5 h-5" />
                                                Click to Enlarge
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFullImageZoom(true)}
                                            className="w-full py-2 px-4 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/15 transition-all flex items-center justify-center gap-1.5 border border-primary/15"
                                        >
                                            <Icon name="Maximize2" className="w-4 h-4" />
                                            View Full Screen Image
                                        </button>
                                    </div>
                                ) : isPdf ? (
                                    <div className="w-full space-y-3">
                                        <iframe
                                            src={selectedRx.photoUrl}
                                            title="Prescription PDF"
                                            className="w-full rounded-xl border border-border"
                                            style={{ minHeight: '260px', height: '260px' }}
                                        />
                                        <a
                                            href={selectedRx.photoUrl}
                                            download={selectedRx.filename || 'prescription.pdf'}
                                            className="w-full py-2 px-4 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/15 transition-all flex items-center justify-center gap-1.5 border border-primary/15"
                                        >
                                            <Icon name="Download" className="w-4 h-4" />
                                            Download PDF
                                        </a>
                                    </div>
                                ) : (
                                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                            <Icon name="AlertTriangle" className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="font-mono text-xs font-bold text-text truncate max-w-[240px] mx-auto">
                                                {selectedRx.filename || 'prescription_document.pdf'}
                                            </p>
                                            <p className="text-[11px] text-amber-600 mt-1 font-semibold">File preview not available</p>
                                            <p className="text-[10px] text-text-muted mt-0.5">Uploaded: {selectedRx.date || 'Recent'}</p>
                                        </div>
                                        <div className="p-3 bg-surface rounded-xl border border-border text-left w-full space-y-1">
                                            <p className="text-[10px] font-bold text-text-muted uppercase">Medicines Summary</p>
                                            <p className="text-xs font-mono text-primary font-semibold truncate">{selectedRx.medicinesSummary || 'General Prescription'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Prescription Details & Pharmacist Advice Column */}
                        <div className="space-y-4">
                            {/* Patient & Doctor Metadata */}
                            <div className="bg-bg border border-border rounded-2xl p-4 space-y-2 text-xs">
                                <div className="flex justify-between border-b border-border/50 pb-2">
                                    <span className="text-text-muted font-bold">Patient Name:</span>
                                    <span className="font-semibold text-text">{selectedRx.patient || 'Patient'}</span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 pb-2">
                                    <span className="text-text-muted font-bold">Phone Number:</span>
                                    <span className="font-mono text-text">{selectedRx.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 pb-2">
                                    <span className="text-text-muted font-bold">User Account Email:</span>
                                    <span className="font-mono text-text truncate max-w-[180px]">{selectedRx.userEmail || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-text-muted font-bold">Upload Date:</span>
                                    <span className="text-text">{selectedRx.date || 'Today'}</span>
                                </div>
                            </div>

                            {/* Medicines Under Doctor Verification */}
                            <div className="bg-primary/8 border border-primary/15 rounded-2xl p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-extrabold uppercase text-primary tracking-wider flex items-center gap-1.5">
                                        <Icon name="Stethoscope" className="w-4 h-4" />
                                        Medicines Under Doctor Verification
                                    </h4>
                                    <span className="text-[10px] font-bold font-mono bg-primary/15 text-primary px-2.5 py-0.5 rounded-full">
                                        Clinical Verification
                                    </span>
                                </div>
                                <div className="bg-surface p-3 rounded-xl border border-border font-mono text-xs text-text font-bold leading-relaxed">
                                    {selectedRx.medicinesSummary || 'General Medical Prescription'}
                                </div>
                                <p className="text-[11px] text-text-muted leading-relaxed">
                                    Cross-check the uploaded prescription file against the requested medicines above before approving order placement.
                                </p>
                            </div>

                            {/* Customer Notes */}
                            <div className="bg-bg border border-border rounded-2xl p-4 space-y-1">
                                <h4 className="text-xs font-extrabold uppercase text-text-muted tracking-wider">Patient / Doctor Notes</h4>
                                <p className="text-xs text-text leading-relaxed font-mono">
                                    {selectedRx.notes || 'No extra notes provided.'}
                                </p>
                            </div>

                            {/* Pharmacist Advice Section */}
                            {isAgent ? (
                                <div className="space-y-3 pt-1">
                                    <label className="block text-xs font-bold uppercase text-text-muted tracking-wider">
                                        Pharmacist Clinical Advice
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={agentSuggestions[selectedRx.id] ?? (selectedRx.agentSuggestion || '')}
                                        onChange={(e) => setAgentSuggestions({ ...agentSuggestions, [selectedRx.id]: e.target.value })}
                                        placeholder="Type specific dosage instructions or clinical advice for this customer..."
                                        className="w-full text-xs p-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all resize-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onSaveSuggestion(selectedRx.id)}
                                        className="w-full py-2.5 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Icon name="Save" className="w-4 h-4" />
                                        Save Pharmacist Advice
                                    </button>
                                </div>
                            ) : (
                                selectedRx.agentSuggestion && (
                                    <div className="bg-secondary/8 border border-secondary/15 rounded-2xl p-4 space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                                            <Icon name="Stethoscope" className="w-4 h-4" />
                                            Licensed Pharmacist Clinical Advice:
                                        </div>
                                        <p className="text-xs text-text italic leading-relaxed">{selectedRx.agentSuggestion}</p>
                                    </div>
                                )
                            )}

                            {/* Agent Approve / Reject Actions */}
                            {isAgent && (
                                <div className="pt-3 border-t border-border flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { onApprove(selectedRx.id); onClose(); }}
                                        className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <Icon name="CheckCircle" className="w-4 h-4" />
                                        Approve Prescription
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { onReject(selectedRx.id); onClose(); }}
                                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <Icon name="XCircle" className="w-4 h-4" />
                                        Reject Prescription
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Image Modal */}
            {fullImageZoom && selectedRx.photoUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in" onClick={() => setFullImageZoom(false)}>
                    <div className="relative max-w-5xl max-h-[95vh] w-full flex flex-col items-center justify-center space-y-4" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={() => setFullImageZoom(false)}
                            className="absolute top-2 right-2 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all z-10"
                        >
                            <Icon name="X" className="w-6 h-6" />
                        </button>
                        <img
                            src={selectedRx.photoUrl}
                            alt="Full Prescription"
                            className="max-h-[85vh] w-full object-contain rounded-2xl border border-white/20 shadow-2xl bg-black"
                        />
                        <p className="text-white text-xs font-mono">{selectedRx.filename || 'Full Screen Prescription Document'}</p>
                    </div>
                </div>
            )}
        </>
    );
}
