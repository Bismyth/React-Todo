import React, { useContext, useState } from 'react'
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  NavbarText,
  Container
} from 'reactstrap'
import { UserContext } from '../Context'

import Logout from './auth/Logout'
import UserForm from './auth/UserForm'

const Toolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const auth = useContext(UserContext)

  const toggle = () => {
    setIsOpen(v => !v)
  }
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
        <NavbarBrand href='/' style={{ fontSize: '1.5rem' }}>
          Todo App
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          {auth.isAuthenticated ? authLinks : guestLinks}
        </Collapse>
      </Container>
    </Navbar>
  )
}

export default Toolbar
