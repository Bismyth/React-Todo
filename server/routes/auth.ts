import express from 'express'
import passport from 'passport'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import isAuthenticated from '../middleware/auth'

const router = express.Router()

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err
    if (!user) res.status(422).json({ msg: 'Invalid Username/Password' })
    else {
      req.logIn(user, err => {
        if (err) throw err
        res.json({ msg: 'Success', user })
      })
    }
  })(req, res, next)
})

router.post('/register', (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) console.error(err)
    if (doc) res.status(422).json({ msg: 'Username is taken' })
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUser = new User({
      username: req.body.username,
      password: hashedPassword
    })
    await newUser.save()
    req.logIn(newUser, err => {
      if (err) throw err
      res.json({ msg: 'User Created', user: newUser })
    })
  })
})

router.get('/logout', isAuthenticated, (req, res) => {
  req.logOut()
  res.json({ msg: 'success' })
})

router.get('/user', (req, res) => {
  res.json({ user: req.user })
})

export default router
