import React from 'react';
import localVideo from '../videos/manual-paymas.mp4';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <h4 className="mb-4 text-center text-2xl font-bold text-indigo-400">
            Video Tutorial:
          </h4>

          <div className="w-full max-w-[420px] overflow-hidden rounded-xl bg-gray-950 shadow-2xl manual-shadow aspect-[9/16]">
            <video
              className="h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
            >
              <source src={localVideo} type="video/mp4" />
              Seu navegador nao suporta a tag de video.
            </video>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
