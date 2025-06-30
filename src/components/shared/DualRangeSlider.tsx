'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'

import { cn } from '@/lib/utils'

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    onValueChange?: (value: number[]) => void // Allow passing `onValueChange`
  }
>(({ className, value = [0, 100], onValueChange, ...props }, ref) => {
  const [sliderValue, setSliderValue] = React.useState<number[]>(value)

  // Update local state and call external `onValueChange`
  const handleValueChange = (newValue: number[]) => {
    setSliderValue(newValue)
    onValueChange?.(newValue) // Notify parent component if `onValueChange` is provided
  }

  React.useEffect(() => {
    // Sync local state with the `value` prop if it changes externally
    setSliderValue(value)
  }, [value])

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none items-center select-none', className)}
      value={sliderValue} // Controlled value
      onValueChange={handleValueChange} // Update value on change
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-[#CBCBCB]">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      {sliderValue.map((val, index) => (
        <TooltipPrimitive.Provider delayDuration={100} key={index}>
          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>
              <SliderPrimitive.Thumb className="border-primary bg-primary ring-offset-background focus-visible:ring-ring block h-4 w-4 rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Content
              side="top"
              align="center"
              className="relative z-40 rounded-md bg-black px-2 py-1 text-sm text-white shadow-lg"
            >
              NPR {val.toLocaleString()} {/* Display value in tooltip */}
              <TooltipPrimitive.Arrow className="fill-black" />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
      ))}
    </SliderPrimitive.Root>
  )
})
DualRangeSlider.displayName = SliderPrimitive.Root.displayName

export { DualRangeSlider }
