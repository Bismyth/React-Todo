import React, { useContext, useState, useEffect } from 'react'
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  NavbarText,
  Container,
  NavLink
} from 'reactstrap'
import { UserContext } from 'App/Context'

import Logout from './Links/Logout'
import UserForm from './Links/UserForm'
import { Link, useLocation } from 'react-router-dom'

const Toolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const auth = useContext(UserContext)
  const location = useLocation()
  const [page, setPage] = useState('')
  const toggle = () => {
    setIsOpen(v => !v)
  }
  useEffect(() => {
    setPage(location.pathname.split('/')[1])
  }, [location])
  const authLinks = (
    <Nav className='ml-auto' navbar>
      <NavItem>
        <NavbarText>Welcome {auth.user ? auth.user.username : ''}</NavbarText>
      </NavItem>
      <Logout />
    </Nav>
  )
  const guestLinks = (
    <Nav className='ml-auto' navbar>
      <UserForm title='Register' endpoint='/api/auth/register' />
      <UserForm title='Login' endpoint='/api/auth/login' />
    </Nav>
  )

  return (
    <Navbar color='dark' dark expand='md' className='mb-2'>
      <Container>
        <NavbarBrand tag={Link} to='/' style={{ fontSize: '1.5rem' }}>
          Todo App
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav navbar className='mr-auto'>
            <NavItem>
              <NavLink tag={Link} to='/' active={page === ''}>
                Home
              </NavLink>
            </NavItem>
            {!auth.authLoading ? (
              auth.isAuthenticated ? (
                <NavItem>
                  <NavLink tag={Link} to='/list' active={page === 'list'}>
                    My Lists
                  </NavLink>
                </NavItem>
              ) : null
            ) : null}
          </Nav>
          {!auth.authLoading
            ? auth.isAuthenticated
              ? authLinks
              : guestLinks
            : null}
        </Collapse>
      </Container>
    </Navbar>
  )
}

export default Toolbar
