import React from 'react';

/**
 * Deterministic gradient palette based on a string (name or id).
 * Returns a CSS linear-gradient string.
 */
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #f5576c 0%, #ff6a88 100%)',
  'linear-gradient(135deg, #667eea 0%, #00d2ff 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (name[0] || '?').toUpperCase();
}

interface UserAvatarProps {
  /** User's display name — used for initials and gradient selection */
  name: string;
  /** Optional photo URL (data URL or remote) */
  photo?: string | null;
  /** Size in pixels. Defaults to 40. */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show an online indicator dot */
  online?: boolean;
}

/**
 * A modern avatar component that shows a user's photo or gradient initials.
 * Replaces the old emoji-based avatars throughout the app.
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  photo,
  size = 40,
  className = '',
  online,
}) => {
  const gradient = gradients[hashString(name) % gradients.length];
  const initials = getInitials(name);

  // Scale font size relative to avatar size
  const fontSize = Math.max(10, Math.round(size * 0.38));
  const borderRadius = size <= 32 ? '0.5rem' : size <= 48 ? '0.75rem' : '1rem';

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover"
          style={{ borderRadius }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-bold text-white select-none"
          style={{
            background: gradient,
            borderRadius,
            fontSize,
            letterSpacing: '0.02em',
          }}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute border-2 border-card rounded-full ${
            online ? 'bg-green-500' : 'bg-gray-400'
          }`}
          style={{
            width: Math.max(8, size * 0.22),
            height: Math.max(8, size * 0.22),
            bottom: -1,
            right: -1,
          }}
        />
      )}
    </div>
  );
};

export default UserAvatar;
