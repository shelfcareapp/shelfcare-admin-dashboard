import { useEffect } from 'react';

export const useOutsideClick = (
  ref: React.MutableRefObject<HTMLElement>,
  callback: () => void
) => {
  const handleClick = (e: MouseEvent) => {
    if (!ref.current?.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
};
