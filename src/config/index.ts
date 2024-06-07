const replaceInOrigin = (oldValue: string, newValue: string) =>
  location.origin.replace(oldValue, newValue);

export const BASE_URL = replaceInOrigin('shop', 'api');
export const DOCS_URL = replaceInOrigin('shop', 'docs');
export const FORUM_URL = replaceInOrigin('shop.', '');
