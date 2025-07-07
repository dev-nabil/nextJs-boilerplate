// 'use client'
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
// import { Button } from '@/components/ui/button'
// import { Form } from '@/components/ui/form'
// import { Separator } from '@/components/ui/separator'
// import { cn } from '@/lib/utils'

// import { zodResolver } from '@hookform/resolvers/zod'
// import { AlertTriangleIcon, Trash, Trash2Icon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
// import InputField from '../custom/input'

// interface ProfileFormType {
//   initialData: any | null
//   categories: any
// }

// export const CreateProfileOne: React.FC<ProfileFormType> = ({ initialData, categories }) => {
//   const router = useRouter()
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [previousStep, setPreviousStep] = useState(0)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [data, setData] = useState({})
//   const delta = currentStep - previousStep

//   const defaultValues = {
//     jobs: [
//       {
//         jobtitle: '',
//         employer: '',
//         startdate: '',
//         enddate: '',
//         jobcountry: '',
//         jobcity: ''
//       }
//     ]
//   }

//   const form = useForm<ProfileFormValues>({
//     resolver: zodResolver(profileSchema),
//     defaultValues,
//     mode: 'onChange'
//   })

//   const {
//     control,
//     formState: { errors }
//   } = form

//   const { append, remove, fields } = useFieldArray({
//     control,
//     name: 'jobs'
//   })

//   const onSubmit = async (data: ProfileFormValues) => {
//     try {
//       setLoading(true)
//       if (initialData) {
//         // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
//       } else {
//         // const res = await axios.post(`/api/products/create-product`, data);
//       }
//       router.refresh()
//       router.push(`/dashboard/products`)
//     } catch (error: any) {
//     } finally {
//       setLoading(false)
//     }
//   }

//   const processForm: SubmitHandler<ProfileFormValues> = data => {
//     setData(data)
//     // api call and reset
//     // form.reset();
//   }

//   type FieldName = keyof ProfileFormValues

//   const steps = [
//     {
//       id: 'Step 1',
//       name: 'Personal Information',
//       fields: ['firstname', 'lastname', 'email', 'contactno', 'country', 'city']
//     },
//     {
//       id: 'Step 2',
//       name: 'Professional Informations',
//       // fields are mapping and flattening for the error to be trigger  for the dynamic fields
//       fields: fields
//         ?.map((_, index) => [
//           `jobs.${index}.jobtitle`,
//           `jobs.${index}.employer`,
//           `jobs.${index}.startdate`,
//           `jobs.${index}.enddate`,
//           `jobs.${index}.jobcountry`,
//           `jobs.${index}.jobcity`
//           // Add other field names as needed
//         ])
//         .flat()
//     },
//     { id: 'Step 3', name: 'Complete' }
//   ]

//   const next = async () => {
//     const fields = steps[currentStep].fields

//     const output = await form.trigger(fields as FieldName[], {
//       shouldFocus: true
//     })

//     if (!output) return

//     if (currentStep < steps.length - 1) {
//       if (currentStep === steps.length - 2) {
//         await form.handleSubmit(processForm)()
//       }
//       setPreviousStep(currentStep)
//       setCurrentStep(step => step + 1)
//     }
//   }

//   const prev = () => {
//     if (currentStep > 0) {
//       setPreviousStep(currentStep)
//       setCurrentStep(step => step - 1)
//     }
//   }

//   const countries = [{ id: 'wow', name: 'india' }]
//   const cities = [{ id: '2', name: 'kerala' }]

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         {initialData && (
//           <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
//             <Trash className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <Separator />
//       <div>
//         <ul className="flex gap-4">
//           {steps.map((step, index) => (
//             <li key={step.name} className="md:flex-1">
//               {currentStep > index ? (
//                 <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0">
//                   <span className="text-sm font-medium text-sky-600 transition-colors">{step.id}</span>
//                   <span className="text-sm font-medium">{step.name}</span>
//                 </div>
//               ) : currentStep === index ? (
//                 <div
//                   className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0"
//                   aria-current="step"
//                 >
//                   <span className="text-sm font-medium text-sky-600">{step.id}</span>
//                   <span className="text-sm font-medium">{step.name}</span>
//                 </div>
//               ) : (
//                 <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0">
//                   <span className="text-sm font-medium text-gray-500 transition-colors">{step.id}</span>
//                   <span className="text-sm font-medium">{step.name}</span>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <Separator />
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(processForm)} className="w-full space-y-8">
//           <div className={cn(currentStep === 1 ? 'w-full md:inline-block' : 'gap-8 md:grid md:grid-cols-3')}>
//             {currentStep === 0 && (
//               <>
//                 <InputField name="firstname" type="text" label="First Name" placeholder="John" readOnly={loading} />
//                 <InputField name="lastname" type="text" label="Last Name" placeholder="Doe" readOnly={loading} />
//                 <InputField name="email" type="email" label="Email" placeholder="johndoe@gmail.com" readOnly={loading} />
//                 <InputField
//                   name="contactno"
//                   type="number"
//                   label="Contact Number"
//                   placeholder="Enter your contact number"
//                   readOnly={loading}
//                 />
//                 <InputField
//                   name="country"
//                   type="select"
//                   label="Country"
//                   placeholder="Select a country"
//                   options={countries.map(country => ({ value: country.id, label: country.name }))}
//                   readOnly={loading}
//                 />
//                 <InputField
//                   name="city"
//                   type="select"
//                   label="City"
//                   placeholder="Select a city"
//                   options={cities.map(city => ({ value: city.id, label: city.name }))}
//                   readOnly={loading}
//                 />
//               </>
//             )}
//             {currentStep === 1 && (
//               <>
//                 {fields?.map((field, index) => (
//                   <Accordion type="single" collapsible defaultValue="item-1" key={field.id}>
//                     <AccordionItem value="item-1">
//                       <AccordionTrigger
//                         className={cn(
//                           'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
//                           errors?.jobs?.[index] && 'text-red-700'
//                         )}
//                       >
//                         {`Work Experience ${index + 1}`}

//                         <Button variant="outline" size="icon" className="absolute right-8" onClick={() => remove(index)}>
//                           <Trash2Icon className="h-4 w-4" />
//                         </Button>
//                         {errors?.jobs?.[index] && (
//                           <span className="alert absolute right-8">
//                             <AlertTriangleIcon className="h-4 w-4 text-red-700" />
//                           </span>
//                         )}
//                       </AccordionTrigger>
//                       <AccordionContent>
//                         <div className={cn('relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3')}>
//                           <InputField name={`jobs.${index}.jobtitle`} type="text" label="Job Title" readOnly={loading} />
//                           <InputField name={`jobs.${index}.employer`} type="text" label="Employer" readOnly={loading} />
//                           <InputField name={`jobs.${index}.startdate`} type="datetime" label="Start Date" readOnly={loading} />
//                           <InputField name={`jobs.${index}.enddate`} type="datetime" label="End Date" readOnly={loading} />
//                           <InputField
//                             name={`jobs.${index}.jobcountry`}
//                             type="select"
//                             label="Job Country"
//                             options={countries.map(country => ({ value: country.id, label: country.name }))}
//                             readOnly={loading}
//                           />
//                           <InputField
//                             name={`jobs.${index}.jobcity`}
//                             type="select"
//                             label="Job City"
//                             options={cities.map(city => ({ value: city.id, label: city.name }))}
//                             readOnly={loading}
//                           />
//                         </div>
//                       </AccordionContent>
//                     </AccordionItem>
//                   </Accordion>
//                 ))}

//                 <div className="mt-4 flex justify-center">
//                   <Button
//                     type="button"
//                     className="flex justify-center"
//                     size={'lg'}
//                     onClick={() =>
//                       append({
//                         jobtitle: '',
//                         employer: '',
//                         startdate: '',
//                         enddate: '',
//                         jobcountry: '',
//                         jobcity: ''
//                       })
//                     }
//                   >
//                     Add More
//                   </Button>
//                 </div>
//               </>
//             )}
//             {currentStep === 2 && (
//               <div>
//                 <h1>Completed</h1>
//                 <pre className="whitespace-pre-wrap">{JSON.stringify(data)}</pre>
//               </div>
//             )}
//           </div>
//         </form>
//       </Form>
//       {/* Navigation */}
//       <div className="mt-8 pt-5">
//         <div className="flex justify-between">
//           <button
//             type="button"
//             onClick={prev}
//             disabled={currentStep === 0}
//             className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-300 ring-inset hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="currentColor"
//               className="h-6 w-6"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
//             </svg>
//           </button>
//           <button
//             type="button"
//             onClick={next}
//             disabled={currentStep === steps.length - 1}
//             className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-300 ring-inset hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="currentColor"
//               className="h-6 w-6"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </>
//   )
// }
