import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProgressContextProps {
  username: string;
  progress: string;
  setUserData: (username: string, progress: string) => void;
}

const ProgressContext = createContext<ProgressContextProps | undefined>(
  undefined,
);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState('');
  const [progress, setProgress] = useState('');

  const setUserData = (newUsername: string, newProgress: string) => {
    setUsername(newUsername);
    setProgress(newProgress);
  };

  return (
    <ProgressContext.Provider value={{ username, progress, setUserData }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
