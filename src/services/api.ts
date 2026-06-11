import type { ApiResponse, FeedStatus } from '../types';
import { API_BASE } from '../constants';

// Calls the /api/threats endpoint on our backend proxy server.
export async function fetchThreats(): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/api/threats`);  // sends a request to the backend API
  if (!response.ok) {
    throw new Error(`Server returned error ${response.status}`);
  }
  return response.json() as Promise<ApiResponse>;  
}

interface FeedStatusResponse {
  feeds: FeedStatus[];
  activeCount: number;
  offlineCount: number;
  totalCount: number;
  checkedAt: string;
}

// Calls the /api/feed-status endpoint.
// Returns the list of feed health statuses.
// Throws an error if the request fails.
export async function fetchFeedStatus(): Promise<FeedStatus[]> {
  const response = await fetch(`${API_BASE}/api/feed-status`);
  const data: FeedStatusResponse = await response.json();
  return data.feeds || [];
}