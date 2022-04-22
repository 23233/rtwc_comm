import React, { useRef } from 'react';
import { RippleOptions } from './useRipple';
import { useRipple } from '@rtwc/comm';

interface p extends RippleOptions {
  children: React.ReactNode;
  className?: string;
}

const RippleView: React.FC<p> = ({ children, className = '' }) => {
  const divRef = useRef<any>();
  useRipple(divRef);
  return (
    <div ref={divRef} className={className}>
      {children}
    </div>
  );
};
export default RippleView;
