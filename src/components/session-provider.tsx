'use client';

import { createContext, useContext, useState } from 'react';
import type { User } from '~/types';

type SessionContextData = {
  user?: User;
  updateSessionUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export const SessionContext = createContext<SessionContextData>({} as any);

type SessionProviderProps = React.PropsWithChildren<{ user?: User }>;

export function SessionProvider({ children, user: dbUser }: SessionProviderProps) {
  const [user, setUser] = useState(dbUser);

  return (
    <SessionContext.Provider value={{ user, updateSessionUser: setUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
