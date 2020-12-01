import mongoose, { Schema, Document } from 'mongoose'

export interface ITask extends Document {
  name: string
  description?: string
  dateCreated: Date
  completed: boolean
  dateCompleted?: Date
}

export interface IList extends Document {
  name: string
  dateCreated: Date
  tasks: [ITask]
  userId: Schema.Types.ObjectId
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: String,
  dateCreated: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  dateCompleted: Date
})

const ListSchema: Schema = new Schema({
  name: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  tasks: [TaskSchema],
  userId: { type: Schema.Types.ObjectId, required: true }
})

// Export the model and return your IUser interface
export default mongoose.model<IList>('List', ListSchema)
