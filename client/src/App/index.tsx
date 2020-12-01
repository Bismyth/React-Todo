import React from 'react'
//import Todo from './components/Todo'
import axios from 'axios'
import { useQuery } from 'react-query'
import { Container } from 'reactstrap'
import { UserContext } from 'App/Context'
import { Switch, Route } from 'react-router-dom'
import routes from 'router'
import Toolbar from 'Components/Toolbar'

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
        <Switch>
          {routes.map(({ name, ...route }) => (
            <Route key={name} {...route} />
          ))}
        </Switch>
      </Container>
    </UserContext.Provider>
  )
}

export default App
