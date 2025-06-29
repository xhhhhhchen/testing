// Displays user profile pictures/initials
import React from 'react';

interface UserAvatarProps {
  userId: number | string;
  username: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userId, username }) => {
  // Placeholder avatar using initials
  const initials = username
    ? username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div
      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
      title={username}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;