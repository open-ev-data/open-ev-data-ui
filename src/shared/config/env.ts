/**
 * Environment configuration and type-safe environment variables.
 */

export const ENV = {
  GITHUB_API_URL: 'https://api.github.com',
  GITHUB_RAW_URL: 'https://github.com',
  REPO_OWNER: 'open-ev-data',
  REPO_NAME: 'open-ev-data-dataset',
} as const;

export const API_ENDPOINTS = {
  LATEST_RELEASE: `${ENV.GITHUB_API_URL}/repos/${ENV.REPO_OWNER}/${ENV.REPO_NAME}/releases/latest`,
  DOWNLOAD_BASE: `${ENV.GITHUB_RAW_URL}/${ENV.REPO_OWNER}/${ENV.REPO_NAME}/releases/download`,
} as const;
