import clsx from 'clsx';
import React from 'react';

export type ButtonColor =
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
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'default' | 'outlined' | 'ghost' | 'raised';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: ButtonColor;
  fluid?: boolean;
  rounded?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const Button = React.forwardRef(
  (
    {
      className,
      color = 'gray',
      fluid,
      rounded,
      size = 'md',
      type = 'button',
      variant = 'default',
      ...rest
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <button
        className={clsx(
          'pw-button',
          {
            fluid: fluid,
            rounded: rounded,
            [`${color}`]: color,
            [`${size}`]: size,
            [`${variant}`]: variant,
          },
          className,
        )}
        ref={ref}
        type={type}
        {...rest}
      />
    );
  },
);
