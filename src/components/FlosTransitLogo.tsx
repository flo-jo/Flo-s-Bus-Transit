import React from 'react';

interface FlosTransitLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FlosTransitLogo: React.FC<FlosTransitLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const heightClass =
    size === 'sm' ? 'h-7' : size === 'lg' ? 'h-11' : 'h-9';

  return (
    <div
      className={`inline-flex items-center select-none ${heightClass} ${className}`}
      aria-label="Flo's Transit"
    >
      <svg
        viewBox="0 0 240 54"
        className="h-full w-auto max-w-[190px] drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top swoosh accent curves above Transit */}
        <path
          d="M 50 13 Q 115 5 180 14 Q 120 9 60 15 Z"
          fill="#FF7A00"
          opacity="0.85"
        />
        <path
          d="M 68 17 Q 128 8 200 18 Q 135 12 75 19 Z"
          fill="#5f0b62"
        />

        {/* Flo's (Orange, dynamic bold italic) */}
        <g transform="skewX(-14)">
          <text
            x="24"
            y="42"
            fill="#E65100"
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="34"
            letterSpacing="-0.5px"
          >
            Flo's
          </text>
        </g>

        {/* Transit (Purple, dynamic bold italic with extended t-crossbar) */}
        <g transform="skewX(-14)">
          <text
            x="110"
            y="42"
            fill="#5f0b62"
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="34"
            letterSpacing="-0.8px"
          >
            Transit
          </text>

          {/* Extended right crossbar flourish on final 't' */}
          <path
            d="M 215 28 L 235 27.5 L 233 30.5 L 214 30.5 Z"
            fill="#5f0b62"
          />
        </g>
      </svg>
    </div>
  );
};
