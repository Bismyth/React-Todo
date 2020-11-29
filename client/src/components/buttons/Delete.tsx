import { ReactComponent as DeleteBtn } from '../../icons/delete-black-24dp.svg'
import { setData } from '../Types'
import './Button.css'

type DeleteProps = {
  setData: setData
  id: string
}

const Delete = ({ setData, id }: DeleteProps) => {
  const deleteByID = (id: string) => {
    setData(v => {
      return v.filter(i => i.id !== id)
    })
  }
  return (
    <DeleteBtn
      className='icon'
      onClick={() => {
        deleteByID(id)
      }}
    />
  )
}

export default Delete
