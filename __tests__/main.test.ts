/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let getMultilineInputMock: jest.SpiedFunction<typeof core.getMultilineInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

let downloadToolMock: jest.SpiedFunction<typeof tc.downloadTool>
let extractZipMock: jest.SpiedFunction<typeof tc.extractZip>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    getMultilineInputMock = jest
      .spyOn(core, 'getMultilineInput')
      .mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

    downloadToolMock = jest.spyOn(tc, 'downloadTool').mockImplementation()
    extractZipMock = jest.spyOn(tc, 'extractZip').mockImplementation()

    downloadToolMock.mockImplementation(async () => 'path/to/sdk.zip')
    extractZipMock.mockImplementation(async () => 'path/to/sdk')
  })

  it('downloads the nightly artifacts', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'version':
          return 'nightly'
        default:
          return ''
      }
    })

    getMultilineInputMock.mockImplementation(name => {
      switch (name) {
        case 'platforms':
          return ['x64-windows', 'arm64-osx']
        default:
          return []
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      'Retrieving artifacts from GitHub Actions'
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      2,
      'path',
      expect.stringContaining('sdk')
    )
    expect(errorMock).not.toHaveBeenCalled()
  }, 10000)

  it('sets a failed status on unknown platform', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'version':
          return 'nightly'
        default:
          return ''
      }
    })

    getMultilineInputMock.mockImplementation(name => {
      switch (name) {
        case 'platforms':
          return ['x86-windows', 'arm64-osx']
        default:
          return []
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      'Retrieving artifacts from GitHub Actions'
    )
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'No x86-windows nightly build found'
    )
  })
})
