export default {
  logout: jest.fn(() => Promise.resolve({ data: {} })),
  login: jest.fn(() => Promise.resolve({ data: {} })),
  getUser: jest.fn(() => Promise.resolve({ data: {} }))
}
