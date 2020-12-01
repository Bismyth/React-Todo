import express from 'express'
import List, { IList, ITask } from '../models/list.model'
import isAuthenticated from '../middleware/auth'
import { Schema, Types } from 'mongoose'

const router = express.Router()

interface PassportUser {
  id: Schema.Types.ObjectId
  username: string
}

router.get('/', isAuthenticated, (req, res) => {
  const user = req.user as PassportUser
  List.find({ userId: user.id }, (err, doc) => {
    if (err) throw err
    res.json(doc)
  }).select('name')
})

router.post('/', isAuthenticated, (req, res) => {
  const user = req.user as PassportUser
  const newList = new List({
    name: req.body.name,
    userId: user.id
  })
  newList.save((err, list) => {
    if (err) throw err
    res.json({ msg: 'List created', list })
  })
})

router.get('/:id', isAuthenticated, (req, res) => {
  const user = req.user as PassportUser
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(422).json({ msg: 'Please provide valid id.' })
  if ((req.params.id as unknown) as Schema.Types.ObjectId)
    List.findById(req.params.id, (err, doc) => {
      if (err) throw err
      if (doc?.userId != user.id) return res.sendStatus(401)
      res.json(doc)
    })
})

router.post('/:id', isAuthenticated, (req, res) => {
  const user = req.user as PassportUser
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(422).json({ msg: 'Please provide valid id.' })
  List.findById(req.params.id, (err, doc) => {
    if (err) throw err
    if (doc?.userId != user.id) return res.sendStatus(401)
    const task = req.body as ITask
    doc.tasks.push(task)
    List.findByIdAndUpdate(doc._id, { tasks: doc.tasks }, (err, doc) => {
      if (err) throw err
      res.json({ msg: 'New Task added' })
    })
  })
})

router.put('/:id', isAuthenticated, (req, res) => {
  const user = req.user as PassportUser
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(422).json({ msg: 'Please provide valid id.' })
  List.findById(req.params.id, (err, doc) => {
    if (err) throw err
    if (doc?.userId != user.id) return res.sendStatus(401)
    const taskIndex = doc.tasks.findIndex(v => v._id == req.body._id)

    if (req.body.type == 'edit') {
      console.log(doc.tasks[taskIndex])
      doc.tasks[taskIndex].name = req.body.name
      doc.tasks[taskIndex].description = req.body.description
      console.log(doc.tasks[taskIndex])
    } else if (req.body.type == 'done') {
      doc.tasks[taskIndex].completed = !doc.tasks[taskIndex].completed
      doc.tasks[taskIndex].dateCompleted = doc.tasks[taskIndex].completed
        ? new Date(Date.now())
        : undefined
    } else {
      return res.sendStatus(422)
    }

    List.findByIdAndUpdate(req.params.id, { tasks: doc.tasks }, (err, doc) => {
      if (err) throw err
      res.json({ msg: 'Update successful' })
    })
  })
})

router.delete('/:id', isAuthenticated, (req, res) => {
  const user = req.user as PassportUser
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(422).json({ msg: 'Please provide valid list id.' })
  List.findById(req.params.id, (err, doc) => {
    if (err) throw err
    if (doc?.userId != user.id) return res.sendStatus(401)
    if (!Types.ObjectId.isValid(req.body.id))
      return res.status(422).json({ msg: 'Please provide valid id.' })
    doc.tasks.splice(
      doc.tasks.findIndex(v => v._id == req.body.id),
      1
    )
    List.findByIdAndUpdate(req.params.id, { tasks: doc.tasks }, err => {
      if (err) throw err
      res.json({ msg: 'Delete Successful' })
    })
  })
})

export default router
