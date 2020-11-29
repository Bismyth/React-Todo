import { ReactComponent as DoneBtn } from '../../icons/done-black-24dp.svg'
import { setData } from '../Types'
import './Button.css'

type DoneProps = {
  setData: setData
  id: string
  completed: boolean
}

const Done = ({ setData, id, completed }: DoneProps) => {
  const completeByID = (id: string) => {
    setData(v => {
      return v.map(i => {
        if (i.id === id) {
          return {
            ...i,
            completed: !completed,
            dateCompleted: !completed ? Date.now() : 0
          }
        } else {
          return i
        }
      })
    })
  }
  return (
    <DoneBtn
      className='icon mr-1'
      style={{ fill: `var(--${completed ? 'danger' : 'success'})` }}
      onClick={() => {
        completeByID(id)
      }}
    />
  )
}

export default Done
