'use client'

import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { useEffect } from 'react'

// import Autoplay from 'embla-carousel-autoplay';

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type CarouselDotsProps = {
  autoplayDelay?: number // Delay for autoplay in milliseconds
}
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
  autoplayDelay?: number
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollTo: (index: number) => void
} & CarouselProps

// Autoplay.globalOptions = { delay: 4000 };

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = 'horizontal', opts, setApi, plugins, autoplayDelay = 4000, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
        loop: true
      },

      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
      setSelectedIndex(api.selectedScrollSnap())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    const scrollTo = React.useCallback(
      (index: number) => {
        api?.scrollTo(index)
      },
      [api]
    )
    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on('reInit', onSelect)
      api.on('select', onSelect)

      return () => {
        api?.off('select', onSelect)
      }
    }, [api, onSelect])

    // Autoplay Logic
    useEffect(() => {
      if (!api || autoplayDelay <= 0) return

      const interval = setInterval(() => {
        scrollNext()
      }, autoplayDelay)

      // Pause autoplay when user interacts
      api.on('pointerDown', () => clearInterval(interval))

      return () => {
        clearInterval(interval)
        api?.off('pointerDown', () => clearInterval(interval))
      }
    }, [api, scrollNext, autoplayDelay])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
          scrollTo
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = 'Carousel'

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)} {...props} />
    </div>
  )
})
CarouselContent.displayName = 'CarouselContent'

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0 basis-full', orientation === 'horizontal' ? 'pl-4' : 'pt-4', className)}
      {...props}
    />
  )
})
CarouselItem.displayName = 'CarouselItem'

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-8 w-8 rounded-full',
          orientation === 'horizontal' ? 'top-1/2 -left-12 -translate-y-1/2' : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    )
  }
)
CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-8 w-8 rounded-full',
          orientation === 'horizontal' ? 'top-1/2 -right-12 -translate-y-1/2' : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    )
  }
)
CarouselNext.displayName = 'CarouselNext'

const CarouselDots: React.FC<CarouselDotsProps> = ({ autoplayDelay = 3000 }) => {
  const { selectedIndex, scrollTo, api } = useCarousel()

  const [slides, setSlides] = useState(0) // Store the number of slides
  const [progress, setProgress] = useState<number[]>([]) // Initialize progress as an empty array

  // Update slides and progress when `api` is ready
  useEffect(() => {
    if (api) {
      const slideCount = api.scrollSnapList().length
      setSlides(slideCount)
      setProgress(Array(slideCount).fill(0)) // Reinitialize progress array
    }
  }, [api])

  // Update progress for the active dot
  useEffect(() => {
    if (!slides) return // Ensure slides are available before starting the interval

    const interval = setInterval(() => {
      setProgress(prevProgress => prevProgress.map((p, i) => (i === selectedIndex ? Math.min(p + 100 / (autoplayDelay / 100), 100) : 0)))
    }, 100)

    return () => clearInterval(interval)
  }, [selectedIndex, autoplayDelay, slides])

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(prevProgress => prevProgress.map((_, i) => (i === selectedIndex ? 0 : 0)))
  }, [selectedIndex])

  return (
    <div className="mt-4 flex justify-center space-x-2">
      {Array.from({ length: slides }).map((_, index) => (
        <div
          key={index}
          onClick={() => scrollTo(index)}
          className={`relative h-[5px] w-[63px] rounded-full ${index === selectedIndex ? 'bg-gray-300' : 'bg-gray-300'} cursor-pointer`}
        >
          {index === selectedIndex && (
            <div
              className="bg-primary absolute top-0 left-0 h-full w-full rounded-full opacity-50"
              style={{
                clipPath: `inset(0% ${100 - progress[index]}% 0% 0%)`,
                transition: 'clip-path 100ms linear'
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CarouselDots

CarouselDots.displayName = 'CarouselDots'

export { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi }
