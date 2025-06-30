'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File
import {
  align,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  image,
  lineHeight,
  link,
  list,
  paragraphStyle,
  table,
  template,
  textStyle,
  video
} from 'suneditor/src/plugins'

const ImportSunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false
})

function SunEditor({ name }: { name: string }) {
  const form = useFormContext()
  const [editorValue, setEditorValue] = useState('')

  useEffect(() => {
    const subscription = form.watch(value => {
      if (value[name]) {
        setEditorValue(value[name] || '')
      }
    })

    setEditorValue(form.getValues(name) || '')

    return () => subscription.unsubscribe()
  }, [form, name])

  const handleChange = (content: string) => {
    form.setValue(name, content, { shouldValidate: true })
  }

  return (
    <ImportSunEditor
      {...form}
      setContents={editorValue}
      onChange={handleChange}
      height="300"
      lang="en"
      setOptions={{
        showPathLabel: false,
        placeholder: 'Enter your text here',
        plugins: [
          align,
          font,
          fontColor,
          fontSize,
          formatBlock,
          hiliteColor,
          horizontalRule,
          lineHeight,
          list,
          paragraphStyle,
          table,
          template,
          textStyle,
          image,
          link,
          video
        ],
        buttonList: [
          ['undo', 'redo'],
          ['removeFormat'],
          ['fontSize'],
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          ['fontColor', 'hiliteColor'],
          // '/', // Line break
          ['align', 'horizontalRule', 'list', 'lineHeight'],
          ['table', 'link', 'image', 'video'],
          ['fullScreen', 'codeView']
        ]
      }}
    />
  )
}

export default SunEditor
