import React, { useContext, useState } from 'react'
import {
  Container,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Spinner,
  Nav,
  NavItem,
  NavLink,
  Alert
} from 'reactstrap'

import { task } from './Types'
import { useQuery } from 'react-query'
import axios from 'axios'

import Done from './Actions/Done'
import Delete from './Actions/Delete'
import Edit from './Actions/Edit'
import Add from './Actions/Add'
import AddList from './Actions/AddList'
import { UserContext } from 'App/Context'
import { Redirect } from 'react-router-dom'

type Lists = {
  _id: string
  name: string
}

const List: React.FC = () => {
  const auth = useContext(UserContext)
  const { data: lists, isLoading: listsLoading } = useQuery(
    'lists',
    async () => {
      const { data } = await axios({ method: 'get', url: '/api/lists' })
      return data
    },
    {
      onSuccess: data => {
        if (data.length === 0) setTab('')
        else setTab(data[0]._id)
      }
    }
  )
  const [tab, setTab] = useState<string>('')

  const { data, isLoading: listLoading } = useQuery(
    ['list', { id: tab }],
    async (key, { id }) => {
      const { data } = await axios({ method: 'get', url: `/api/lists/${id}` })
      return data
    },
    {
      enabled: tab
    }
  )

  const [modalTask, setModalTask] = useState<task | undefined>(undefined)
  const [modal, setModal] = useState(false)
  const [showCompleted, setShowCompleted] = useState(true)
  const toggle = (e?: React.MouseEvent<any, MouseEvent>, id?: string) => {
    if (id) setModalTask(data.tasks.filter((v: task) => v._id === id)[0])
    setModal(v => !v)
  }
  const toggleTab = (id: string) => {
    if (tab !== id) setTab(id)
  }
  const toggleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowCompleted(event.target.checked)
  }
  if (!auth.isAuthenticated && !auth.authLoading) return <Redirect to={'/'} />
  if (auth.authLoading || listsLoading) return <Spinner color='primary' />
  return (
    <Container>
      <Nav tabs>
        {lists.map(({ _id, name }: Lists) => (
          <NavItem key={_id}>
            <NavLink
              className={tab === _id ? 'active' : ''}
              onClick={() => {
                toggleTab(_id)
              }}
            >
              {name}
            </NavLink>
          </NavItem>
        ))}
        <AddList toggleTab={toggleTab} />
      </Nav>

      <ListGroup>
        {listLoading ? (
          <Spinner color='primary' />
        ) : lists.length === 0 ? (
          <Alert color='info'>
            Press the add button at the top to add a list.
          </Alert>
        ) : !data ? (
          <Alert color='danger'>List could not be loaded.</Alert>
        ) : (
          <>
            <div className='d-flex align-items-center'>
              <Add listId={data._id} />
              <span className='ml-auto'>
                <Label check>
                  <Input
                    type='checkbox'
                    className='ml-0 mr-2'
                    checked={showCompleted}
                    onChange={toggleCheck}
                    style={{ position: 'initial' }}
                  />
                  Show Completed Tasks
                </Label>
              </span>
            </div>
            {data.tasks
              .filter((v: task) => {
                if (v.completed) return showCompleted
                else return true
              })
              .sort(
                (a: task, b: task) =>
                  +b.completed - +a.completed || a.name.localeCompare(b.name)
              )
              .map((v: task) => (
                <ListGroupItem
                  key={v._id}
                  className='d-flex'
                  color={v.completed ? 'success' : ''}
                >
                  <Done listId={data._id} task={v} />
                  <Button
                    onClick={e => {
                      toggle(e, v._id)
                    }}
                    className='text-dark p-0 ml-1'
                    color='link'
                  >
                    {v.name}
                  </Button>
                  <span className='ml-auto d-flex'>
                    <Edit listId={data._id} task={v} />
                    <Delete id={v._id} listId={data._id} />
                  </span>
                </ListGroupItem>
              ))}
          </>
        )}
      </ListGroup>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {modalTask ? modalTask.name : ''}
        </ModalHeader>
        <ModalBody>
          <ListGroup>
            <ListGroupItem>
              <ListGroupItemHeading>Description:</ListGroupItemHeading>
              <ListGroupItemText>
                {modalTask ? modalTask.description : ''}
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading>Date Created:</ListGroupItemHeading>
              <ListGroupItemText>
                {modalTask
                  ? new Date(modalTask.dateCreated).toDateString()
                  : ''}
              </ListGroupItemText>
            </ListGroupItem>
            {modalTask && modalTask.completed ? (
              <ListGroupItem>
                <ListGroupItemHeading>Date Completed:</ListGroupItemHeading>
                <ListGroupItemText>
                  {modalTask.dateCompleted
                    ? new Date(modalTask.dateCompleted).toDateString()
                    : ''}
                </ListGroupItemText>
              </ListGroupItem>
            ) : null}
          </ListGroup>
        </ModalBody>
      </Modal>
    </Container>
  )
}

export default List
