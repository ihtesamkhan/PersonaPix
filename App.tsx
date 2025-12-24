
import React, { useState, useCallback, useRef } from 'react';
import { Layout } from './components/Layout';
import { RoleItem } from './components/RoleItem';
import { UserRole, AppState } from './types';
import { generateProfessionalAvatar, editImageWithPrompt } from './services/geminiService';

const PRESET_ROLES = [
  "Senior Web Developer",
  "Freelance Consultant",
  "Product Designer",
  "Operations Manager",
  "Machine Learning Engineer",
  "Brand Specialist",
  "Startup Founder",
  "Growth Marketer"
];

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'generator'>('landing');
  const [state, setState] = useState<AppState>({
    name: '',
    roles: [],
    userImage: null,
    generatedImage: null,
    isProcessing: false,
    statusMessage: '',
    error: null
  });

  const [editPrompt, setEditPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, userImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRole = (role: string) => {
    if (state.roles.length >= 3) return; // Limit to 3 roles for better design on image
    if (state.roles.find(r => r.label === role)) return;
    
    const newRole: UserRole = {
      id: Math.random().toString(36).substr(2, 9),
      label: role
    };
    setState(prev => ({ ...prev, roles: [...prev.roles, newRole] }));
  };

  const clearRoles = () => setState(prev => ({ ...prev, roles: [] }));
  const removeRole = (id: string) => setState(prev => ({ ...prev, roles: prev.roles.filter(r => r.id !== id) }));
  
  const moveRole = (index: number, direction: 'up' | 'down') => {
    const newRoles = [...state.roles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newRoles.length) return;
    [newRoles[index], newRoles[targetIndex]] = [newRoles[targetIndex], newRoles[index]];
    setState(prev => ({ ...prev, roles: newRoles }));
  };

  const generateAvatar = async () => {
    if (state.roles.length === 0 || !state.name.trim()) {
      setState(prev => ({ ...prev, error: "Please complete your name and select a professional role." }));
      return;
    }
    setState(prev => ({ ...prev, isProcessing: true, error: null, statusMessage: "Rendering Professional Identity..." }));
    try {
      const result = await generateProfessionalAvatar(state.name, state.roles.map(r => r.label), state.userImage);
      setState(prev => ({ ...prev, generatedImage: result, isProcessing: false, statusMessage: "" }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isProcessing: false, error: "Branding engine encounterted a delay. Please try again." }));
    }
  };

  const applyEdit = async () => {
    if (!state.generatedImage || !editPrompt) return;
    setState(prev => ({ ...prev, isProcessing: true, statusMessage: "Applying Brand Refinements..." }));
    try {
      const result = await editImageWithPrompt(state.generatedImage, editPrompt);
      setState(prev => ({ ...prev, generatedImage: result, isProcessing: false, statusMessage: "" }));
      setEditPrompt('');
    } catch (err: any) {
      setState(prev => ({ ...prev, isProcessing: false, error: "Adjustment failed. Please simplify the request." }));
    }
  };

  const downloadImage = () => {
    if (!state.generatedImage) return;
    const link = document.createElement('a');
    link.href = state.generatedImage;
    link.download = `${state.name.replace(/\s+/g, '_')}_profile_pix.png`;
    link.click();
  };

  if (view === 'landing') {
    return (
      <Layout onGoHome={() => setView('landing')} onGoCreator={() => setView('generator')} activeTab="home">
        {/* Hero */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 w-3/4 h-full bg-indigo-50/30 rounded-full blur-[160px] transform translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center lg:text-left flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-10 fade-in">
              <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">New: Version 3.1 Released</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight">
                Branding <br />
                <span className="gradient-text italic">Meets Vision.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-500 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Elevate your professional digital presence with cinema-grade AI portraits, custom typography, and minimalist name logos.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                <button 
                  onClick={() => setView('generator')}
                  className="w-full sm:w-auto px-12 py-6 gradient-bg text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 hover:scale-105 transition-all active:scale-95 text-lg"
                >
                  Start Branding Now
                </button>
                <a href="#showcase" className="text-slate-900 font-extrabold flex items-center group">
                  See Real Examples
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </a>
              </div>
            </div>

            <div className="flex-1 relative fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="mockup-glow"></div>
              <div className="relative z-10 p-4 glass-card rounded-[3rem] shadow-2xl premium-shadow">
                <div className="rounded-[2rem] overflow-hidden aspect-square bg-slate-900 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                     <div className="w-24 h-24 rounded-full bg-indigo-500/20 backdrop-blur border border-white/30 flex items-center justify-center text-4xl mb-6">👤</div>
                     <span className="text-3xl font-black tracking-tight">Alexander Vance</span>
                     <span className="text-xs uppercase tracking-[0.3em] opacity-60 mt-2 font-bold">Principal Engineer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Icons */}
        <section id="features" className="py-20 bg-white">
           <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: 'LinkedIn Header', icon: '👤', color: 'bg-blue-50' },
                { label: 'AI Logo Design', icon: '✨', color: 'bg-indigo-50' },
                { label: 'Ultra High-Res', icon: '🖼️', color: 'bg-purple-50' },
                { label: 'Studio Lighting', icon: '💡', color: 'bg-amber-50' }
              ].map((item, i) => (
                <div key={i} className="group flex flex-col items-center space-y-4 p-8 rounded-3xl transition-all duration-300 hover:bg-slate-50 cursor-default">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:-translate-y-2 group-hover:rotate-6`}>{item.icon}</div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">{item.label}</span>
                </div>
              ))}
           </div>
        </section>

        {/* Showcase Section */}
        <section id="showcase" className="py-40 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="max-w-3xl mb-24 space-y-6">
              <span className="text-indigo-600 font-black uppercase tracking-widest text-xs">Excellence by Design</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">The Showcase.</h2>
              <p className="text-xl text-slate-500 font-medium">Behold the intersection of portraiture and typography. Every image is a bespoke branding kit in a single frame.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { name: "Julian Gray", roles: ["CTO", "Founder"], color: "bg-indigo-600" },
                { name: "Maya Sterling", roles: ["Creative Director"], color: "bg-rose-500" },
                { name: "Liam Thorne", roles: ["UX Engineer"], color: "bg-slate-800" },
                { name: "Sophia Chen", roles: ["Brand Strategist"], color: "bg-amber-600" },
                { name: "Marcus Brooks", roles: ["Growth Lead"], color: "bg-blue-700" },
                { name: "Elena Rossi", roles: ["Architect"], color: "bg-emerald-700" }
              ].map((item, i) => (
                <div key={i} className="group relative rounded-[2.5rem] overflow-hidden bg-white premium-shadow transition-all duration-500 hover:-translate-y-4">
                  <div className={`aspect-[4/5] ${item.color} flex items-center justify-center relative`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-overlay">
                       <span className="text-[12rem] font-black">{item.name[0]}</span>
                    </div>
                    {/* Branded elements mockup */}
                    <div className="absolute bottom-10 left-10 right-10 flex flex-col items-start text-white">
                       <span className="text-xs font-black uppercase tracking-[0.4em] text-indigo-300 mb-2">PersonaPix Elite</span>
                       <h3 className="text-3xl font-black tracking-tight">{item.name}</h3>
                       <div className="flex flex-wrap gap-2 mt-4">
                         {item.roles.map((r, ri) => (
                           <span key={ri} className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">{r}</span>
                         ))}
                       </div>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 p-4 glass-card rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 15.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM16.464 16.464a1 1 0 10-1.414-1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" /></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-10 blur-[150px]"></div>
          <div className="max-w-4xl mx-auto px-4 text-center space-y-12 relative z-10">
            <h2 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter">Your brand <br /> is waiting.</h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium">Join 20,000+ top-tier professionals scaling their visual impact.</p>
            <div className="pt-4">
              <button 
                onClick={() => setView('generator')}
                className="px-16 py-8 bg-white text-slate-900 font-black rounded-3xl shadow-2xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 text-2xl"
              >
                Create My Identity
              </button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout onGoHome={() => setView('landing')} onGoCreator={() => setView('generator')} activeTab="creator">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-center space-x-3 mb-12 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] fade-in">
           <button onClick={() => setView('landing')} className="hover:text-indigo-600 transition-colors">Home</button>
           <span className="opacity-30">/</span>
           <span className="text-slate-900">Branding Tool</span>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Controls */}
          <div className="space-y-16 fade-in">
            <section className="space-y-10">
              <div className="flex items-center space-x-6">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-xl shadow-indigo-100">1</div>
                 <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Branding</h2>
                   <p className="text-slate-500 font-medium">Input your name and upload a reference portrait.</p>
                 </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Professional Display Name</label>
                  <input 
                    type="text"
                    value={state.name}
                    onChange={(e) => setState(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Julian Gray"
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:ring-0 transition-all outline-none bg-white font-bold text-lg text-slate-900 placeholder:text-slate-200"
                  />
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50/20 transition-all duration-500 bg-white shadow-sm"
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  {state.userImage ? (
                    <div className="relative inline-block animate-in zoom-in-90 duration-500">
                      <img src={state.userImage} alt="Reference" className="h-40 w-40 rounded-[2rem] object-cover mx-auto ring-[10px] ring-indigo-50 shadow-2xl" />
                      <div className="absolute inset-0 bg-slate-900/60 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <span className="text-white text-[10px] font-black uppercase tracking-widest">Swap Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto text-slate-300 group-hover:text-indigo-600 group-hover:bg-white transition-all shadow-inner">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      </div>
                      <div>
                        <p className="text-slate-900 font-black text-lg">Select Reference Photo</p>
                        <p className="text-sm text-slate-400 font-medium mt-1">AI uses this to maintain facial features</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                   <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-xl shadow-purple-100">2</div>
                   <div>
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight">Professional Expertise</h2>
                     <p className="text-slate-500 font-medium">Select up to 3 professional roles.</p>
                   </div>
                </div>
                {state.roles.length > 0 && <button onClick={clearRoles} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors">Reset</button>}
              </div>

              <div className="space-y-8">
                <div className="flex flex-wrap gap-2">
                  {PRESET_ROLES.map(role => (
                    <button
                      key={role}
                      onClick={() => handleAddRole(role)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-wider hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <div className="bg-slate-50 p-6 rounded-[2.5rem] min-h-[160px] border border-slate-100 relative shadow-inner">
                  {state.roles.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 text-slate-400 space-y-3">
                       <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                       <p className="text-xs font-black uppercase tracking-widest text-center">Your roles will appear here<br/>Order matters for priority</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {state.roles.map((role, idx) => (
                        <RoleItem 
                          key={role.id}
                          label={role.label}
                          onRemove={() => removeRole(role.id)}
                          onMoveUp={() => moveRole(idx, 'up')}
                          onMoveDown={() => moveRole(idx, 'down')}
                          isFirst={idx === 0}
                          isLast={idx === state.roles.length - 1}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <button
              onClick={generateAvatar}
              disabled={state.isProcessing || state.roles.length === 0 || !state.name}
              className={`w-full py-7 px-8 rounded-3xl font-black text-white shadow-2xl flex items-center justify-center space-x-4 transition-all transform active:scale-95 ${
                state.isProcessing || state.roles.length === 0 || !state.name
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'gradient-bg hover:opacity-95 hover:shadow-indigo-200'
              }`}
            >
              {state.isProcessing ? (
                <div className="flex items-center space-x-4 animate-in fade-in">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-xl">Processing...</span>
                </div>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                  <span className="text-xl">Generate Branded Identity</span>
                </>
              )}
            </button>
            
            {state.error && (
              <div className="text-red-600 text-xs font-black uppercase tracking-[0.2em] text-center bg-red-50 p-6 rounded-2xl border border-red-100 fade-in">
                {state.error}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="relative sticky top-32 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className={`group relative bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-[12px] border-white aspect-[4/5] flex items-center justify-center transition-all duration-700 premium-shadow ${state.isProcessing ? 'shimmer-bg' : ''}`}>
              {state.isProcessing && (
                <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                  <div className="w-24 h-24 border-6 border-indigo-600 border-t-transparent rounded-full animate-spin mb-10"></div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-none">{state.statusMessage}</h3>
                  <div className="flex items-center space-x-3 bg-white/90 px-6 py-3 rounded-2xl shadow-xl border border-slate-100">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-slate-700 font-black text-[10px] uppercase tracking-[0.3em]">AI Synthesis Active</p>
                  </div>
                </div>
              )}
              
              {state.generatedImage ? (
                <div className="w-full h-full relative animate-in fade-in zoom-in-95 duration-700">
                  <img src={state.generatedImage} alt="Identity Result" className="w-full h-full object-cover" />
                  <div className="absolute top-8 left-8 flex space-x-3">
                     <div className="bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-white/20">
                       <p className="text-white text-[9px] font-black uppercase tracking-[0.3em]">Signature 4K Asset</p>
                     </div>
                  </div>
                  <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-6 group-hover:translate-y-0 flex space-x-4">
                     <button 
                      onClick={downloadImage}
                      className="p-6 bg-white backdrop-blur rounded-3xl text-indigo-600 shadow-2xl hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                      title="Download 4K Image"
                    >
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                  </div>
                </div>
              ) : !state.isProcessing && (
                <div className="text-center p-16 space-y-8 animate-in fade-in duration-700">
                  <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-inner relative overflow-hidden group-hover:shadow-indigo-100 transition-all duration-500">
                    <svg className="h-14 w-14 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-black text-slate-900 text-3xl tracking-tight leading-none">Your Identity Hub</h3>
                    <p className="text-slate-500 text-lg max-w-[320px] mx-auto leading-relaxed font-medium">
                      Complete the branding profile to reveal your <span className="text-indigo-600 font-black">custom persona asset</span>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {state.generatedImage && !state.isProcessing && (
              <div className="mt-12 space-y-8 fade-in animate-in slide-in-from-bottom-6">
                <div className="relative">
                  <input 
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Refine your brand: 'Add classic glasses' or 'Darker studio background'..."
                    className="w-full px-8 py-6 pr-24 rounded-[2rem] border-2 border-slate-100 focus:border-indigo-600 outline-none shadow-sm transition-all font-bold text-slate-700 text-lg bg-white"
                    onKeyDown={(e) => e.key === 'Enter' && applyEdit()}
                  />
                  <button
                    onClick={applyEdit}
                    disabled={!editPrompt || state.isProcessing}
                    className="absolute right-3 top-3 bottom-3 px-6 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-200 transition-all"
                  >
                    Adjust
                  </button>
                </div>
                <div className="flex flex-wrap gap-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 justify-center">
                  <button onClick={() => setEditPrompt("Minimalist professional headshot")} className="hover:text-indigo-600 transition-colors">Minimalist</button>
                  <button onClick={() => setEditPrompt("Cinematic studio background with warm lights")} className="hover:text-indigo-600 transition-colors">Warm Studio</button>
                  <button onClick={() => setEditPrompt("Modern tech workspace background")} className="hover:text-indigo-600 transition-colors">Workspace</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
