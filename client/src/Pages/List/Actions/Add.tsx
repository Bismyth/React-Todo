import { Fragment, useState } from 'react'
import { ReactComponent as AddBtn } from 'Icons/add_task-black-24dp.svg'
import FormModal from './FormModal'
import './Button.css'
import { queryCache, useMutation } from 'react-query'
import axios from 'axios'

type AddProps = {
  listId: string
}

type newTask = {
  name: string
  description: string
}

const Add = ({ listId }: AddProps) => {
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(v => !v)
  }
  const [upload] = useMutation(
    async (values: newTask) => {
      const { data } = await axios({
        method: 'post',
        data: values,
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
      <AddBtn
        className='icon'
        style={{ height: '30px', width: '30px' }}
        onClick={toggle}
      />
      <FormModal
        upload={upload}
        modal={modal}
        toggle={toggle}
        name='Add Task'
        initialValues={{
          name: '',
          description: ''
        }}
      />
    </Fragment>
  )
}

export default Add
