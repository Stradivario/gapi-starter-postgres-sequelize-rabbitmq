export const REGISTER_MUTATION = `
mutation register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      id
      name
      credential(email: $email, password: $password) {
        id
        email
        password
      }
    }
  }
`;
