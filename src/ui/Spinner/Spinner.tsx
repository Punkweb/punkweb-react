import React from 'react';
import clsx from 'clsx';

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  message?: string;
};

export const Spinner = ({ className, message, ...rest }: SpinnerProps) => {
  return (
    <div className="pw-spinner-container">
      <div className={clsx('pw-spinner', className)} {...rest}></div>
      {message && <div className="pw-spinner-message">{message}</div>}
    </div>
  );
};
