import React from 'react';

const PublicPageHero = ({ title, subtitle, emoji }) => (
  <div className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-700 text-white py-10 sm:py-14">
    <div className="max-w-3xl mx-auto px-4 text-center">
      {emoji && (
        <span className="text-4xl sm:text-5xl block mb-3" aria-hidden>
          {emoji}
        </span>
      )}
      <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">{title}</h1>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export default PublicPageHero;
