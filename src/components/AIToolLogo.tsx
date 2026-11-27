interface AIToolLogoProps {
  id: string;
  name: string;
  className?: string;
}

export function AIToolLogo({ id, name, className = 'h-9 w-9' }: AIToolLogoProps) {
  switch (id) {
    case 'chatgpt':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-label={`${name} logo`}>
          <rect width="40" height="40" rx="10" fill="#10A37F" fillOpacity="0.14" />
          <g stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 9.5a5.2 5.2 0 0 1 4.5 2.6l5 8.7a5.2 5.2 0 0 1-1.9 7.1" />
            <path d="M29.5 20a5.2 5.2 0 0 1-2.6 4.5l-8.7 5a5.2 5.2 0 0 1-7.1-1.9" />
            <path d="M24.5 29.5a5.2 5.2 0 0 1-4.5 1.1l-8.7-5a5.2 5.2 0 0 1-1.9-7.1" />
            <path d="M10.5 20a5.2 5.2 0 0 1 2.6-4.5l8.7-5a5.2 5.2 0 0 1 7.1 1.9" />
            <polygon points="20,15.2 24.2,17.6 24.2,22.4 20,24.8 15.8,22.4 15.8,17.6" />
          </g>
        </svg>
      );

    case 'gemini':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-label={`${name} logo`}>
          <defs>
            <linearGradient id="gemini-brand-grad" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EA4335" />
              <stop offset="35%" stopColor="#FBBC05" />
              <stop offset="68%" stopColor="#34A853" />
              <stop offset="100%" stopColor="#4285F4" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="10" fill="#4285F4" fillOpacity="0.14" />
          <path
            d="M20 6C20.9 13.7 26.3 19.1 34 20C26.3 20.9 20.9 26.3 20 34C19.1 26.3 13.7 20.9 6 20C13.7 19.1 19.1 13.7 20 6Z"
            fill="url(#gemini-brand-grad)"
          />
        </svg>
      );

    case 'claude':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-label={`${name} logo`}>
          <rect width="40" height="40" rx="10" fill="#D97757" />
          <g stroke="#FAF5F0" strokeWidth="2.4" strokeLinecap="round">
            <line x1="20" y1="8.5" x2="20" y2="31.5" />
            <line x1="8.5" y1="20" x2="31.5" y2="20" />
            <line x1="11.8" y1="11.8" x2="28.2" y2="28.2" />
            <line x1="28.2" y1="11.8" x2="11.8" y2="28.2" />
            <line x1="15.4" y1="9.6" x2="24.6" y2="30.4" />
            <line x1="30.4" y1="15.4" x2="9.6" y2="24.6" />
          </g>
          <circle cx="20" cy="20" r="3" fill="#D97757" />
        </svg>
      );

    case 'github-copilot':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-label={`${name} logo`}>
          <rect width="40" height="40" rx="10" fill="#238636" fillOpacity="0.18" />
          <path
            d="M11 18.5C11 13.8 14.9 10.5 20 10.5C25.1 10.5 29 13.8 29 18.5V23.5C29 26.5 25.4 29 20 29C14.6 29 11 26.5 11 23.5V18.5Z"
            stroke="#F5F1F7"
            strokeWidth="2"
          />
          <rect x="13.5" y="16.5" width="5.5" height="5" rx="2" fill="#38BDF8" />
          <rect x="21" y="16.5" width="5.5" height="5" rx="2" fill="#38BDF8" />
          <path d="M16 25H24" stroke="#F5F1F7" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'cursor':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-label={`${name} logo`}>
          <rect width="40" height="40" rx="10" fill="#FFFFFF" fillOpacity="0.08" />
          <polygon points="20,7 31,13.5 31,26.5 20,33 9,26.5 9,13.5" fill="#18181B" stroke="#E4E4E7" strokeWidth="1.6" />
          <polygon points="20,7 31,13.5 20,20 9,13.5" fill="#F4F4F5" />
          <polygon points="20,20 31,13.5 31,26.5 20,33" fill="#71717A" />
          <polygon points="9,13.5 20,20 20,33 9,26.5" fill="#27272A" />
        </svg>
      );

    case 'perplexity':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-label={`${name} logo`}>
          <rect width="40" height="40" rx="10" fill="#20B8CD" fillOpacity="0.14" />
          <g stroke="#20B8CD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="20" y1="8" x2="20" y2="32" />
            <polygon points="12,13 20,18 28,13 28,25 20,30 12,25" />
            <line x1="12" y1="19" x2="28" y2="19" />
            <path d="M14 9L20 14L26 9" />
          </g>
        </svg>
      );

    case 'lovable':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-label={`${name} logo`}>
          <defs>
            <linearGradient id="lovable-brand-grad" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF5E7E" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="10" fill="#FF5E7E" fillOpacity="0.14" />
          <path
            d="M20 30.5C20 30.5 10 23.8 10 16.5C10 13.1 12.6 10.5 15.8 10.5C17.7 10.5 19.3 11.4 20 12.8C20.7 11.4 22.3 10.5 24.2 10.5C27.4 10.5 30 13.1 30 16.5C30 23.8 20 30.5 20 30.5Z"
            fill="url(#lovable-brand-grad)"
          />
        </svg>
      );

    case 'bolt':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-label={`${name} logo`}>
          <rect width="40" height="40" rx="10" fill="#14D387" fillOpacity="0.16" />
          <path
            d="M22.5 7.5L11.5 21.5H19.5L17.5 32.5L28.5 18.5H20.5L22.5 7.5Z"
            fill="#14D387"
            stroke="#14D387"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'v0':
    default:
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-label={`${name} logo`}>
          <rect width="40" height="40" rx="10" fill="#FFFFFF" fillOpacity="0.1" />
          <path
            d="M9 13H13L17.2 24.2L21.4 13H25L18.8 28H15.6L9 13Z"
            fill="#FFFFFF"
          />
          <rect x="25.5" y="13" width="6.5" height="15" rx="3.25" stroke="#FFFFFF" strokeWidth="2.2" />
        </svg>
      );
  }
}
