import React from 'react'
import { NavItem, NavLink } from 'reactstrap'
import axios from 'axios'
import { queryCache } from 'react-query'

const Logout: React.FC = () => {
  const logout = () => {
    axios({ method: 'get', url: '/api/auth/logout' }).then(() => {
      queryCache.invalidateQueries('user')
    })
  }
  return (
    <NavItem>
      <NavLink onClick={logout} href='#'>
        Logout
      </NavLink>
    </NavItem>
  )
}

export default Logout
