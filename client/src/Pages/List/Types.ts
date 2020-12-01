export type task = {
  _id: string
  name: string
  description: string
  dateCreated: Date
  completed: boolean
  dateCompleted?: Date
}

export type setData = React.Dispatch<React.SetStateAction<task[]>>
