import AccessMethodsRequest from '../accessMethodsRequest'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('AccessMethodsRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new AccessMethodsRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
    expect(request.searchPath).toEqual('access_methods')
  })
})

describe('AccessMethodsRequest#permittedCmrKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new AccessMethodsRequest()

    expect(request.permittedCmrKeys()).toEqual([
      'associations',
      'collection_id',
      'collection_provider',
      'tags'
    ])
  })
})
