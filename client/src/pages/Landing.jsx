import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  // Custom image paths inside client/public/
  const bgImagePath = '/landing-bg.jpg';
  const linkedinIconPath = '/linkedin.svg';
  const githubIconPath = '/github.svg';
  const mailIconPath = '/mail.svg';

  return (
    <div 
      className="h-screen w-screen relative flex flex-col items-center justify-between overflow-hidden p-8 select-none bg-cover bg-center bg-no-repeat bg-[#0F172A]"
      style={{ backgroundImage: `url('${bgImagePath}')` }}
    >
      {/* Spacer for center vertical alignment */}
      <div className="w-full flex-1" />

      {/* Hero Content: White Title & Glassmorphism Button */}
      <div className="flex flex-col items-center justify-center space-y-6 text-center z-10">
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter drop-shadow-md">
          Meridian
        </h1>

        {/* Glassmorphism Action Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="px-7 py-3 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl flex items-center gap-2.5 backdrop-blur-md border border-white/30 shadow-xl transition-all active:scale-95 group cursor-pointer"
        >
          <span>Open App</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Bottom Social Icon Bar */}
      <div className="w-full flex-1 flex flex-col justify-end items-center">
        <div className="flex items-center gap-6 z-10 py-2">
          {/* LinkedIn Link */}
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-105"
            title="LinkedIn"
          >
            <img 
              src={linkedinIconPath} 
              alt="LinkedIn" 
              className="w-4 h-4 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerText = 'in';
              }}
            />
          </a>

          {/* GitHub Link */}
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-105 font-bold text-xs"
            title="GitHub"
          >
            <img 
              src={githubIconPath} 
              alt="GitHub" 
              className="w-4 h-4 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerText = 'GH';
              }}
            />
          </a>

          {/* Mail Link */}
          <a 
            href="mailto:contact@meridian.app" 
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-105 font-bold text-xs"
            title="Email"
          >
            <img 
              src={mailIconPath} 
              alt="Mail" 
              className="w-4 h-4 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerText = '@';
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
