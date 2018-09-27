const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('pusher-chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:ee43a19a-add3-4346-a2c8-dddb6d27ee22',
  key: '76902c3d-3723-44a1-8479-9ae7bb3894e2:WGQonZgF5LXPMHwyQzCgXR6nxp7YM6FSLxazRULn4mo=',
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit
  .createUser({ 
  id: username, 
  name: username 
  })
  .then(() => res.sendStatus(201))
  .catch(error => {
    if (error.error_type === 'services/chatkit/user_already_exists') {
      res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  res.status(authData.status).send(authData.body)
})

const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
