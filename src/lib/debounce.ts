let debounceTimer: ReturnType<typeof setTimeout> | null = null

export default function debounce(callback: any, time: number): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    callback()
    debounceTimer = null
  }, time)
}
