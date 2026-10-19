'use client';

import React from 'react';
import { HoldingProvider } from '../../context/HoldingContext';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <HoldingProvider>{children}</HoldingProvider>;
};
