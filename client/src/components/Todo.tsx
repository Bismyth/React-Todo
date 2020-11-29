import { useState } from 'react'
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
  ModalHeader
} from 'reactstrap'
import { v4 as uuid } from 'uuid'
import { task } from './Types'
import { useQuery } from 'react-query'
import axios from 'axios'
import initialData from './data.json'

import Done from './buttons/Done'
import Delete from './buttons/Delete'
import Edit from './buttons/Edit'
import Add from './buttons/Add'

const Todo = () => {
  const [data, setData] = useState(
    initialData.map(v => {
      return { ...v, id: uuid() }
    })
  )
  const { data: serverData, isLoading } = useQuery('test', async () => {
    const { data } = await axios({
      url: `/api/test`,
      method: 'GET'
    })
    return data
  })
  const [modalTask, setModalTask] = useState<task | undefined>(undefined)
  const [modal, setModal] = useState(false)
  const [showCompleted, setShowCompleted] = useState(true)
  const toggle = (e?: React.MouseEvent<any, MouseEvent>, id?: string) => {
    if (id) setModalTask(data.filter(v => v.id === id)[0])
    setModal(v => !v)
  }
  const toggleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowCompleted(event.target.checked)
  }
  return (
    <Container>
      <div className='d-flex align-items-center'>
        <h1 className='mt-2'>Todo App</h1>
        <span className='ml-auto'>
          <Add setData={setData} />
        </span>
      </div>
      <div className='ml-auto mb-4'>
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
      </div>
      <div>{!isLoading ? <p>{serverData.msg}</p> : null}</div>
      <ListGroup>
        {data
          .filter(v => {
            if (v.completed) return showCompleted
            else return true
          })
          .sort(
            (a, b) =>
              +b.completed - +a.completed || a.name.localeCompare(b.name)
          )
          .map(v => (
            <ListGroupItem
              key={v.id}
              className='d-flex'
              color={v.completed ? 'success' : ''}
            >
              <Done setData={setData} id={v.id} completed={v.completed} />
              <a
                href='#'
                onClick={e => {
                  toggle(e, v.id)
                }}
                className='text-dark'
              >
                {v.name}
              </a>
              <span className='ml-auto d-flex'>
                <Edit setData={setData} task={v} />
                <Delete setData={setData} id={v.id} />
              </span>
            </ListGroupItem>
          ))}
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
                  {modalTask
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

export default Todo
