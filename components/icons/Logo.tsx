
import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg viewBox="0 0 240 50" xmlns="http://www.w3.org/2000/svg" {...props}>
          <style>
            {`
              .logo-text-gijon {
                font-family: 'Pacifico', cursive;
                font-size: 32px;
                fill: #B81D4F;
              }
              .logo-text-eventos {
                  font-family: 'Poppins', sans-serif;
                  font-size: 30px;
                  font-weight: 500;
                  fill: #4b5563;
              }
              .dark .logo-text-gijon {
                 fill: #f87ea1;
              }
              .dark .logo-text-eventos {
                  fill: #d1d5db;
              }
            `}
          </style>
          <text x="5" y="35" className="logo-text-gijon">Gijón</text>
          <text x="110" y="34" className="logo-text-eventos">Eventos</text>
        </svg>
    );
};

export default Logo;