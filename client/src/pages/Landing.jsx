import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  // Background image path inside client/public/
  const bgImagePath = '/landing-bg.jpg';

  const titleText = "Meridian";

  return (
    <div 
      className="h-screen w-screen relative flex flex-col items-center justify-between overflow-hidden p-8 select-none bg-cover bg-center bg-no-repeat bg-[#0F172A]"
      style={{ backgroundImage: `url('${bgImagePath}')` }}
    >
      {/* Top Spacer */}
      <div className="w-full flex-1" />

      {/* Hero Title with Staggered Letter Entrance Animation */}
      <div className="flex flex-col items-center justify-center space-y-6 text-center z-10">
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter drop-shadow-md flex items-center justify-center">
          {titleText.split('').map((char, index) => (
            <span
              key={index}
              className="animate-letter-pop"
              style={{ animationDelay: `${index * 80 + 150}ms` }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Circular Glassmorphism Button */}
        <button
          onClick={() => navigate('/goals')}
          className="px-7 py-3 bg-black/50 hover:bg-black/70 text-white text-xs font-bold rounded-full flex items-center justify-center backdrop-blur-md border border-white/70 shadow-2xl shadow-black/80 transition-all active:scale-95 group cursor-pointer animate-fade-in-rise"
          style={{ animationDelay: '800ms' }}
          title="Open App"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Bottom Compact Social Handles Bar */}
      <div className="w-full flex-1 flex flex-col justify-end items-center animate-fade-in-rise" style={{ animationDelay: '1000ms' }}>
        <div className="flex items-center gap-4 z-10 py-2">
          {/* LinkedIn Link */}
          <a 
            href="https://www.linkedin.com/in/azhaanalisiddiqui/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-md"
            title="LinkedIn"
          >
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>

          {/* GitHub Link */}
          <a 
            href="https://github.com/AzhaanGlitch" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-md"
            title="GitHub"
          >
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
            </svg>
          </a>

          {/* Mail Link */}
          <a 
            href="mailto:azhaanalisiddiqui15@gmail.com" 
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-md"
            title="Email"
          >
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
