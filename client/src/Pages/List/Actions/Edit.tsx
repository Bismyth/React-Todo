import { Fragment, useState } from 'react'
import { ReactComponent as EditBtn } from 'Icons/edit-black-24dp.svg'
import { task } from '../Types'
import FormModal from './FormModal'
import './Button.css'
import { queryCache, useMutation } from 'react-query'
import axios from 'axios'

type EditProps = {
  listId: string
  task: task
}

type newTask = {
  name: string
  description: string
}

const Delete: React.FC<EditProps> = ({ listId, task }) => {
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }
  const [upload] = useMutation(
    async (values: newTask) => {
      const { data } = await axios({
        method: 'put',
        data: { ...values, _id: task._id, type: 'edit' },
        url: `/api/lists/${listId}`
      })
      return data
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries('list')
      }
    }
  )
  return (
    <Fragment>
      <EditBtn className='icon mr-1' onClick={toggle} />
      <FormModal
        upload={upload}
        modal={modal}
        toggle={toggle}
        name='Edit Task'
        initialValues={{
          name: task.name,
          description: task.description
        }}
      />
    </Fragment>
  )
}

export default Delete
