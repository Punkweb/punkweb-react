import clsx from 'clsx';
import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  fluid?: boolean;
  hint?: React.ReactNode;
  invalid?: boolean;
  label?: string;
};

export const Input = React.forwardRef(
  ({ className, fluid, hint, id, invalid, label, ...rest }: InputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    return (
      <div
        className={clsx('pw-input-container', {
          fluid: fluid,
        })}
      >
        {label && (
          <label className="pw-input-label" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          className={clsx(
            'pw-input',
            {
              fluid: fluid,
              invalid: invalid,
            },
            className,
          )}
          id={id}
          ref={ref}
          {...rest}
        />
        {hint && <p className="hint mt-2">{hint}</p>}
      </div>
    );
  },
);
