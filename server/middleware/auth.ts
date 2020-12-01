import express from 'express'

const isAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: Function
) => {
  if (req.isAuthenticated()) return next()
  else return res.status(401).json({ msg: 'Unauthorized' })
}

export default isAuthenticated
