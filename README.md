# Setup Amplitude Audio SDK - GitHub Action

[![GitHub Super-Linter](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/check-dist.yml/badge.svg)](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This GitHub Action helps you download and install Amplitude Audio SDK binaries
in your pipelines. It is mainly helpful for plugins and projects that use
Amplitude and need it at compile time in their GitHub Action based CI/CD
workflows.

## Usage

To include the action in a workflow, you can use the `uses` syntax with the `@`
symbol to reference a specific branch, tag, or commit hash.

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Test Local Action
    id: setup-sdk
    uses: AmplitudeAudio/action-setup-sdk@v1
    with:
      platforms: | # The list of platforms you want to install
        x64-windows
        x64-linux
        x64-osx
      version: nightly # The SDK version to install
      install-dir: ./amplitude_audio # Where to install the SDK. Can be relative or absolute
      config: release # The SDK build configuration to install. Either release or debug
    env:
      # This is mandatory, as the action will make use of GitHub APIs to fetch and download the SDK
      # from the settings you provided.
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  - name: Print SDK Install Path
    id: output
    run: echo "${{ steps.setup-sdk.outputs.path }}" # The action outputs the install dir in a `path` field
```

## License

Copyright © Sparky Studios. Licensed under the MIT License.
