import { FC, SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/** Sahayak Brand Logo - Renders favicon.svg from public folder */
export const SahayakLogo: FC<IconProps> = ({ size = 28, className = "" }) => (
  <img src="/favicon.svg" alt="Logo" style={{ width: size, height: size }} className={className} />
);

/** Heart & Blood Flow (CVD) Icon */
export const IconHeart: FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="currentColor" fillOpacity="0.15" stroke="#F43F5E" />
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" stroke="#F43F5E" strokeWidth="2" />
  </svg>
);

/** Blood Sugar (Diabetes) Icon */
export const IconDiabetes: FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" opacity="0.3" />
    <path d="M12 3C8 8.5 6 11.5 6 15a6 6 0 0 0 12 0c0-3.5-2-6.5-6-12Z" fill="currentColor" fillOpacity="0.2" stroke="#E11D48" />
    <path d="M10 16a2 2 0 0 0 4 0" />
  </svg>
);

/** Blood Pressure (Hypertension) Icon */
export const IconBP: FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="4" width="18" height="12" rx="3" fill="currentColor" fillOpacity="0.15" stroke="#F97316" />
    <path d="M7 10h2l1-2 2 4 1-2h4" stroke="#F97316" strokeWidth="2.2" />
    <path d="M12 16v4 M8 20h8" />
  </svg>
);

/** Kidney Filtration Health (CKD) Icon */
export const IconKidney: FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 3c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Z" fill="currentColor" fillOpacity="0.15" stroke="#059669" />
    <path d="M12 7v10 M8 10c0 3.3 1.8 6 4 6s4-2.7 4-6-1.8-6-4-6-4 2.7-4 6Z" stroke="#10B981" />
    <path d="M10 12.5h4" />
  </svg>
);

/** Brain & Stroke Alert (FAST) Icon */
export const IconBrain: FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 4 C9 4 7 5.5 6 7.5 C4.5 8.5 4 10.5 4.5 12.5 C4 14.5 4.5 16.5 6 18 C7.5 19.5 10 20 12 20 C14 20 16.5 19.5 18 18 C19.5 16.5 20 14.5 19.5 12.5 C20 10.5 19.5 8.5 18 7.5 C17 5.5 15 4 12 4 Z" fill="currentColor" fillOpacity="0.15" stroke="#8B5CF6" />
    <path d="M12 4 v16 M8 9.5 c1 1 2 1 4 0 M16 14.5 c-1-1-2-1-4 0" />
  </svg>
);

/** Urgency Band: All Clear (Doing Well) */
export const IconUrgencySafe: FC<IconProps> = ({ size = 20, className = "text-emerald-500", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

/** Urgency Band: Needs Attention (Keep Watch) */
export const IconUrgencyAttention: FC<IconProps> = ({ size = 20, className = "text-amber-500", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polygon points="12 2 22 20 2 20" fill="currentColor" fillOpacity="0.2" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
  </svg>
);

/** Urgency Band: 48 Hours */
export const IconUrgency48h: FC<IconProps> = ({ size = 20, className = "text-orange-500", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/** Urgency Band: Immediate */
export const IconUrgencyImmediate: FC<IconProps> = ({ size = 20, className = "text-red-500", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="currentColor" fillOpacity="0.25" />
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

/** Navigation & Utility Icons */
export const IconHome: FC<IconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const IconUsers: FC<IconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconUser: FC<IconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconDoctor: FC<IconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

export const IconClipboard: FC<IconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 12h6 M9 16h6" />
  </svg>
);

export const IconMic: FC<IconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8" />
  </svg>
);

export const IconSparkles: FC<IconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M5 3v4 M3 5h4 M19 15v4 M17 17h4" />
  </svg>
);

export const IconInfo: FC<IconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const IconCopy: FC<IconProps> = ({ size = 18, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const IconHospital: FC<IconProps> = ({ size = 22, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M3 21h18 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
    <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
    <path d="M10 9h4 M12 7v4" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export const IconHomeWellness: FC<IconProps> = ({ size = 22, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M3 10L12 3l9 7 M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
    <path d="M12 14c-1.5 0-3-1-3-2.5 0-2 3-4 3-4s3 2 3 4c0 1.5-1.5 2.5-3 2.5z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export const IconShield: FC<IconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconCheck: FC<IconProps> = ({ size = 18, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconArrowRight: FC<IconProps> = ({ size = 18, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
