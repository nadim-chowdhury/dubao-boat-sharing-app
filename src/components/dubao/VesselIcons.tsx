import React from 'react';

interface IconProps {
  color?: string;
  size?: number;
  style?: any;
}

export const KayakIcon: React.FC<IconProps> = ({ color = '#00B4D8', size = 32, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path
      d="M2 12C5 10.5 9 10 12 10C15 10 19 10.5 22 12C19 13.5 15 14 12 14C9 14 5 13.5 2 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 12L18 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 8L14 16"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const FerryIcon: React.FC<IconProps> = ({ color = '#00B4D8', size = 32, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path
      d="M3 14H21L19 18H5L3 14Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M6 14V10C6 9 7 8 8 8H16C17 8 18 9 18 10V14"
      stroke={color}
      strokeWidth="2"
    />
    <path
      d="M9 8V5H15V8"
      stroke={color}
      strokeWidth="1.5"
    />
    <line x1="8" y1="11" x2="16" y2="11" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const YachtIcon: React.FC<IconProps> = ({ color = '#00B4D8', size = 32, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path
      d="M2 13C6 13 11 11.5 14 8C17 11.5 20 13 22 13L19 18H5L2 13Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M11 8V3H13V8"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M13 4L17 6L13 8"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CargoShipIcon: React.FC<IconProps> = ({ color = '#00B4D8', size = 32, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path
      d="M2 15H22L20 19H4L2 15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <rect x="5" y="10" width="3" height="5" rx="0.5" stroke={color} strokeWidth="2" />
    <rect x="9" y="8" width="3" height="7" rx="0.5" stroke={color} strokeWidth="2" />
    <rect x="13" y="11" width="3" height="4" rx="0.5" stroke={color} strokeWidth="2" />
    <path d="M18 15V12H20V15" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const CruiseIcon: React.FC<IconProps> = ({ color = '#00B4D8', size = 32, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path
      d="M2 14H22L19 20H5L2 14Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M4 14V11H20V14"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M6 11V8H18V11"
      stroke={color}
      strokeWidth="1.5"
    />
    <circle cx="7" cy="17" r="1" fill={color} />
    <circle cx="12" cy="17" r="1" fill={color} />
    <circle cx="17" cy="17" r="1" fill={color} />
  </svg>
);

export const JetSkiIcon: React.FC<IconProps> = ({ color = '#00B4D8', size = 32, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path
      d="M3 15L15 13L21 16L18 18H6L3 15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9 14L11 9H13L12 13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 9H15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const DuckBoatIcon: React.FC<IconProps> = ({ color = '#00B4D8', size = 32, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path
      d="M4 14C4 14 5 10 9 10C13 10 14 13 18 13C19.5 13 21 12 21 10C21 14 18 17 14 17H8C5.5 17 4 15.5 4 14Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M16 10C16 8.5 17 7 18.5 7C19.5 7 20 7.8 20 8.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="17.5" cy="8.5" r="0.8" fill={color} />
  </svg>
);

export const MattressIcon: React.FC<IconProps> = ({ color = '#00B4D8', size = 32, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <rect x="3" y="11" width="18" height="5" rx="1" stroke={color} strokeWidth="2" />
    <line x1="7" y1="11" x2="7" y2="16" stroke={color} strokeWidth="1.5" />
    <line x1="12" y1="11" x2="12" y2="16" stroke={color} strokeWidth="1.5" />
    <line x1="17" y1="11" x2="17" y2="16" stroke={color} strokeWidth="1.5" />
  </svg>
);

// Map categories to specific components
export const getVesselIcon = (id: string, color?: string, size?: number, style?: any) => {
  switch (id) {
    case 'mini':
      return <KayakIcon color={color} size={size} style={style} />;
    case 'launch':
      return <FerryIcon color={color} size={size} style={style} />;
    case 'vip':
      return <YachtIcon color={color} size={size} style={style} />;
    case 'cargo':
      return <CargoShipIcon color={color} size={size} style={style} />;
    case 'titanic':
      return <CruiseIcon color={color} size={size} style={style} />;
    case 'jetski':
      return <JetSkiIcon color={color} size={size} style={style} />;
    case 'duck':
      return <DuckBoatIcon color={color} size={size} style={style} />;
    case 'airbed':
      return <MattressIcon color={color} size={size} style={style} />;
    default:
      return <KayakIcon color={color} size={size} style={style} />;
  }
};
