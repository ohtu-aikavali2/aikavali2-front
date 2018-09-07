const mockRequest = async () => {
  await new Promise(res => setTimeout(res, 1000))
}

export default {
  mockRequest
}
