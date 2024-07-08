'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { User } from '~/types';

type SessionContextData = {
  user?: User;
  updateSessionUser: (newUser: User) => Promise<void>;
};

export const SessionContext = createContext<SessionContextData>({} as any);

type SessionProviderProps = React.PropsWithChildren<{ user?: User }>;

export function SessionProvider({ children, user: dbUser }: SessionProviderProps) {
  const [user, setUser] = useState(dbUser);

  const updateSessionUser = useCallback(
    async (newUser: User) => setUser(prev => prev && newUser),
    [],
  );

  return (
    <SessionContext.Provider value={{ user, updateSessionUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
