import User from './models/user.model'
import bcrypt from 'bcryptjs'
import { Strategy as localStrategy } from 'passport-local'
import { PassportStatic } from 'passport'

export default (passport: PassportStatic) => {
  passport.use(
    new localStrategy((username: string, password: string, done: Function) => {
      User.findOne({ username }, (err, user) => {
        if (err) throw err
        if (!user) return done(null, false)
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) throw err
          //if password matches return user
          if (res) return done(null, user)
          //else no user
          return done(null, false)
        })
      })
    })
  )
  passport.serializeUser<any, any>((user, cb) => {
    cb(null, user.id)
  })
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      if (!user) cb(err)
      else cb(err, { username: user.username })
    })
  })
}
