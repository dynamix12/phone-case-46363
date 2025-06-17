"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { ReactNode, useState } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: false,
          },
        },
      })
  );

  return (
    <KindeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </KindeProvider>
  );
};

export default Providers;
