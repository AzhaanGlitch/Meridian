import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  // You can replace these paths with your custom image paths inside client/public/
  const bgImagePath = '/landing-bg.jpg';
  const linkedinIconPath = '/linkedin.svg';
  const githubIconPath = '/github.svg';
  const mailIconPath = '/mail.svg';

  return (
    <div 
      className="h-screen w-screen relative flex flex-col items-center justify-between overflow-hidden p-8 select-none bg-cover bg-center bg-no-repeat bg-[#F1F5F9]"
      style={{ backgroundImage: `url('${bgImagePath}')` }}
    >
      {/* Spacer to keep center alignment vertically */}
      <div className="w-full flex-1" />

      {/* Hero Content: Website Title (Logo Removed) & Open App Button */}
      <div className="flex flex-col items-center justify-center space-y-6 text-center z-10">
        <h1 className="text-6xl md:text-8xl font-extrabold text-[#0F172A] tracking-tighter drop-shadow-sm">
          Meridian
        </h1>

        <button
          onClick={() => navigate('/dashboard')}
          className="px-7 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl flex items-center gap-2.5 shadow-lg transition-all active:scale-95 group cursor-pointer"
        >
          <span>Open App</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Bottom Spacer & Social Icon Bar */}
      <div className="w-full flex-1 flex flex-col justify-end items-center">
        <div className="flex items-center gap-6 z-10 py-2">
          {/* LinkedIn Icon */}
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center hover:opacity-80 transition-opacity"
            title="LinkedIn"
          >
            <img 
              src={linkedinIconPath} 
              alt="LinkedIn" 
              className="w-5 h-5 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </a>

          {/* GitHub Icon */}
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center hover:opacity-80 transition-opacity"
            title="GitHub"
          >
            <img 
              src={githubIconPath} 
              alt="GitHub" 
              className="w-5 h-5 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </a>

          {/* Mail Icon */}
          <a 
            href="mailto:contact@meridian.app" 
            className="w-7 h-7 flex items-center justify-center hover:opacity-80 transition-opacity"
            title="Email"
          >
            <img 
              src={mailIconPath} 
              alt="Mail" 
              className="w-5 h-5 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
