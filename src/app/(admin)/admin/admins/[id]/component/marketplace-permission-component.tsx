// 'use client'

// import { checkAccess, permissionData, type PermissionProps, SERVICE_CATEGORIES } from '@/app/(admin)/permission/permission'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { useAuth } from '@/hooks/use-auth'
// import { useUpdateAdminAccessLevelsMutation } from '@/store/features/admin/adminApi'
// import { format } from 'date-fns'
// import {
//   AlertTriangle,
//   Ban,
//   BarChart3,
//   CheckCircle,
//   CheckCircle2,
//   Circle,
//   CreditCard,
//   DollarSign,
//   Edit,
//   Eye,
//   FileCodeIcon as FileContract,
//   FileText,
//   Gavel,
//   HelpCircle,
//   ImageIcon,
//   Link,
//   MapPin,
//   MessageCircle,
//   MessageSquare,
//   Minus,
//   Percent,
//   Plus,
//   RefreshCw,
//   RotateCcw,
//   Save,
//   Scale,
//   Search,
//   Settings,
//   Shield,
//   Smartphone,
//   Trash2,
//   Trophy,
//   Upload,
//   UserPlus,
//   Users,
//   X
// } from 'lucide-react'
// import type React from 'react'
// import { useEffect, useState } from 'react'
// import toast from 'react-hot-toast'

// interface SelectedPermissions {
//   [service: string]: string[]
// }

// export default function MarketplacePermissionComponent({ adminInfo, id }: { adminInfo: any; id: string }) {
//   const [selectedPermissions, setSelectedPermissions] = useState<SelectedPermissions>({})
//   const [hasChanges, setHasChanges] = useState(false)
//   const [updateOption, setUpdateOption] = useState<'save' | 'reset' | null>(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedCategory, setSelectedCategory] = useState<string>('all')
//   const [updateAccessLevels, { isLoading: isUpdating }] = useUpdateAdminAccessLevelsMutation()
//   const { user } = useAuth()
//   console.log({ user, selectedPermissions, id, adminInfo }, 'hello user')

//   // Initialize empty permissions
//   useEffect(() => {
//     const initialPermissions: SelectedPermissions = {}
//     // Then, populate with user's existing permissions
//     adminInfo?.accessLevels.forEach((userPerm: any) => {
//       if (userPerm.visible) {
//         initialPermissions[userPerm.service] = [...userPerm.access]
//       }
//     })

//     setSelectedPermissions(initialPermissions)
//   }, [])

//   const handlePermissionChange = (service: string, permission: string, checked: boolean) => {
//     setSelectedPermissions(prev => {
//       const servicePermissions = prev[service] || []
//       const updatedPermissions = checked ? [...servicePermissions, permission] : servicePermissions.filter(p => p !== permission)

//       setHasChanges(true)
//       return {
//         ...prev,
//         [service]: updatedPermissions
//       }
//     })
//   }

//   const handleSelectAll = (service: string, permissions: string[]) => {
//     const currentPermissions = selectedPermissions[service] || []
//     const allSelected = permissions.every(p => currentPermissions.includes(p))

//     setSelectedPermissions(prev => ({
//       ...prev,
//       [service]: allSelected ? [] : permissions
//     }))
//     setHasChanges(true)
//   }

//   const handleCategorySelectAll = (category: string) => {
//     const categoryServices = SERVICE_CATEGORIES[category as keyof typeof SERVICE_CATEGORIES] || []
//     const updatedPermissions = { ...selectedPermissions }

//     categoryServices.forEach(serviceName => {
//       const service = permissionData.find(s => s.service === serviceName)
//       if (service) {
//         updatedPermissions[service.service] = service.access
//       }
//     })

//     setSelectedPermissions(updatedPermissions)
//     setHasChanges(true)
//   }

//   const handleSave = async () => {
//     setUpdateOption('save')
//     // Create a detailed log
//     const permissionData = Object.entries(selectedPermissions)
//       .filter(([_, access]) => access.length > 0)
//       .map(([service, access]) => ({
//         service,
//         access
//       }))

//     try {
//       await updateAccessLevels({
//         id,
//         accessLevels: permissionData
//       }).unwrap()
//       const totalSelected = Object.values(selectedPermissions).reduce((total, permissions) => total + permissions.length, 0)
//       toast.success(
//         `Permissions updated successfully! ${totalSelected} permission${totalSelected !== 1 ? 's' : ''} saved across ${permissionData.length} service${permissionData.length !== 1 ? 's' : ''}.`,
//         {
//           id: 'permissions-saved'
//         }
//       )
//     } catch (error: any) {
//       toast.error(error?.data?.message || 'Failed to update access levels. Please try again.')
//     }

//     setHasChanges(false)
//   }

//   const handleReset = async () => {
//     setUpdateOption('reset')
//     const resetPermissions: SelectedPermissions = {}
//     permissionData.forEach(service => {
//       resetPermissions[service.service] = []
//     })
//     setSelectedPermissions(resetPermissions)
//     setHasChanges(false)
//     try {
//       await updateAccessLevels({
//         id,
//         accessLevels: []
//       }).unwrap()
//       toast.success('All permissions have been cleared.', {
//         id: 'permissions-reset'
//       })
//     } catch (error: any) {
//       toast.error(error?.data?.message || 'Failed to update access levels. Please try again.')
//     }
//   }

//   const getTotalSelectedCount = () => {
//     return Object.values(selectedPermissions).reduce((total, permissions) => total + permissions.length, 0)
//   }

//   const filteredData = permissionData.filter(service => {
//     const matchesSearch = service.service.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory =
//       selectedCategory === 'all' ||
//       Object.entries(SERVICE_CATEGORIES).some(([category, services]) => category === selectedCategory && services.includes(service.service))
//     return matchesSearch && matchesCategory
//   })

//   const groupedData = Object.entries(SERVICE_CATEGORIES)
//     .map(([category, services]) => ({
//       category,
//       services: services
//         .filter(serviceName => filteredData.some(service => service.service === serviceName))
//         .map(serviceName => permissionData.find(service => service.service === serviceName)!)
//         .filter(Boolean)
//     }))
//     .filter(group => group.services.length > 0)

//   // ============permission===============
//   const createPermission = checkAccess('Admins', 'permission_create').status
//   // ============permission===============

//   return (
//     <div className="w-full space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2">
//             <Avatar className="h-20 w-20">
//               <AvatarImage src={adminInfo.user?.avatar || ''} alt={adminInfo.user?.name} />
//               <AvatarFallback>{adminInfo.user?.name?.charAt(0)}</AvatarFallback>
//             </Avatar>
//             <div>
//               <h3 className="text-lg font-medium">{adminInfo.user?.name}</h3>
//               <p className="text-muted-foreground text-sm">{adminInfo.user?.email}</p>
//               <Badge variant={adminInfo.user?.blocked ? 'destructive' : 'default'}>{adminInfo.user?.blocked ? 'Blocked' : 'Active'}</Badge>
//             </div>
//           </div>
//           <div className="w-full space-y-2 pt-4">
//             <div className="flex justify-start gap-2">
//               <span className="text-sm font-medium">Created At:</span>
//               <span className="text-muted-foreground text-sm">{format(new Date(adminInfo.createdAt), 'MMM d, yyyy')}</span>
//             </div>
//             <div className="flex justify-start gap-2">
//               <span className="text-sm font-medium">Last Active:</span>
//               <span className="text-muted-foreground text-sm">
//                 {adminInfo.user?.lastActive ? format(new Date(adminInfo.user.lastActive), 'MMM d, yyyy') : 'N/A'}
//               </span>
//             </div>
//           </div>
//         </div>
//         <Badge variant="secondary" className="px-3 py-1 text-sm">
//           {getTotalSelectedCount()} permissions selected
//         </Badge>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col-reverse items-start justify-between gap-4 xl:flex-row xl:items-center">
//         <div className="flex w-full flex-1 flex-col justify-end gap-3 sm:flex-row">
//           <div className="relative max-w-sm flex-1">
//             <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
//             <Input placeholder="Search services..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
//           </div>
//           <select
//             value={selectedCategory}
//             onChange={e => setSelectedCategory(e.target.value)}
//             className="border-input bg-background rounded-md border px-3 py-2 text-sm"
//           >
//             <option value="all">All Categories</option>
//             {Object.keys(SERVICE_CATEGORIES).map(category => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>
//         {createPermission && (
//           <div className="flex w-full justify-end gap-3 xl:w-auto">
//             <Button
//               onClick={handleSave}
//               isLoading={updateOption === 'save' && isUpdating}
//               disabled={!hasChanges}
//               className="flex items-center gap-2"
//             >
//               <Save className="h-4 w-4" />
//               Save Permissions
//             </Button>
//             <Button onClick={handleReset} className="flex items-center gap-2">
//               <RotateCcw className={`h-4 w-4 ${updateOption === 'reset' && isUpdating && 'animate-spin'}`} />
//               Reset All
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Category Groups */}
//       <div className="space-y-8">
//         {groupedData.map(({ category, services }) => (
//           <div key={category} className="space-y-4">
//             <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
//               {/* Title & Badge */}
//               <div className="flex items-center justify-between gap-3 lg:justify-start">
//                 <h2 className="text-xl font-semibold">{category}</h2>
//                 <Badge variant="outline">{services.length} services</Badge>
//               </div>

//               {/* Select All Button */}
//               {createPermission && (
//                 <div className="flex justify-end lg:justify-start">
//                   <Button size="sm" onClick={() => handleCategorySelectAll(category)} className="text-sm">
//                     Select All in {category}
//                   </Button>
//                 </div>
//               )}
//             </div>

//             <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
//               {services.map((service: PermissionProps) => {
//                 const servicePermissions = selectedPermissions[service.service] || []
//                 const allSelected = service.access.every(p => servicePermissions.includes(p))
//                 const someSelected = service.access.some(p => servicePermissions.includes(p))

//                 return (
//                   <Card key={service.service} className="transition-all hover:shadow-md">
//                     <CardHeader className="pb-3">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           {serviceIcons[service.service]}
//                           <CardTitle className="text-lg">{service.service}</CardTitle>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Badge variant={someSelected ? 'default' : 'secondary'} className="text-xs">
//                             {servicePermissions.length}/{service.access.length}
//                           </Badge>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             disabled={!createPermission}
//                             onClick={() => handleSelectAll(service.service, service.access)}
//                             className="h-6 w-6 p-0"
//                           >
//                             {allSelected ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
//                           </Button>
//                         </div>
//                       </div>
//                     </CardHeader>

//                     <CardContent className="pt-0">
//                       <div className="grid gap-2">
//                         {service.access.map(permission => {
//                           const isChecked = servicePermissions.includes(permission)
//                           const permissionId = `${service.service}-${permission}`

//                           return (
//                             <div
//                               key={permission}
//                               className={`hover:bg-primary/50 flex items-center space-x-2 rounded-md border p-2 transition-all hover:text-black ${
//                                 isChecked ? 'bg-primary/5 border-primary/20' : 'hover:border-border'
//                               }`}
//                             >
//                               <Checkbox
//                                 id={permissionId}
//                                 checked={isChecked}
//                                 disabled={!createPermission}
//                                 onCheckedChange={checked => handlePermissionChange(service.service, permission, checked as boolean)}
//                               />
//                               <div className="flex flex-1 items-center gap-2">
//                                 <span className={getActionColor(permission)}>{actionIcons[permission]}</span>
//                                 <Label htmlFor={permissionId} className="flex-1 cursor-pointer text-sm capitalize">
//                                   {permission.replace(/_/g, ' ')}
//                                 </Label>
//                               </div>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Summary */}
//       {getTotalSelectedCount() > 0 && (
//         <Card className="bg-gray-100">
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold">Permission Summary</h3>
//                 <p className="text-muted-foreground text-sm">
//                   {getTotalSelectedCount()} permissions selected across{' '}
//                   {Object.values(selectedPermissions).filter(perms => perms.length > 0).length} services
//                 </p>
//               </div>
//               {hasChanges && (
//                 <Badge variant="outline" className="border-orange-200 text-orange-600">
//                   Unsaved Changes
//                 </Badge>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

// const serviceIcons: { [key: string]: React.ReactNode } = {
//   Dashboard: <BarChart3 className="h-5 w-5" />,
//   Category: <FileText className="h-5 w-5" />,
//   Banners: <ImageIcon className="h-5 w-5" />,
//   Blog: <FileText className="h-5 w-5" />,
//   buyer: <Users className="h-5 w-5" />,
//   seller: <Users className="h-5 w-5" />,
//   Admins: <Shield className="h-5 w-5" />,
//   'Payment (Bill)': <CreditCard className="h-5 w-5" />,
//   Subscription: <RefreshCw className="h-5 w-5" />,
//   'Boost Profile': <Trophy className="h-5 w-5" />,
//   'Boost Project': <Trophy className="h-5 w-5" />,
//   'Bid Points': <DollarSign className="h-5 w-5" />,
//   Commissions: <Percent className="h-5 w-5" />,
//   Payout: <DollarSign className="h-5 w-5" />,
//   Contacts: <MessageSquare className="h-5 w-5" />,
//   Dispute: <AlertTriangle className="h-5 w-5" />,
//   contract: <FileContract className="h-5 w-5" />,
//   faq: <HelpCircle className="h-5 w-5" />,
//   'General Settings': <Settings className="h-5 w-5" />,
//   'Logo & Branding': <ImageIcon className="h-5 w-5" />,
//   'Social Links': <Link className="h-5 w-5" />,
//   'App Settings': <Smartphone className="h-5 w-5" />,
//   'Company Address': <MapPin className="h-5 w-5" />,
//   'Legal Documents': <Scale className="h-5 w-5" />,
//   'Platform Fees': <Percent className="h-5 w-5" />,
//   'Top Seller Conditions': <Trophy className="h-5 w-5" />,
//   Bids: <Gavel className="h-5 w-5" />
// }

// const actionIcons: { [key: string]: React.ReactNode } = {
//   view: <Eye className="h-3 w-3" />,
//   create: <Plus className="h-3 w-3" />,
//   edit: <Edit className="h-3 w-3" />,
//   delete: <Trash2 className="h-3 w-3" />,
//   block: <Ban className="h-3 w-3" />,
//   approve: <CheckCircle className="h-3 w-3" />,
//   reject: <X className="h-3 w-3" />,
//   assign: <UserPlus className="h-3 w-3" />,
//   deduct: <Minus className="h-3 w-3" />,
//   set: <Settings className="h-3 w-3" />,
//   respond: <MessageCircle className="h-3 w-3" />,
//   resolve: <CheckCircle className="h-3 w-3" />,
//   chat: <MessageSquare className="h-3 w-3" />,
//   decline: <X className="h-3 w-3" />,
//   terminate: <AlertTriangle className="h-3 w-3" />,
//   upload: <Upload className="h-3 w-3" />,
//   release: <DollarSign className="h-3 w-3" />,
//   refund: <RefreshCw className="h-3 w-3" />,
//   NID_verification: <Shield className="h-3 w-3" />,
//   view_details: <Eye className="h-3 w-3" />,
//   permission_create: <Shield className="h-3 w-3" />
// }

// const getActionColor = (action: string) => {
//   const colors: { [key: string]: string } = {
//     view: 'text-blue-600',
//     create: 'text-green-600',
//     edit: 'text-yellow-600',
//     delete: 'text-red-600',
//     block: 'text-red-600',
//     approve: 'text-green-600',
//     reject: 'text-red-600',
//     assign: 'text-blue-600',
//     deduct: 'text-orange-600',
//     set: 'text-purple-600',
//     respond: 'text-blue-600',
//     resolve: 'text-green-600',
//     chat: 'text-blue-600',
//     decline: 'text-red-600',
//     terminate: 'text-red-600',
//     upload: 'text-indigo-600',
//     release: 'text-green-600',
//     refund: 'text-orange-600',
//     NID_verification: 'text-purple-600',
//     view_details: 'text-blue-600',
//     permission_create: 'text-purple-600'
//   }
//   return colors[action] || 'text-gray-600'
// }

'use client'

import type React from 'react'

import { checkAccess, permissionData, type PermissionProps, SERVICE_CATEGORIES } from '@/app/(admin)/permission/permission'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { useUpdateAdminAccessLevelsMutation } from '@/store/features/admin/adminApi'
import { format } from 'date-fns'
import {
  Activity,
  AlertTriangle,
  Ban,
  BarChart3,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Filter,
  ImageIcon,
  Mail,
  MessageSquare,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  Users,
  X
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface SelectedPermissions {
  [service: string]: string[]
}

// Service Icons Mapping
const serviceIcons: { [key: string]: React.ReactNode } = {
  Users: <Users className="h-5 w-5 text-blue-500" />,
  Admins: <Shield className="h-5 w-5 text-purple-500" />,
  Banners: <ImageIcon className="h-5 w-5 text-green-500" />,
  Blogs: <FileText className="h-5 w-5 text-orange-500" />,
  Categories: <Settings className="h-5 w-5 text-gray-500" />,
  Products: <CreditCard className="h-5 w-5 text-indigo-500" />,
  Orders: <DollarSign className="h-5 w-5 text-emerald-500" />,
  Reviews: <MessageSquare className="h-5 w-5 text-pink-500" />,
  Analytics: <BarChart3 className="h-5 w-5 text-cyan-500" />,
  Settings: <Settings className="h-5 w-5 text-gray-600" />
}

// Action Icons Mapping
const actionIcons: { [key: string]: React.ReactNode } = {
  create: <Plus className="h-4 w-4" />,
  read: <Eye className="h-4 w-4" />,
  update: <Edit className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
  manage: <Settings className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
  edit: <Edit className="h-4 w-4" />,
  remove: <X className="h-4 w-4" />
}

// Action Color Classes
const getActionColor = (action: string): string => {
  const colorMap: { [key: string]: string } = {
    create: 'text-green-600',
    read: 'text-blue-600',
    update: 'text-orange-600',
    delete: 'text-red-600',
    manage: 'text-purple-600',
    view: 'text-blue-600',
    edit: 'text-orange-600',
    remove: 'text-red-600'
  }
  return colorMap[action] || 'text-gray-600'
}

export default function MarketplacePermissionComponent({ adminInfo, id }: { adminInfo: any; id: string }) {
  const [selectedPermissions, setSelectedPermissions] = useState<SelectedPermissions>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [updateOption, setUpdateOption] = useState<'save' | 'reset' | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({})
  const [updateAccessLevels, { isLoading: isUpdating }] = useUpdateAdminAccessLevelsMutation()
  const { user } = useAuth()

  // Initialize permissions
  useEffect(() => {
    const initialPermissions: SelectedPermissions = {}
    adminInfo?.accessLevels.forEach((userPerm: any) => {
      if (userPerm.visible) {
        initialPermissions[userPerm.service] = [...userPerm.access]
      }
    })
    setSelectedPermissions(initialPermissions)

    // Initialize all categories as expanded
    const initialExpanded: { [key: string]: boolean } = {}
    Object.keys(SERVICE_CATEGORIES).forEach(category => {
      initialExpanded[category] = true
    })
    setExpandedCategories(initialExpanded)
  }, [adminInfo])

  const handlePermissionChange = (service: string, permission: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const servicePermissions = prev[service] || []
      const updatedPermissions = checked ? [...servicePermissions, permission] : servicePermissions.filter(p => p !== permission)

      setHasChanges(true)
      return {
        ...prev,
        [service]: updatedPermissions
      }
    })
  }

  const handleSelectAll = (service: string, permissions: string[]) => {
    const currentPermissions = selectedPermissions[service] || []
    const allSelected = permissions.every(p => currentPermissions.includes(p))

    setSelectedPermissions(prev => ({
      ...prev,
      [service]: allSelected ? [] : permissions
    }))
    setHasChanges(true)
  }

  const handleCategorySelectAll = (category: string) => {
    const categoryServices = SERVICE_CATEGORIES[category as keyof typeof SERVICE_CATEGORIES] || []
    const updatedPermissions = { ...selectedPermissions }

    categoryServices.forEach(serviceName => {
      const service = permissionData.find(s => s.service === serviceName)
      if (service) {
        updatedPermissions[service.service] = service.access
      }
    })

    setSelectedPermissions(updatedPermissions)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setUpdateOption('save')
    const permissionDataToSave = Object.entries(selectedPermissions)
      .filter(([_, access]) => access.length > 0)
      .map(([service, access]) => ({
        service,
        access
      }))

    try {
      await updateAccessLevels({
        id,
        accessLevels: permissionDataToSave
      }).unwrap()
      const totalSelected = Object.values(selectedPermissions).reduce((total, permissions) => total + permissions.length, 0)
      toast.success(
        `Permissions updated successfully! ${totalSelected} permission${totalSelected !== 1 ? 's' : ''} saved across ${
          permissionDataToSave.length
        } service${permissionDataToSave.length !== 1 ? 's' : ''}.`,
        {
          id: 'permissions-saved'
        }
      )
      setHasChanges(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update access levels. Please try again.')
    }
    setUpdateOption(null)
  }

  const handleReset = async () => {
    setUpdateOption('reset')
    const resetPermissions: SelectedPermissions = {}
    permissionData.forEach(service => {
      resetPermissions[service.service] = []
    })
    setSelectedPermissions(resetPermissions)
    setHasChanges(false)
    try {
      await updateAccessLevels({
        id,
        accessLevels: []
      }).unwrap()
      toast.success('All permissions have been cleared.', {
        id: 'permissions-reset'
      })
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update access levels. Please try again.')
    }
    setUpdateOption(null)
  }

  const getTotalSelectedCount = () => {
    return Object.values(selectedPermissions).reduce((total, permissions) => total + permissions.length, 0)
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const filteredData = permissionData.filter(service => {
    const matchesSearch = service.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' ||
      Object.entries(SERVICE_CATEGORIES).some(([category, services]) => category === selectedCategory && services.includes(service.service))
    return matchesSearch && matchesCategory
  })

  const groupedData = Object.entries(SERVICE_CATEGORIES)
    .map(([category, services]) => ({
      category,
      services: services
        .filter(serviceName => filteredData.some(service => service.service === serviceName))
        .map(serviceName => permissionData.find(service => service.service === serviceName)!)
        .filter(Boolean)
    }))
    .filter(group => group.services.length > 0)

  const createPermission = checkAccess('Admins', 'permission_create').status

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto">
        {/* Header Section */}
        <Card className="mb-8 border-0 bg-white shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* User Info */}
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-gray-100">
                  <AvatarImage src={adminInfo.user?.avatar || ''} alt={adminInfo.user?.name} />
                  <AvatarFallback className="text-xl font-semibold">{adminInfo.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{adminInfo.user?.name}</h1>
                    <div className="mt-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{adminInfo.user?.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={adminInfo.user?.blocked ? 'destructive' : 'default'} className="px-3 py-1">
                      {adminInfo.user?.blocked ? (
                        <>
                          <Ban className="mr-1 h-3 w-3" />
                          Blocked
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Active
                        </>
                      )}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      <Shield className="mr-1 h-3 w-3" />
                      Administrator
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats & Info */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{format(new Date(adminInfo.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Last Active:</span>
                  <span className="font-medium">
                    {adminInfo.user?.lastActive ? format(new Date(adminInfo.user.lastActive), 'MMM d, yyyy') : 'N/A'}
                  </span>
                </div>
                <div className="col-span-2 mt-2 lg:col-span-1">
                  <div className="rounded-lg bg-blue-50 p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{getTotalSelectedCount()}</div>
                    <div className="text-sm text-blue-600">Permissions Assigned</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls Section */}
        <Card className="mb-8 border-0 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search & Filter */}
              <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="appearance-none rounded-md border border-gray-300 bg-white py-2 pr-8 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {Object.keys(SERVICE_CATEGORIES).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              {createPermission && (
                <div className="flex gap-3">
                  <Button onClick={handleReset} variant="outline" disabled={isUpdating} className="flex items-center gap-2">
                    <RotateCcw className={`h-4 w-4 ${updateOption === 'reset' && isUpdating ? 'animate-spin' : ''}`} />
                    Reset All
                  </Button>
                  <Button onClick={handleSave} disabled={!hasChanges || isUpdating} className="flex min-w-[140px] items-center gap-2">
                    {updateOption === 'save' && isUpdating ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Changes Indicator */}
            {hasChanges && (
              <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">You have unsaved changes</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permissions Grid */}
        <div className="space-y-8">
          {groupedData.map(({ category, services }) => {
            const isExpanded = expandedCategories[category]
            const categorySelectedCount = services.reduce((total, service) => {
              return total + (selectedPermissions[service.service]?.length || 0)
            }, 0)
            const categoryTotalCount = services.reduce((total, service) => total + service.access.length, 0)

            return (
              <Card key={category} className="border-0 bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" onClick={() => toggleCategory(category)} className="h-8 w-8 p-0">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
                        <p className="mt-1 text-sm text-gray-600">
                          {services.length} service{services.length !== 1 ? 's' : ''} • {categorySelectedCount}/{categoryTotalCount}{' '}
                          permissions selected
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{categorySelectedCount}</div>
                        <div className="text-xs text-gray-500">selected</div>
                      </div>
                      {createPermission && (
                        <Button size="sm" variant="outline" onClick={() => handleCategorySelectAll(category)} className="text-sm">
                          Select All
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                      {services.map((service: PermissionProps) => {
                        const servicePermissions = selectedPermissions[service.service] || []
                        const allSelected = service.access.every(p => servicePermissions.includes(p))
                        const someSelected = service.access.some(p => servicePermissions.includes(p))

                        return (
                          <Card
                            key={service.service}
                            className={`border transition-all hover:shadow-md ${
                              someSelected ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
                            }`}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {serviceIcons[service.service] || <Settings className="h-5 w-5 text-gray-500" />}
                                  <div>
                                    <CardTitle className="text-lg font-semibold">{service.service}</CardTitle>
                                    <p className="mt-1 text-xs text-gray-500">
                                      {servicePermissions.length} of {service.access.length} permissions
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={!createPermission}
                                  onClick={() => handleSelectAll(service.service, service.access)}
                                  className="h-8 w-8 p-0"
                                >
                                  {allSelected ? (
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400" />
                                  )}
                                </Button>
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                              <div className="space-y-2">
                                {service.access.map(permission => {
                                  const isChecked = servicePermissions.includes(permission)
                                  const permissionId = `${service.service}-${permission}`

                                  return (
                                    <div
                                      key={permission}
                                      className={`flex items-center space-x-3 rounded-lg border p-3 transition-all hover:bg-gray-50 ${
                                        isChecked ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                                      }`}
                                    >
                                      <Checkbox
                                        id={permissionId}
                                        checked={isChecked}
                                        disabled={!createPermission}
                                        onCheckedChange={checked => handlePermissionChange(service.service, permission, checked as boolean)}
                                      />
                                      <div className="flex flex-1 items-center gap-2">
                                        <span className={getActionColor(permission)}>
                                          {actionIcons[permission] || <Settings className="h-4 w-4" />}
                                        </span>
                                        <Label htmlFor={permissionId} className="flex-1 cursor-pointer text-sm font-medium capitalize">
                                          {permission.replace(/_/g, ' ')}
                                        </Label>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Summary Card */}
        {getTotalSelectedCount() > 0 && (
          <Card className="mt-8 border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Permission Summary</h3>
                    <p className="text-gray-600">
                      <span className="font-medium">{getTotalSelectedCount()}</span> permissions selected across{' '}
                      <span className="font-medium">{Object.values(selectedPermissions).filter(perms => perms.length > 0).length}</span>{' '}
                      services
                    </p>
                  </div>
                </div>
                {hasChanges && (
                  <Badge variant="outline" className="border-orange-300 bg-orange-50 px-3 py-1 text-orange-700">
                    <Clock className="mr-1 h-3 w-3" />
                    Unsaved Changes
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
