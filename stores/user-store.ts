import {create} from 'zustand'
import { persist } from 'zustand/middleware';

interface User {
   userId:string,
   username: string,
   email: string,
   role:string
}

interface UserStore {
   user: User | null,
   setUser: (user: User) => void
   clearUser: () => void;
}

// export const useUserStore = create<UserStore>((set) => ({
//    user: null,
//    setUser: (user) => set(()=>({user})),
//    clearUser: () => set({ user: null }),
// }))


//using set inside persist for data persistence
export const useUserStore = create<UserStore>()(
   persist(
     (set) => ({
       user: null,
       setUser: (user) => set(() => ({ user })),
       clearUser: () => set({ user: null }),
     }),
     {
       name: 'user-storage', // unique name
      //  getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
     }
   )
 );