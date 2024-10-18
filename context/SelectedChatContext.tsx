import React, { createContext, useContext, useState } from 'react';

interface SelectedChatContextProps {
  selectedChatId: string | undefined;
  setSelectedChatId: (id: string) => void;
}

const SelectedChatContext = createContext<SelectedChatContextProps | undefined>(
  undefined
);

export const useSelectedChat = () => {
  const context = useContext(SelectedChatContext);
  if (!context) {
    throw new Error(
      'useSelectedChat must be used within a SelectedChatProvider'
    );
  }
  return context;
};

export const SelectedChatProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  );

  return (
    <SelectedChatContext.Provider value={{ selectedChatId, setSelectedChatId }}>
      {children}
    </SelectedChatContext.Provider>
  );
};
