'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ExperienceEntry {
  id: string
  companyName: string
  position: string
  city: string
  website: string
}

export default function ExperienceForm() {
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([
    {
      id: '1',
      companyName: '',
      position: '',
      city: '',
      website: ''
    }
  ])

  const handleInputChange = (id: string, field: keyof ExperienceEntry, value: string) => {
    setExperiences(experiences.map(exp => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const addMoreExperience = () => {
    const allValid = experiences.every(isValid)
    if (!allValid) {
      toast.error('Please fill out all fields in each experience.')
      return
    }
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        companyName: '',
        position: '',
        city: '',
        website: ''
      }
    ])
  }

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id))
  }

  const isValid = (exp: ExperienceEntry) => {
    return exp.companyName.trim() !== '' && exp.position.trim() !== '' && exp.city.trim() !== '' && exp.website.trim() !== ''
  }

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => (
        <div key={experience.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Experience {experiences.length != 1 && index + 1}</h2>
            {experiences.length != 1 && (
              <Button variant="ghost" onClick={() => handleDelete(experience.id)}>
                <Trash2 className="h-5 w-5 cursor-pointer text-red-500" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              placeholder="Enter Your Company Name"
              value={experience.companyName}
              onChange={e => handleInputChange(experience.id, 'companyName', e.target.value)}
            />
            <Input
              placeholder="Enter Your Position"
              value={experience.position}
              onChange={e => handleInputChange(experience.id, 'position', e.target.value)}
            />
            <Input placeholder="City" value={experience.city} onChange={e => handleInputChange(experience.id, 'city', e.target.value)} />
            <Input
              placeholder="Website"
              value={experience.website}
              onChange={e => handleInputChange(experience.id, 'website', e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-start">
        <Button type="button" variant="ghost" className="flex items-center border" onClick={addMoreExperience}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add more
        </Button>
      </div>
    </div>
  )
}
