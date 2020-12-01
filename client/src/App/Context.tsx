import React from 'react'

type User = {
  isAuthenticated: boolean
  user:
    | {
        username: string
      }
    | undefined
  authLoading: boolean
}

export const UserContext = React.createContext<User>({
  isAuthenticated: false,
  user: undefined,
  authLoading: false
})
