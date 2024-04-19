function getBaseURL() {
  return location.origin.replace('shop', 'api');
}

export const BASE_URL = getBaseURL();
