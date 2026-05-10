/** Embedded certificate photos (data URLs) — keep under localStorage / JSON practical limits. */
export const MAX_FORM_IMAGE_BYTES = 4 * 1024 * 1024

export async function readFormImageAsDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (PNG, JPG, WebP, etc.).')
  }
  if (file.size > MAX_FORM_IMAGE_BYTES) {
    throw new Error(`Image must be under ${Math.round(MAX_FORM_IMAGE_BYTES / (1024 * 1024))} MB.`)
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') resolve(result)
      else reject(new Error('Could not read image.'))
    }
    reader.onerror = () => reject(new Error('Could not read image.'))
    reader.readAsDataURL(file)
  })
}
