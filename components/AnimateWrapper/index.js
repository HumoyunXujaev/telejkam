import React, { useRef, useEffect } from 'react';

const RevealWrapper = ({ children, className, origin, delay }) => {
  const revealRef = useRef(null);

  useEffect(() => {
    if (revealRef && revealRef.current) {
      // Perform the reveal animation or action here
    }
  }, [revealRef]);

  return (
    <div
      ref={revealRef}
      className={className}
      data-origin={origin}
      data-delay={delay}
    >
      {children}
    </div>
  );
};

export default RevealWrapper;
