import React from 'react'
//import Todo from './components/Todo'
import axios from 'axios'
import { useQuery } from 'react-query'
import { Container } from 'reactstrap'
import { UserContext } from './Context'

import Toolbar from './components/Toolbar'

const App: React.FC = () => {
  const { data: user } = useQuery(
    'user',
    async () => {
      const result = await axios({
        method: 'get',
        url: '/api/auth/user'
      })
      return result.data.user
    },
    { retry: false }
  )
  return (
    <UserContext.Provider value={{ isAuthenticated: !!user, user }}>
      <Toolbar />
      <Container>
        {!!user ? (
          <div>
            <h1>Hello {user.username}</h1>
          </div>
        ) : null}
      </Container>
    </UserContext.Provider>
  )
}

export default App
