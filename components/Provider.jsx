"use client"

import React, { createContext, useContext, useState } from 'react';
import { SessionProvider } from 'next-auth/react';

// Create the data context and export the useData hook
const DataContext = createContext();

export const useData = () => useContext(DataContext);

const Provider = ({ children, session }) => {
  // Initialize state for your custom data
  const [data, setData] = useState(null);

  return (
    <SessionProvider session={session}>
      <DataContext.Provider value={{ data, setData }}>
        {children}
      </DataContext.Provider>
    </SessionProvider>
  );
}

export default Provider;
