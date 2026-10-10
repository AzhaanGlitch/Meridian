import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-[#F1F5F9] flex flex-col items-center justify-center overflow-hidden p-6 select-none">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        {/* Large Website Name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#0F172A] rounded-3xl flex items-center justify-center text-white shadow-xl">
            <Layers className="w-9 h-9 text-[#22D3EE]" />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-[#0F172A] tracking-tighter">
            Meridian
          </h1>
        </div>

        {/* Small Button leading to dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95 group cursor-pointer"
        >
          <span>Open App</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default Landing;
