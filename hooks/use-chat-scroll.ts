import React, { useEffect, useRef } from 'react';

function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);

  return ref;
}

export { useChatScroll };
