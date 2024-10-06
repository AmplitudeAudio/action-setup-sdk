type Platform =
  | 'arm64-osx'
  | 'x64-osx'
  | 'arm64-linux'
  | 'x64-linux'
  | 'x64-win'
  | 'arm64-win'
  | 'x64-mingw-static'

type Version = 'nightly' | 'latest' | `v${number}.${number}.${number}`

type Artifact = {
  id: number
  node_id: string
  name: string
  size_in_bytes: number
  url: string
  archive_download_url: string
  expired: boolean
  created_at: string
  updated_at: string
  expires_at: string
  workflow_run: {
    id: number
    repository_id: number
    head_repository_id: number
    head_branch: string
    head_sha: string
  }
}
