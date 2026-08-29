import React, { useState } from 'react';
import { EMERGENCY_CONTACTS } from '../data/mockData';
import { AlertOctagon, Phone, MapPin, ShieldAlert, HeartPulse, Flame, PhoneCall, X } from 'lucide-react';

export default function EmergencySOS({ onTriggerRoute }) {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'Medical': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Security': return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'Fire': return <Flame className="w-5 h-5 text-orange-600" />;
      default: return <PhoneCall className="w-5 h-5 text-[var(--olive-primary)]" />;
    }
  };

  return (
    <>
      {/* Floating Persistent SOS Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[8.5rem] right-4 md:bottom-28 md:right-6 z-40 bg-[var(--olive-primary)] hover:bg-[var(--olive-hover)] text-[#FFFFFF] font-extrabold px-4 py-3 rounded-full shadow-md flex items-center space-x-2 border-2 border-transparent transition duration-300"
        title="Emergency Campus SOS"
      >
        <AlertOctagon className="w-5 h-5 animate-pulse" />
        <span className="text-xs tracking-wider uppercase">SOS Emergency</span>
      </button>

      {/* Emergency SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#1D1D1B]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="premium-card glow-effect rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-editorial space-y-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 shadow-sm">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[var(--text-primary)]">Campus Emergency SOS Connect</h3>
                <p className="text-xs text-[var(--text-secondary)]">IFET 24x7 Rapid Security & Medical Response</p>
              </div>
            </div>

            {/* Emergency Contacts List */}
            <div className="space-y-3">
              {EMERGENCY_CONTACTS.map((contact, idx) => (
                <div
                  key={idx}
                  className="premium-card glow-effect border border-[var(--border-color)] rounded-2xl p-4 flex items-center justify-between hover:bg-[var(--bg-secondary)] hover:border-[var(--border-color)] transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 premium-card glow-effect rounded-xl shadow-sm">
                      {getIcon(contact.icon)}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-[var(--text-primary)]">{contact.name}</div>
                      <div className="text-xs text-[var(--text-secondary)] flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 text-[var(--olive-primary)] mr-1" />
                        <span>{contact.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onTriggerRoute({
                          buildingId: contact.buildingId,
                          title: `Emergency Route to ${contact.name}`
                        });
                      }}
                      className="p-2.5 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--olive-primary)] rounded-xl shadow-sm transition-all"
                      title="Show 3D Location"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>

                    <a
                      href={`tel:${contact.phone}`}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1 shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-600 font-medium shadow-sm">
              In case of severe medical or fire emergencies, security officers are dispatched automatically upon tapping Call.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
