import axios from 'axios'
import { ReactComponent as DoneBtn } from 'Icons/done-black-24dp.svg'
import { queryCache, useMutation } from 'react-query'
import { task } from '../Types'
import './Button.css'

type DoneProps = {
  listId: string
  task: task
}

const Done: React.FC<DoneProps> = ({ task, listId }: DoneProps) => {
  const [completeByID] = useMutation(
    async () => {
      axios({
        method: 'put',
        url: `/api/lists/${listId}`,
        data: { _id: task._id, type: 'done' }
      })
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries('list')
      }
    }
  )
  return (
    <DoneBtn
      className='icon mr-1'
      style={{ fill: `var(--${task.completed ? 'danger' : 'success'})` }}
      onClick={() => {
        completeByID()
      }}
    />
  )
}

export default Done
