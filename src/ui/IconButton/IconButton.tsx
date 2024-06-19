import clsx from 'clsx';
import React from 'react';

export type IconButtonColor =
  | 'primary'
  | 'gray'
  | 'red'
  | 'pink'
  | 'grape'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'orange';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconButtonVariant = 'default' | 'raised' | 'outlined' | 'ghost';

export type IconButton = React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> & {
  color?: IconButtonColor;
  rounded?: boolean;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

export const IconButton = React.forwardRef(
  (
    {
      className,
      color = 'gray',
      rounded = true,
      size = 'md',
      type = 'button',
      variant = 'default',
      ...rest
    }: IconButton,
    ref: React.ForwardedRef<HTMLButtonElement> | React.ForwardedRef<HTMLAnchorElement>,
  ) => {
    return (
      <button
        className={clsx(
          'pw-icon-button',
          {
            rounded: rounded,
            [`${color}`]: color,
            [`${size}`]: size,
            [`${variant}`]: variant,
          },
          className,
        )}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type={type}
        {...rest}
      />
    );
  },
);
