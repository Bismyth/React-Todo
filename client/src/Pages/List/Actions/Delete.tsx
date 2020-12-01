import { ReactComponent as DeleteBtn } from 'Icons/delete-black-24dp.svg'
import { queryCache, useMutation } from 'react-query'
import axios from 'axios'
import './Button.css'

type DeleteProps = {
  id: string
  listId: string
}

const Delete: React.FC<DeleteProps> = ({ id, listId }) => {
  const [deleteByID] = useMutation(
    async () => {
      const { data } = await axios({
        method: 'delete',
        url: `api/lists/${listId}`,
        data: { id }
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
    <DeleteBtn
      className='icon'
      onClick={() => {
        deleteByID()
      }}
    />
  )
}

export default Delete
