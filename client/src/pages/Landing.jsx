import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  // Paths for custom image assets inside client/public/
  const bgImagePath = '/landing-bg.jpg';

  // SVG Data URIs for official brand logos so they always render accurately
  const linkedinLogoSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230077B5'%3E%3Cpath d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z'/%3E%3C/svg%3E";
  const githubLogoSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z'/%3E%3C/svg%3E";
  const mailLogoSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EA4335'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E";

  return (
    <div 
      className="h-screen w-screen relative flex flex-col items-center justify-between overflow-hidden p-8 select-none bg-cover bg-center bg-no-repeat bg-[#0F172A]"
      style={{ backgroundImage: `url('${bgImagePath}')` }}
    >
      {/* Top Spacer */}
      <div className="w-full flex-1" />

      {/* Hero Title & Glassmorphism Circular Arrow Button */}
      <div className="flex flex-col items-center justify-center space-y-6 text-center z-10">
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter drop-shadow-md">
          Meridian
        </h1>

        <button
          onClick={() => navigate('/dashboard')}
          className="px-7 py-3 bg-black/50 hover:bg-black/70 text-white text-xs font-bold rounded-full flex items-center justify-center backdrop-blur-md border border-white/70 shadow-2xl shadow-black/80 transition-all active:scale-95 group cursor-pointer"
          title="Open App"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Bottom Compact Social Handles Bar */}
      <div className="w-full flex-1 flex flex-col justify-end items-center">
        <div className="flex items-center gap-4 z-10 py-2">
          {/* LinkedIn Original Brand Logo */}
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-md"
            title="LinkedIn"
          >
            <img 
              src={linkedinLogoSvg} 
              alt="LinkedIn" 
              className="w-4 h-4 object-contain"
            />
          </a>

          {/* GitHub Original Brand Logo */}
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-md"
            title="GitHub"
          >
            <img 
              src={githubLogoSvg} 
              alt="GitHub" 
              className="w-4 h-4 object-contain"
            />
          </a>

          {/* Gmail/Mail Original Brand Logo */}
          <a 
            href="mailto:contact@meridian.app" 
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-md"
            title="Email"
          >
            <img 
              src={mailLogoSvg} 
              alt="Email" 
              className="w-4 h-4 object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
