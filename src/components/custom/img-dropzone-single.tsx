import { Button } from '@/components/ui/button'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { Icons } from './icons'

const DropzoneSingle = ({ name }: { name: string }) => {
  const { watch, setValue } = useFormContext()
  const image = watch(name)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) return

      const file = acceptedFiles[0]
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      })

      setValue(name, fileWithPreview)
    },
    [name, setValue]
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxSize: 1024 * 1000, // 1MB
    onDrop
  })

  return (
    <div {...getRootProps()}>
      {image ? (
        <div className="flex flex-col items-center gap-3 lg:flex-row">
          <img src={image?.preview || image} alt="Uploaded Image" className="h-40 rounded-xl border object-contain p-1" />

          <Button type="button" size="sm" className="bg-destructive" onClick={() => setValue(name, '')}>
            <Icons.trash className="fill-secondary h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="bg-secondary flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-3">
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center gap-1 text-sm">
            <span className="font-medium">Drag & Drop image file</span>
            <span>or</span>
            <Button type="button" variant="outline">
              Browse
            </Button>

            <p className="my-3">Maximum Size: 1MB</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DropzoneSingle
