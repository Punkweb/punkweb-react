import React from 'react';
import './Spinner.scss';
import clsx from 'clsx';

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  message?: string;
};

export const Spinner = ({ className, message, ...rest }: SpinnerProps) => {
  return (
    <div className="Spinner__container">
      <div className={clsx('Spinner', className)} {...rest}></div>
      {message && <div className="Spinner__message">{message}</div>}
    </div>
  );
};
