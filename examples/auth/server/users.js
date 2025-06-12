export { getUser }
export { checkCredentials }

const users = [
  {
    fullName: 'Alan Turing',
    username: 'turing',
    password: "I'm the creator of the Turing Machine",
    isAdmin: true,
  },
  {
    fullName: 'John von Neumann',
    username: 'neumann',
    password: "I'm the creator of the Von Neumann Architecture",
    isAdmin: false,
  },
]

function getUser(username) {
  const user = users.find((a) => a.username === username)
  return user
}

function checkCredentials(username, password) {
  const user = users.find((a) => a.username === username && a.password === password)
  return user
}
