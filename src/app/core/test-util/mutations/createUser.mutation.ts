export const CREATE_USER_MUTATION = `
mutation addUser($username: String!, $type: String!) {
  addUser(username: $username, type: $type) {
    id
    username
    type
  }
}
`;
