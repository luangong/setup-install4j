// eslint-disable-next-line
// @ts-nocheck
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { ExecOptions } from '@actions/exec/lib/interfaces';
import * as tc from '@actions/tool-cache';

type PlatformConfig = {
  osArch: string;
  extension: string;
  commands: string[];
  binDirectory: string;
  addToPath: boolean;
};

// The Linux and macOS virtual machines both run using password-less sudo.  When you need to execute
// commands or install tools that require more privileges than the current user, you can use sudo
// without needing to provide a password.
//
// Windows virtual machines are configured to run as administrators with User Account Control (UAC)
// disabled.
//
// https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#administrative-privileges

// We install install4j to a fixed directory rather than a major-version-dependent directory such as
// "/opt/install4j9" or "C:\Program Files\install4j9" to make life easier.

const platforms: {
  [platform: string]: PlatformConfig;
} = {
  win32: {
    osArch: 'windows-x64',
    extension: 'exe',
    commands: ['.\\<filename> -q -console -dir "C:\\Program Files\\install4j"'],
    binDirectory: 'C:\\Program Files\\install4j\\bin',
    addToPath: true,
  },
  linux: {
    osArch: 'linux-x64',
    extension: 'sh',
    commands: ['sudo bash <filename> -- -q -dir /opt/install4j'],
    binDirectory: '/opt/install4j/bin',
    addToPath: true,
  },
  darwin: {
    osArch: 'macos',
    extension: 'dmg',
    // Refer to https://github.com/Homebrew/brew/blob/master/Library/Homebrew/unpack_strategy/dmg.rb
    // for how to install an macOS application (*.app) inside a .dmg file.
    //
    // Note that the 'cp' command on macOS is different from the one from GNU coreutils where the
    // BSD 'cp' command accepts only '-R' but neither '-r' nor '--recursive'.
    commands: [
      'hdiutil attach <filename>',
      'cp -R /Volumes/install4j/install4j.app /Applications',
      'hdiutil detach /Volumes/install4j',
    ],
    binDirectory: '/Applications/install4j.app/Contents/Resources/app/bin',
    addToPath: true,
  },
};

const execOptions: ExecOptions = {
  silent: true,
  listeners: {
    stdout: (data: Buffer) => {
      core.info(data.toString().trim());
    },
    stderr: (data: Buffer) => {
      core.error(data.toString().trim());
    },
  },
};

/*
 * TODO:
 *
 * - get version and normalize
 * - compose download URL (for the specified OS)
 * - download installer
 * - run installer
 * - run install4jc to register with license
 * - add bin directory to PATH
 */

function downloadInstaller(platformConfig: PlatformConfig, version: string): Promise<string> {
  // https://download.ej-technologies.com/install4j/install4j_linux-x64_9_0_7.deb
  // https://download.ej-technologies.com/install4j/install4j_linux-x64_9_0_7.sh
  // https://download.ej-technologies.com/install4j/install4j_macos_9_0_7.dmg
  // https://download.ej-technologies.com/install4j/install4j_windows-x64_9_0_7.exe
  //
  // https://download.ej-technologies.com/install4j/install4j_linux-x64_10_0_4.deb
  // https://download.ej-technologies.com/install4j/install4j_linux-x64_10_0_4.sh
  // https://download.ej-technologies.com/install4j/install4j_macos_10_0_4.dmg
  // https://download.ej-technologies.com/install4j/install4j_windows-arm64_10_0_4.exe
  // https://download.ej-technologies.com/install4j/install4j_windows-x64_10_0_4.exe
  const baseUrl = 'https://download.ej-technologies.com/install4j';
  const versionUnderscores = version.replace(/\./g, '_');
  // eslint-disable-next-line
  const { osArch, extension } = platformConfig;
  // eslint-disable-next-line
  const filename = `install4j_${osArch}_${versionUnderscores}.${extension}`;
  const url = `${baseUrl}/${filename}`;
  // eslint-disable-next-line
  return tc.downloadTool(url, filename);
}

async function installInstall4j(platformConfig: PlatformConfig, path: string) {
  /*
   * Execute the platform-specific commands in order
   */
  // eslint-disable-next-line arrow-body-style, no-restricted-syntax
  for (const command of platformConfig.commands) {
    const interpolatedCommand = command.replace('<filename>', path);
    core.info(`Executing command: ${interpolatedCommand}`);
    try {
      // eslint-disable-next-line no-await-in-loop
      await exec.exec(interpolatedCommand, undefined, execOptions);
    } catch (err) {
      core.error((err as Error).message);
    }
  }

  if (platformConfig.addToPath) {
    core.addPath(platformConfig.binDirectory);
  }
}

function updateLicenseKey(
  platformConfig: PlatformConfig,
  version: string,
  license: string,
): Promise<number> {
  return exec.exec('install4jc', ['--license', license], execOptions);
}

(async () => {
  try {
    const version: string = core.getInput('version', { required: true });
    const license: string = core.getInput('license', { required: true });
    // const cache = core.getBooleanInput('cache');
    const platformConfig = platforms[process.platform];
    const path = await downloadInstaller(platformConfig, version);
    await installInstall4j(platformConfig, path);
    await updateLicenseKey(platformConfig, version, license);
  } catch (err) {
    core.setFailed((err as Error).message);
  }
})().catch(() => {});
