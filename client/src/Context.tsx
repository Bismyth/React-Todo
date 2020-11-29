import React from 'react'

type User = {
  isAuthenticated: boolean
  user: {
    username: string
  } | null
}

export const UserContext = React.createContext<User>({
  isAuthenticated: false,
  user: null
})
