'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { RecoilRoot } from 'recoil';

const queryClient = new QueryClient();

function RecoilRootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RecoilRoot>
  );
}

export default RecoilRootWrapper;
