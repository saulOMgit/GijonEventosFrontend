
import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg viewBox="0 0 240 48" xmlns="http://www.w3.org/2000/svg" {...props}>
          <style>
            {`
              .logo-gijon {
                font-family: 'Pacifico', cursive;
                font-size: 32px;
                fill: currentColor;
              }
              .logo-eventos {
                font-family: 'Poppins', sans-serif;
                font-size: 28px;
                font-weight: 500;
                fill: #4b5563; /* text-gray-600 */
              }
              @media (prefers-color-scheme: dark) {
                .logo-eventos {
                   fill: #d1d5db; /* text-gray-300 */
                }
              }
            `}
          </style>
          <text x="5" y="30" className="logo-gijon">Gijón</text>
          <text x="115" y="29" className="logo-eventos">Eventos</text>
        </svg>
    );
};

export default Logo;
