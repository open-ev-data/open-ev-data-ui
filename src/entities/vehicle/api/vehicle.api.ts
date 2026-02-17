import { API_ENDPOINTS } from '@/shared/config/env';
import type { VehicleDataset } from '../model/vehicle.types';

interface GitHubRelease {
  tag_name: string;
  assets: {
    name: string;
    browser_download_url: string;
  }[];
}

/**
 * Fetches the latest release tag from GitHub.
 */
export async function fetchLatestReleaseTag(): Promise<string> {
  const response = await fetch(API_ENDPOINTS.LATEST_RELEASE, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch latest release: ${response.statusText}`);
  }

  const data = (await response.json()) as GitHubRelease;
  return data.tag_name;
}

/**
 * Fetches the vehicle dataset for a specific tag.
 * @param tag - Release tag (e.g. "v1.24.0")
 */
export async function fetchDataset(tag: string): Promise<VehicleDataset> {
  const assetUrl = `${API_ENDPOINTS.DOWNLOAD_BASE}/${tag}/open-ev-data-${tag}.json`;

  const response = await fetch(assetUrl);

  if (!response.ok) {
    throw new Error(`Failed to download dataset for tag ${tag}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Orchestrates the fetching of the latest vehicle dataset.
 *
 * In Production (GitHub Pages):
 * Fetches 'dataset.json' which is downloaded during the build process.
 * This avoids CORS issues as the file is served from the same origin.
 *
 * In Development (Local):
 * Fetches the latest tag via API proxy and downloads via release proxy.
 */
export async function fetchLatestVehicles(): Promise<VehicleDataset> {
  if (import.meta.env.PROD) {
    // Fetch local file bundled during deploy
    const response = await fetch(`${import.meta.env.BASE_URL}dataset.json`);

    if (!response.ok) {
      throw new Error(`Failed to load production dataset: ${response.statusText}`);
    }

    return response.json();
  }

  // Development flow using proxies
  const tag = await fetchLatestReleaseTag();
  return fetchDataset(tag);
}
