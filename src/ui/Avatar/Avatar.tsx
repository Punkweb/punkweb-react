import clsx from 'clsx';
import React from 'react';
import { User } from '~/types';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: AvatarSize;
  user: User;
};

export const Avatar = React.forwardRef(
  ({ size = 'md', user, ...rest }: AvatarProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    function getInitials() {
      return user.username
        .split(' ')
        .map((name) => name[0])
        .join('');
    }

    return (
      <div
        className={clsx('pw-avatar', {
          [`${size}`]: size,
        })}
        ref={ref}
        {...rest}
      >
        <div className="pw-avatar-fallback">{getInitials()}</div>
      </div>
    );
  },
);
