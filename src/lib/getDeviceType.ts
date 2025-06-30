const getDeviceType = () => {
  const ua = navigator.userAgent
  const deviceMap: Record<string, RegExp> = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
    desktop: /Macintosh|Windows NT|Linux x86_64/i
  }

  for (const type in deviceMap) {
    if (deviceMap[type].test(ua)) return type
  }

  return 'desktop' // fallback
}

export default getDeviceType
