import * as core from '@actions/core'
import { download } from './download'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const platforms = core.getMultilineInput('platforms') as Platform[]
    const version = core.getInput('version') as Version

    await download(platforms, version)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
