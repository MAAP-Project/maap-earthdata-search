// import nock from 'nock'
import CwicGranuleRequest from '../cwicGranuleRequest'
import {
  singleCwicGranuleResponse,
  singleCwicGranuleResponseWithImage,
  multipleCwicGranulesResponse
} from './mocks'


beforeEach(() => {
  jest.clearAllMocks()
})

describe('CwicGranuleRequest#transformRequest', () => {
  describe('when logged out', () => {
    test('returns a basic example result correctly transformed', () => {
      const cwicRequest = new CwicGranuleRequest()

      const transformedData = cwicRequest.transformRequest({
        echoCollectionId: 'TEST_COLLECTION_ID'
      }, {})

      expect(transformedData).toEqual('{"params":{"echo_collection_id":"TEST_COLLECTION_ID"}}')
    })

    test('returns only permitted keys correctly transformed', () => {
      const cwicRequest = new CwicGranuleRequest()

      const transformedData = cwicRequest.transformRequest({
        echoCollectionId: 'TEST_COLLECTION_ID',
        nonPermittedKey: 'NOPE'
      }, {})

      expect(transformedData).toEqual('{"params":{"echo_collection_id":"TEST_COLLECTION_ID"}}')
    })
  })

  describe('when logged in', () => {
    test('returns a basic example result correctly transformed', () => {
      const cwicRequest = new CwicGranuleRequest('authToken')
      cwicRequest.startTime = 1576855756


      const transformedData = cwicRequest.transformRequest({
        echoCollectionId: 'TEST_COLLECTION_ID'
      }, {})

      expect(transformedData).toEqual('{"params":{"echo_collection_id":"TEST_COLLECTION_ID"}}')
    })

    test('returns only permitted keys correctly transformed', () => {
      const cwicRequest = new CwicGranuleRequest('authToken')
      cwicRequest.startTime = 1576855756


      const transformedData = cwicRequest.transformRequest({
        echoCollectionId: 'TEST_COLLECTION_ID',
        nonPermittedKey: 'NOPE'
      }, {})

      expect(transformedData).toEqual('{"params":{"echo_collection_id":"TEST_COLLECTION_ID"}}')
    })
  })
})

describe('CwicGranuleRequest#transformResponse', () => {
  test('formats single granule results correctly', () => {
    const cwicRequest = new CwicGranuleRequest()

    const transformedResponse = cwicRequest.transformResponse(singleCwicGranuleResponse)

    const { feed } = transformedResponse
    expect(Object.keys(feed)).toEqual(expect.arrayContaining(['entry', 'hits']))

    const { entry } = feed
    expect(entry).toBeInstanceOf(Array)
    expect(entry.length).toEqual(1)
  })

  test('appends additional keys to each granule necessary to match CMR', () => {
    const cwicRequest = new CwicGranuleRequest()

    const transformedResponse = cwicRequest.transformResponse(singleCwicGranuleResponse)

    const { feed } = transformedResponse
    const { entry } = feed

    const granuleKeys = Object.keys(entry[0])
    expect(granuleKeys).toEqual(expect.arrayContaining(['browse_flag', 'thumbnail']))
  })

  test('formats multi-granule results correctly', () => {
    const cwicRequest = new CwicGranuleRequest()

    const transformedResponse = cwicRequest.transformResponse(multipleCwicGranulesResponse)

    const { feed } = transformedResponse
    expect(Object.keys(feed)).toEqual(expect.arrayContaining(['entry', 'hits']))

    const { entry } = feed
    expect(entry).toBeInstanceOf(Array)
    expect(entry.length).toEqual(2)
  })

  describe('sets the full browse image correctly', () => {
    test('when the granule has no link', () => {
      const cwicRequest = new CwicGranuleRequest()

      const transformedResponse = cwicRequest
        .transformResponse(singleCwicGranuleResponse)

      const { feed } = transformedResponse
      const { entry } = feed
      expect(entry[0].browse_url)
        .toEqual(undefined)
    })

    test('when the granule has a link', () => {
      const cwicRequest = new CwicGranuleRequest()

      const transformedResponse = cwicRequest
        .transformResponse(singleCwicGranuleResponseWithImage)

      const { feed } = transformedResponse
      const { entry } = feed
      expect(entry[0].browse_url)
        .toEqual('https://uops.nrsc.gov.in//imgarchive/IRS1C/LISS/1996/NOV/14/083042LG.319.jpeg')
    })
  })
})

describe('CwicGranuleRequest#search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // TODO: Test that when we call our search method that the transformations actually get called
  // test('all transformations are called', async () => {
  //   nock('/localhost/')
  //     .post(/cwic/)
  //     .reply(200, {
  //       feed: {
  //         updated: '2019-03-27T20:21:14.705Z',
  //         entry: [{
  //           mockCollectionData: 'goes here'
  //         }]
  //       }
  //     })

  //   const cwicRequest = new CwicGranuleRequest()

  //   const transformRequestMock = jest.spyOn(cwicRequest, 'transformRequest')
  //     .mockImplementation(() => jest.fn(() => '{}'))

  //   const expectedResponse = {
  //     feed: {
  //       entry: [],
  //       hits: 0
  //     }
  //   }
  //   const transformResponseMock = jest.spyOn(cwicRequest, 'transformResponse')
  //     .mockImplementation(() => jest.fn(() => expectedResponse))

  //   cwicRequest.search({})

  //   expect(transformRequestMock).toHaveBeenCalledTimes(1)
  //   expect(transformResponseMock).toHaveBeenCalledTimes(1)
  // })
})
