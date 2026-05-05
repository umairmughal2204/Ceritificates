/** Resolve a logo path or pass through data URLs / absolute URLs for <img src>. */
export function mediaUrl(pathOrData: string): string {
  if (!pathOrData) return ''
  if (
    pathOrData.startsWith('data:') ||
    pathOrData.startsWith('http://') ||
    pathOrData.startsWith('https://') ||
    pathOrData.startsWith('blob:')
  ) {
    return pathOrData
  }
  return pathOrData
}
