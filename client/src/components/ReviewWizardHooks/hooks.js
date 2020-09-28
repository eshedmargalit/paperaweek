import { useState, useEffect } from 'react';

export const useCurrentMoment = intervalTime => {
  const [currentMoment, setMoment] = useState(lastSave);

  useEffect(() => {
    const interval = setInterval(() => {
      setMoment(() => moment());
    }, intervalTime);
    return () => clearInterval(interval);
  }, []);

  return currentMoment;
};
