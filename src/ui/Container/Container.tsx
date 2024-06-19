import clsx from 'clsx';
import React from 'react';

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {};

export const Container = ({ className, ...rest }: ContainerProps) => {
  return <div className={clsx('pw-container', className)} {...rest} />;
};
