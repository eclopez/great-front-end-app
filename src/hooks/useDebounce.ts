import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number = 500) {
  const [debounceValue, setDebounceValue] = useState<T>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
}

export default useDebounce;
