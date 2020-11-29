export type task = {
  id: string
  name: string
  description: string
  dateCreated: number
  completed: boolean
  dateCompleted: number
}

export type setData = React.Dispatch<React.SetStateAction<task[]>>
