// Reads a browser File into a small, storable record — base64 data URL
// plus metadata — so it can live inside a diary entry in localStorage.
// Keeps images' natural dimensions so the PDF export can scale thumbnails.

const MAX_FILE_BYTES = 4 * 1024 * 1024 // 4MB per file — keep localStorage sane

export function fileToDocument(file) {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error(`"${file.name}" is over 4MB — too large to store in the browser.`))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error(`Could not read "${file.name}".`))
    reader.onload = () => {
      const dataUrl = reader.result
      const base = {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        dataUrl,
        addedAt: Date.now(),
      }

      if (file.type.startsWith('image/')) {
        const img = new Image()
        img.onload = () => resolve({ ...base, width: img.naturalWidth, height: img.naturalHeight })
        img.onerror = () => resolve(base)
        img.src = dataUrl
      } else {
        resolve(base)
      }
    }
    reader.readAsDataURL(file)
  })
}
