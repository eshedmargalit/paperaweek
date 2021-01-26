import { useRef, useEffect, useCallback } from 'react';

export const useIsMounted = (): (() => boolean) => {
  const mountedRef = useRef(false);

  // Basically the same as "useDidMount" because it has no dependencies
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      // The cleanup function of useEffect is called by React on unmount
      mountedRef.current = false;
    };
  }, []);

  return useCallback(() => mountedRef.current, []);
};
