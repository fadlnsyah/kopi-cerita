/**
 * Custom Icons untuk Kopi Cerita
 * 
 * SVG icons yang aesthetic dan sesuai tema coffee shop
 */

interface IconProps {
  className?: string;
  color?: string;
  size?: number;
}

// Coffee Bean Icon
export function CoffeeBeanIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="6" ry="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 3C12 3 9 7 9 12C9 17 12 21 12 21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Coffee Cup with Steam
export function CoffeeCupIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M5 12H19V17C19 19.2091 17.2091 21 15 21H9C6.79086 21 5 19.2091 5 17V12Z" stroke={color} strokeWidth="1.5"/>
      <path d="M19 14H20C21.1046 14 22 14.8954 22 16C22 17.1046 21.1046 18 20 18H19" stroke={color} strokeWidth="1.5"/>
      <path d="M8 9C8 9 8.5 7 8 5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 8C12 8 12.5 6 12 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 9C16 9 16.5 7 16 5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Pour Over / V60 Icon
export function PourOverIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M7 8L5 20H19L17 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 8H18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 4V8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="14" r="3" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

// Leaf / Tea Icon
export function LeafIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 22V13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 9C5 5 8 2 12 2C16 2 19 5 19 9C19 13 16 16 12 16C8 16 5 13 5 9Z" stroke={color} strokeWidth="1.5"/>
      <path d="M12 8C12 8 9 10 9 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Croissant / Pastry Icon  
export function PastryIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 16C4 16 6 12 12 12C18 12 20 16 20 16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 16C6 14 8 12 12 12C16 12 18 14 18 16" stroke={color} strokeWidth="1.5"/>
      <path d="M8 16C8 15 10 13 12 13C14 13 16 15 16 16" stroke={color} strokeWidth="1.5"/>
      <path d="M4 16C4 18 7 20 12 20C17 20 20 18 20 16" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

// Plant / Sustainability Icon
export function PlantIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 22V12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 12C12 12 7 10 7 6C7 2 12 2 12 2C12 2 17 2 17 6C17 10 12 12 12 12Z" stroke={color} strokeWidth="1.5"/>
      <path d="M8 18C8 18 4 18 4 14C4 10 8 10 8 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 18C16 18 20 18 20 14C20 10 16 10 16 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Heart with Steam (Love/Passion)
export function HeartSteamIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 21L10.55 19.7C5.4 15.1 2 12.1 2 8.5C2 5.4 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.4 22 8.5C22 12.1 18.6 15.1 13.45 19.7L12 21Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

// Community / People Icon
export function CommunityIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
      <path d="M4 20C4 16 7 14 12 14C17 14 20 16 20 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Quality / Star Badge Icon
export function QualityIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.4 8.2L21 9L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9L9.6 8.2L12 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

// Location Pin Icon
export function LocationIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 21C12 21 19 15 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15 12 21 12 21Z" stroke={color} strokeWidth="1.5"/>
      <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

// Phone Icon
export function PhoneIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92V19.92C22 20.48 21.56 20.96 21 21C14.28 20.57 8.01 16.31 4.08 9.68C3.04 7.2 2.6 4.87 3 3C3.04 2.44 3.52 2 4.08 2H7.08C7.57 2 8 2.37 8.08 2.85C8.18 3.46 8.36 4.85 8.62 6C8.71 6.41 8.57 6.84 8.27 7.11L6.62 8.51C8.06 11.4 10.6 13.93 13.49 15.38L14.89 13.73C15.16 13.43 15.59 13.29 16 13.38C17.15 13.64 18.54 13.82 19.15 13.92C19.63 14 20 14.43 20 14.92V16.92H22Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

// Email Icon
export function EmailIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M3 7L12 13L21 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Clock Icon
export function ClockIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 7V12L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ALl Categories Grid Icon
export function GridIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

// Social Media Icons
export function InstagramIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export function FacebookIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

export function TwitterIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
  );
}

export function YoutubeIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6 .46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  );
}

export function TiktokIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
  );
}
