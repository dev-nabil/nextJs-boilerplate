'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/use-auth'
import getUserLocationInfo, { extractCity } from '@/lib/googleInformation'
import { Briefcase, DollarSign, Loader2, MapPin, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function GeolocationComponent() {
  const { user } = useAuth()
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
    locationName?: string
  } | null>(null)

  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showBenefitsDialog, setShowBenefitsDialog] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [userType, setUserType] = useState<'seller' | 'buyer'>(user?.user?.role?.name || 'buyer')

  // Check existing permission status
  async function checkPermission() {
    if (!navigator.permissions) return 'unknown'

    try {
      const status = await navigator.permissions.query({ name: 'geolocation' })
      return status.state === 'granted' ? 'granted' : 'denied'
    } catch (error) {
      console.error('Permission API error:', error)
      return 'unknown'
    }
  }

  // Get user location
  function requestLocation() {
    setIsLoading(true)
    setLocationError(null)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      })
    } else {
      setLocationError('Geolocation is not supported by your browser.')
      setIsLoading(false)
    }
  }

  function showPosition(position: GeolocationPosition) {
    const { latitude, longitude } = position.coords
    setIsLoading(false)
    setPermissionStatus('granted')
    setShowBenefitsDialog(false)
    setShowSuccessMessage(true)

    // Fetch location name from coordinates
    getUserLocationInfo(Number(latitude), Number(longitude)).then(results => {
      if (results) {
        const locationName = extractCity(results)

        const updatedLocation = { latitude, longitude, locationName }

        setUserLocation(updatedLocation)
        localStorage.setItem('userLocation', JSON.stringify(updatedLocation))
      } else {
        const fallbackLocation = { latitude, longitude }
        setUserLocation(fallbackLocation)
        localStorage.setItem('userLocation', JSON.stringify(fallbackLocation))
      }
    })

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  function showError(error: GeolocationPositionError) {
    let errorMessage = ''
    localStorage.removeItem('userLocation')

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access was denied. You can enable it later in your browser settings.'
        setPermissionStatus('denied')
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is currently unavailable.'
        break
      case error.TIMEOUT:
        errorMessage = 'The request to get location timed out. Please try again.'
        break
      default:
        errorMessage = 'An unknown error occurred while getting your location.'
        break
    }

    setLocationError(errorMessage)
    setIsLoading(false)
    setShowBenefitsDialog(false)
  }

  // Handle user agreeing to share location
  const handleAllowLocation = () => {
    requestLocation()
  }

  const handleDismissDialog = () => {
    setShowBenefitsDialog(false)
    localStorage.setItem('locationDialogDismissed', 'true')
  }

  useEffect(() => {
    const initializeLocation = async () => {
      // Check if dialog was previously dismissed
      const dialogDismissed = localStorage.getItem('locationDialogDismissed')

      // Check for cached location
      const cachedLocation = localStorage.getItem('userLocation')
      if (cachedLocation) {
        try {
          const location = JSON.parse(cachedLocation)
          setUserLocation(location)
        } catch (e) {
          console.error('Failed to parse cached location', e)
        }
      }

      // Check permission status
      const status = await checkPermission()
      setPermissionStatus(status)

      // Only show dialog if we don't have permission or location and it wasn't dismissed
      if (status !== 'granted' && !cachedLocation && !dialogDismissed) {
        const count = Number(localStorage.getItem('locationDialogNotNowCount') || '0') + 1
        if (count == 5) {
          // Small delay for better UX
          setTimeout(() => setShowBenefitsDialog(true), 1500)
        } else {
          localStorage.setItem('locationDialogNotNowCount', count.toString())
        }
      }
      //  else if (status === 'granted' && !cachedLocation) {
      //   // If permission granted but no location, fetch it
      //   requestLocation()
      // }
      if (status === 'granted') {
        requestLocation()
      }
    }

    initializeLocation()
  }, [])

  // ⏱️ Live tracking when permission is granted
  useEffect(() => {
    let watchId: number

    if (permissionStatus === 'granted') {
      watchId = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords
          const newCoords = { latitude, longitude }

          getUserLocationInfo(Number(latitude), Number(longitude)).then(results => {
            const locationName = results ? extractCity(results) : undefined
            const newLocation = { ...newCoords, locationName }

            const prev = localStorage.getItem('userLocation')
            const prevLocation = prev ? JSON.parse(prev) : null

            const changed = !prevLocation || prevLocation.latitude !== latitude || prevLocation.longitude !== longitude

            if (changed) {
              setUserLocation(newLocation)
              localStorage.setItem('userLocation', JSON.stringify(newLocation))
            }
          })
        },
        error => {
          console.error('Error watching position:', error)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000
        }
      )
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [permissionStatus])

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Success Message */}
      {/* {showSuccessMessage && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Location enabled successfully! You can now see local opportunities.
          </AlertDescription>
        </Alert>
      )} */}

      {/* Benefits Dialog */}
      <Dialog open={showBenefitsDialog} onOpenChange={setShowBenefitsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              {userType === 'seller' ? 'Find Local Opportunities' : 'Discover Local Talent'}
            </DialogTitle>
            <DialogDescription>
              {userType === 'seller'
                ? 'Enable location services to discover the best freelance opportunities near you'
                : 'Enable location services to find skilled professionals in your area'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-3">
              {userType === 'seller' ? (
                <>
                  <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Local Projects</p>
                      <p className="text-muted-foreground text-xs">Find clients in your area</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Networking Events</p>
                      <p className="text-muted-foreground text-xs">Connect with local professionals</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Higher Rates</p>
                      <p className="text-muted-foreground text-xs">Local projects often pay more</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Local Talent</p>
                      <p className="text-muted-foreground text-xs">Find skilled freelancers nearby</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Meet in Person</p>
                      <p className="text-muted-foreground text-xs">Option for face-to-face collaboration</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-3">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Support Local</p>
                      <p className="text-muted-foreground text-xs">Help your local economy grow</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <div className="w-full space-y-2">
              <Button onClick={handleAllowLocation} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Enable Location Services
                  </>
                )}
              </Button>

              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Track how many times "Not Now" is clicked
                    const count = Number(localStorage.getItem('locationDialogNotNowCount') || '0') + 1
                    if (count == 5) {
                      localStorage.setItem('locationDialogNotNowCount', '0')
                    } else {
                      localStorage.setItem('locationDialogNotNowCount', count.toString())
                    }
                    setShowBenefitsDialog(false)
                    // If user has clicked "Not Now" 5 times, set a flag to suppress the modal
                  }}
                  className="flex-1"
                >
                  Not Now
                </Button>
                <Button variant="ghost" onClick={handleDismissDialog} className="flex-1">
                  Don't Show Again
                </Button>
              </div>
            </div>
          </DialogFooter>

          <p className="text-muted-foreground mt-4 text-center text-xs">
            🔒 We respect your privacy. Your location is only used to show relevant {userType === 'seller' ? 'opportunities' : 'talent'}.
          </p>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="grid gap-6">
        {/* {userLocation ? (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Location Services Enabled
              </CardTitle>
              <CardDescription className="text-green-700">
                You're all set to discover local opportunities and connect with nearby clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <MapPin className="mr-1 h-3 w-3" />
                  Location Active
                </Badge>
                <span className="text-sm text-green-700">
                  Coordinates: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Discover Local Opportunities
              </CardTitle>
              <CardDescription>
                {userType === 'seller'
                  ? 'Enable location services to find freelance projects, clients, and networking events in your area.'
                  : 'Enable location services to discover talented freelancers and service providers near you.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowBenefitsDialog(true)} className="w-full sm:w-auto">
                <MapPin className="mr-2 h-4 w-4" />
                Enable Location Services
              </Button>
            </CardContent>
          </Card>
        )} */}

        {/* Error Message */}
        {/* {locationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{locationError}</span>
              <Button variant="outline" size="sm" onClick={() => setShowBenefitsDialog(true)} className="ml-4">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )} */}

        {/* Feature Cards */}
        {/* <div className="grid gap-4 md:grid-cols-3">
          {userType === 'seller' ? (
            <>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Briefcase className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                  <h3 className="mb-1 font-semibold">Local Projects</h3>
                  <p className="text-muted-foreground text-sm">Find clients who prefer working with local freelancers</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <h3 className="mb-1 font-semibold">Networking</h3>
                  <p className="text-muted-foreground text-sm">Connect with professionals and attend local events</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <DollarSign className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                  <h3 className="mb-1 font-semibold">Better Rates</h3>
                  <p className="text-muted-foreground text-sm">Local projects often offer competitive compensation</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                  <h3 className="mb-1 font-semibold">Local Talent</h3>
                  <p className="text-muted-foreground text-sm">Access skilled professionals in your area</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <MapPin className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <h3 className="mb-1 font-semibold">Meet in Person</h3>
                  <p className="text-muted-foreground text-sm">Option for face-to-face project discussions</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <DollarSign className="mx-auto mb-2 h-8 w-8 text-orange-600" />
                  <h3 className="mb-1 font-semibold">Support Local</h3>
                  <p className="text-muted-foreground text-sm">Contribute to your local business ecosystem</p>
                </CardContent>
              </Card>
            </>
          )}
        </div> */}
      </div>
    </div>
  )
}
