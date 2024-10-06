import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { snake } from 'radash'

export async function download(
  platforms: Platform[],
  version: Version
): Promise<void> {
  if (version === 'nightly') {
    return downloadNightly(platforms)
  }

  throw new Error(`Unsupported version: ${version}`)
}

async function downloadNightly(platforms: Platform[]): Promise<void> {
  const artifactsUrl =
    'https://api.github.com/repos/AmplitudeAudio/sdk/actions/artifacts'

  core.debug('Retrieving artifacts from GitHub Actions')
  const response = await fetch(artifactsUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch artifacts: ${response.status}`)
  }

  let { artifacts } = (await response.json()) as {
    total_count: number
    artifacts: Artifact[]
  }

  artifacts = artifacts.filter(
    artifact =>
      artifact.workflow_run.head_branch === 'develop' &&
      artifact.expired === false
  )

  for (const platform of platforms) {
    const artifact = artifacts.find(artifact =>
      artifact.name.includes(platform)
    )

    if (artifact === undefined) {
      throw new Error(`No ${platform} nightly build found`)
    }

    const downloadUrl = artifact.archive_download_url
    const downloadedPath = await tc.downloadTool(downloadUrl)
    const extractedFolder = await tc.extract7z(downloadedPath)

    core.addPath(extractedFolder)
    core.info(`Downloaded ${platform} nightly build to ${extractedFolder}`)

    core.setOutput(`${snake(platform)}_nightly`, extractedFolder)
  }
}
