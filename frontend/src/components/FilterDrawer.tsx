import React from 'react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Dimmed Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Filter Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center animate-slide-up">
        <div className="glass-glow bg-white/70 backdrop-blur-2xl w-full max-w-2xl rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] px-6 pb-24 pt-4 border-t border-white/30">
          
          {/* Gold Handle */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-1.5 bg-[#D4AF37]/40 rounded-full"></div>
          </div>

          {/* Header */}
          <header className="mb-10 text-center">
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary-container">Refine Your Pulse</h1>
            <p className="font-body text-on-surface-variant text-sm mt-1 font-medium opacity-70">Tailor your academic connections</p>
          </header>

          {/* Filter Sections */}
          <div className="space-y-10 overflow-y-auto max-h-[60vh] hide-scrollbar pb-10">
            {/* Major Selection */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                <label className="font-headline font-bold text-sm tracking-wide text-on-surface uppercase">Academic Major</label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-5 py-2.5 rounded-full liquid-gradient text-white text-sm font-semibold shadow-lg shadow-primary-container/20">Computer Science</button>
                <button className="px-5 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant text-sm font-medium hover:bg-white transition-colors">Business Admin</button>
                <button className="px-5 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant text-sm font-medium hover:bg-white transition-colors">Digital Arts</button>
                <button className="px-5 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant text-sm font-medium hover:bg-white transition-colors">Biotechnology</button>
                <button className="px-5 py-2.5 rounded-full bg-secondary-container/20 border border-secondary/30 text-secondary text-sm font-semibold">Global Affairs</button>
              </div>
            </section>

            {/* Course Search */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary-container text-xl">menu_book</span>
                <label className="font-headline font-bold text-sm tracking-wide text-on-surface uppercase">Specific Course</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant/50">search</span>
                </div>
                <input 
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-container/20 transition-all font-body text-on-surface placeholder:text-on-surface-variant/40 outline-none" 
                  placeholder="Search course codes or names..." 
                />
              </div>
              <div className="mt-3 flex gap-2">
                <span className="px-3 py-1 bg-white/50 backdrop-blur-md rounded-lg text-xs font-semibold text-primary-container border border-primary-container/10">#CS101</span>
                <span className="px-3 py-1 bg-white/50 backdrop-blur-md rounded-lg text-xs font-semibold text-primary-container border border-primary-container/10">#ECON202</span>
              </div>
            </section>

            {/* Minimum GPA Slider */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-xl">military_tech</span>
                  <label className="font-headline font-bold text-sm tracking-wide text-on-surface uppercase">Minimum GPA</label>
                </div>
                <span className="font-headline font-extrabold text-primary-container text-xl tracking-tighter">3.50+</span>
              </div>
              <div className="relative py-4">
                <input 
                  type="range" 
                  min="0" max="4.5" step="0.1" defaultValue="3.5"
                  className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-secondary" 
                />
                <div className="flex justify-between mt-2 px-1 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                  <span>0.0</span>
                  <span>2.0</span>
                  <span>4.0</span>
                  <span>4.5</span>
                </div>
              </div>
            </section>

            {/* Apply Button */}
            <div className="pt-4">
              <button 
                className="w-full liquid-gradient text-white py-5 rounded-2xl font-headline font-bold text-lg crimson-pulse-glow active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                onClick={onClose}
              >
                Apply Filters
                <span className="material-symbols-outlined text-xl">done_all</span>
              </button>
              <button className="w-full mt-4 text-slate-500 font-label text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors py-2">
                Reset all selections
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
