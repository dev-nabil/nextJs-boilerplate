import { cn } from '@/lib/utils'
import { ImagePlus } from 'lucide-react'

export default function ImageUploader({ previewUrl, text }: { previewUrl: string; text?: string }) {
  return (
    <div className="flex cursor-pointer flex-col items-center">
      {/* <span className='text-gray-400 text-lg'>🖼</span>
                      <span className='text-sm text-gray-500 mt-1'>Front Side</span> */}
      {previewUrl ? (
        <div className="w-full">
          <div
            className={cn(
              'relative z-10 overflow-hidden rounded-lg border-2 border-dashed transition-colors duration-150 ease-in-out',
              'hover:bg-muted/50 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',

              'cursor-pointer'
            )}
          >
            <div className="flex flex-col items-center justify-center">
              <img src={previewUrl} alt="Front Preview " className="h-52 w-auto object-contain p-2" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full">
            <div
              className={cn(
                'relative z-10 rounded-lg border-2 border-dashed p-8 transition-colors duration-150 ease-in-out',
                'hover:bg-muted/50 focus-visible:ring-ring h-52 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',

                'cursor-pointer'
              )}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                {text && <p className="text-xs">{text}</p>}
                <div className="bg-muted/25 flex h-16 w-16 items-center justify-center rounded-full">
                  <ImagePlus className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm">
                    Drop your image or <span className="text-primary hover:underline">browse</span>
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">JPEG or PNGs only • 2MB max</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
