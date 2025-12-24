import { ReactNode } from "react";

/**
 * App-wide providers wrapper
 * 
 * Currently minimal because:
 * - No backend
 * - No auth
 * - No data fetching libs
 * 
 * This file exists for scalability and clarity.
 */

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
    </>
  );
}
