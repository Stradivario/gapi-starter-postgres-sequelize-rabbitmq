export const CREATE_USER_MUTATION = `
mutation addUser($username: String!, $userType: String!) {
  addUser(username: $username, userType: $userType) {
    id
    username
    userType
  }
}
`;
