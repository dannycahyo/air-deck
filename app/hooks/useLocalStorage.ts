import { useState, useEffect, useCallback } from 'react';

const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setStoredValue = useCallback(
    (valueOrFn: T | ((val: T) => T)) => {
      try {
        const newValue =
          valueOrFn instanceof Function ? valueOrFn(value) : valueOrFn;
        setValue(newValue);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [key, value]
  );

  return [value, setStoredValue];
};

export default useLocalStorage;
