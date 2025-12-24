
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onGoHome: () => void;
  onGoCreator: () => void;
  activeTab: 'home' | 'creator';
}

export const Layout: React.FC<LayoutProps> = ({ children, onGoHome, onGoCreator, activeTab }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between shadow-sm border border-slate-200/50">
            <button onClick={onGoHome} className="flex items-center space-x-3 group outline-none">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                P
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">PersonaPix</span>
            </button>
            
            <nav className="hidden md:flex items-center space-x-10 text-[13px] font-bold uppercase tracking-widest text-slate-500">
              <button onClick={onGoHome} className={`${activeTab === 'home' ? 'text-indigo-600' : 'hover:text-slate-900'} transition-colors`}>Home</button>
              <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
              <a href="#showcase" className="hover:text-slate-900 transition-colors">Showcase</a>
              <button 
                onClick={onGoCreator}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95"
              >
                Create Now
              </button>
            </nav>
            
            <button onClick={onGoCreator} className="md:hidden p-2 text-slate-900">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
                <span className="text-xl font-black text-slate-900">PersonaPix</span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed text-sm">
                Next-generation professional identity platform powered by generative AI. Create cinema-quality branded profile assets for the digital era.
              </p>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-widest">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><button onClick={onGoHome} className="hover:text-indigo-600 transition">Home</button></li>
                <li><button onClick={onGoCreator} className="hover:text-indigo-600 transition">Generator</button></li>
                <li><a href="#features" className="hover:text-indigo-600 transition">Features</a></li>
                <li><a href="#showcase" className="hover:text-indigo-600 transition">Showcase</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Cookie Policy</a></li>
              </ul>
            </div>

            <div className="flex flex-col items-start space-y-4">
              <h4 className="text-slate-900 font-bold mb-2 text-sm uppercase tracking-widest">Connect</h4>
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2.01-.83-2.01-1.88 0-1.07.82-1.88 2.05-1.88 1.25 0 2.01.81 2.03 1.88 0 1.05-.78 1.88-2.04 1.88zM21.1 20.1h-3.62v-5.84c0-1.47-.53-2.47-1.85-2.47-1.01 0-1.61.68-1.87 1.34-.1.23-.12.56-.12.89v6.08h-3.62V9.24h3.62v1.54c.48-.74 1.34-1.8 3.27-1.8 2.39 0 4.18 1.56 4.18 4.91v6.21z"/></svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} PersonaPix. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
               <span>Powered by Gemini 3.1</span>
               <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
               <span>Built for Professionals</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
