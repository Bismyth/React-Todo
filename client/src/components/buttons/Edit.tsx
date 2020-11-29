import { Fragment, useState } from 'react'
import { ReactComponent as EditBtn } from '../../icons/edit-black-24dp.svg'
import { setData, task } from '../Types'
import FormModal from './FormModal'
import './Button.css'

type EditProps = {
  setData: setData
  task: task
}

const Delete = ({ setData, task }: EditProps) => {
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }
  return (
    <Fragment>
      <EditBtn className='icon mr-1' onClick={toggle} />
      <FormModal
        setData={setData}
        modal={modal}
        toggle={toggle}
        name='Edit Task'
        initialValues={{
          name: task.name,
          description: task.description
        }}
        id={task.id}
      />
    </Fragment>
  )
}

export default Delete
