- auth
  post /signup
  post /login
  post /logout

- Profile router
  GET /profile/view
  PATCH /profile/edit
  Patch /profile/password

- connection request managment
  POST /request/send/interested/:userID
  POST /request/send/ignored/:userId
  POST /request/review/accepted/:requestID
  POST /request/review/rejected/:requestID

- user router
  GET /user/requests
  GET /user/connection
  GET /user/feed
