import express from 'express'
import { Schema } from 'mongoose'

const isAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: Function
) => {
  if (req.isAuthenticated()) return next()
  else return res.status(401).json({ msg: 'Unauthorized' })
}

export default isAuthenticated
