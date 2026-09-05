import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 20, children, ...props }: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} {...props}>
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return <IconBase {...props}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></IconBase>;
}

export function ArrowUpRight(props: IconProps) {
  return <IconBase {...props}><path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></IconBase>;
}

export function Check(props: IconProps) {
  return <IconBase {...props}><path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></IconBase>;
}

export function Menu(props: IconProps) {
  return <IconBase {...props}><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></IconBase>;
}

export function Close(props: IconProps) {
  return <IconBase {...props}><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></IconBase>;
}

export function Search(props: IconProps) {
  return <IconBase {...props}><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></IconBase>;
}

export function Sparkles(props: IconProps) {
  return <IconBase {...props}><path d="M12 3c.6 3.7 2.3 5.4 6 6-3.7.6-5.4 2.3-6 6-.6-3.7-2.3-5.4-6-6 3.7-.6 5.4-2.3 6-6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" /><path d="M19 15c.2 1.7 1.1 2.6 2.8 2.8-1.7.2-2.6 1.1-2.8 2.8-.2-1.7-1.1-2.6-2.8-2.8 1.7-.2 2.6-1.1 2.8-2.8ZM5 15c.2 1.2.8 1.8 2 2-1.2.2-1.8.8-2 2-.2-1.2-.8-1.8-2-2 1.2-.2 1.8-.8 2-2Z" fill="currentColor" /></IconBase>;
}

export function Layers(props: IconProps) {
  return <IconBase {...props}><path d="m12 3 9 5-9 5-9-5 9-5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /><path d="m4 12 8 4.5 8-4.5M4 16l8 4.5 8-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Code(props: IconProps) {
  return <IconBase {...props}><path d="m8.5 5-6 7 6 7M15.5 5l6 7-6 7M14 3l-4 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Zap(props: IconProps) {
  return <IconBase {...props}><path d="M13.5 2 5 13h6l-.5 9L19 10h-6l.5-8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Chart(props: IconProps) {
  return <IconBase {...props}><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></IconBase>;
}

export function Shield(props: IconProps) {
  return <IconBase {...props}><path d="M12 3 5 6v5c0 4.7 2.8 8.2 7 10 4.2-1.8 7-5.3 7-10V6l-7-3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /><path d="m9 12 2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Globe(props: IconProps) {
  return <IconBase {...props}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M3.5 9h17M3.5 15h17M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" stroke="currentColor" strokeWidth="1.5" /></IconBase>;
}

export function Mail(props: IconProps) {
  return <IconBase {...props}><rect height="15" rx="2" stroke="currentColor" strokeWidth="1.7" width="19" x="2.5" y="4.5" /><path d="m4 7 8 6 8-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Clock(props: IconProps) {
  return <IconBase {...props}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7v5l3.5 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></IconBase>;
}

export function Users(props: IconProps) {
  return <IconBase {...props}><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" /><path d="M3 19c.4-3.5 2.4-5.5 6-5.5s5.6 2 6 5.5M15.5 5.5a3 3 0 0 1 0 5.7M17 14c2.4.5 3.7 2.2 4 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></IconBase>;
}

export function Star(props: IconProps) {
  return <IconBase {...props}><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" /></IconBase>;
}

export function ChevronDown(props: IconProps) {
  return <IconBase {...props}><path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></IconBase>;
}

export function Copy(props: IconProps) {
  return <IconBase {...props}><rect height="13" rx="2" stroke="currentColor" strokeWidth="1.7" width="13" x="8" y="8" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></IconBase>;
}
