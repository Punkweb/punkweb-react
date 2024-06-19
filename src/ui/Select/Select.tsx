import clsx from 'clsx';
import React from 'react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  fluid?: boolean;
  hint?: React.ReactNode;
  label?: string;
};

export const Select = React.forwardRef(
  ({ className, fluid, hint, id, label, ...rest }: SelectProps, ref: React.ForwardedRef<HTMLSelectElement>) => {
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
        <select
          className={clsx('pw-input', {
            fluid: fluid,
          })}
          id={id}
          ref={ref}
          {...rest}
        />
        {hint && <p className="hint mt-2">{hint}</p>}
      </div>
    );
  },
);
