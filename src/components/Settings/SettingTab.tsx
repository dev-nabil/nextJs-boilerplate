// 'use client'
// import { Card, CardContent } from '@/components/ui/card'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { cn } from '@/lib/utils'

// export default function SettingTab({
//   activeTab,
//   setActiveTab,
//   tabOptions,
//   userType
// }: {
//   activeTab: string
//   setActiveTab: React.Dispatch<React.SetStateAction<string>>
//   tabOptions: { label: string; value: string; details: string }[]
//   userType: string
// }) {
//   const { data: devicesData, isLoading } = useGetDevicesQuery({})
//   const renderTabContent = (tabValue: string) => {
//     switch (tabValue) {
//       case 'edit-profile':
//         return <UserProfileInformation />
//       case 'password':
//         return <PasswordChange />
//       case 'wallet':
//         return <Wallet />
//       case 'verification':
//         return <Verification />
//       case 'project-history':
//         return <ProjectHistory />
//       case 'notifications':
//         return <NotificationSettings />
//       case 'subscriptions-plan':
//         return <SubscriptionPlan />
//       case 'boost-profile':
//         return <BoostProfile />
//       case 'transactions':
//         return <Wallet />
//       case 'withdraw':
//         return <Withdraw />
//       case 'device-login':
//         return <DeviceManagement devicesData={devicesData} isLoading={isLoading} />
//       default:
//         return <div>Select a tab to view content</div>
//     }
//   }

//   return (
//     <>
//       {/* Select Dropdown for Tabs */}
//       <div className="mb-3 block w-full sm:hidden">
//         <Select value={activeTab} onValueChange={setActiveTab}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select Tab" />
//           </SelectTrigger>
//           <SelectContent>
//             {tabOptions.map(tab => (
//               <SelectItem key={tab.value} value={tab.value}>
//                 {tab.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="grid w-full grid-cols-12 gap-5">
//         <TabsList className="col-span-3 hidden h-fit w-full flex-col justify-start overflow-hidden rounded-lg bg-white p-0 shadow-md sm:flex">
//           {tabOptions.map(tab => (
//             <TabsTrigger
//               key={tab.value}
//               value={tab.value}
//               className={cn(
//                 'data-[state=active]:bg-secondary w-full justify-start rounded-none border-b border-gray-200 py-3 font-normal text-black data-[state=active]:text-white data-[state=active]:shadow-none',
//                 activeTab === tab.value && 'text-primary flex'
//               )}
//             >
//               {tab.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         <div className="col-span-12 sm:col-span-9">
//           {tabOptions.map(tab => (
//             <TabsContent
//               className="mt-0 p-0"
//               key={tab.value}
//               value={tab.value}
//               data-state={activeTab === tab.value ? 'active' : 'inactive'}
//             >
//               <Card>
//                 <CardContent className="space-y-2 rounded-lg bg-white p-2 sm:p-5">{renderTabContent(tab.value)}</CardContent>
//               </Card>
//               {userType == 'seller' && activeTab == 'password' && <Authentication />}
//             </TabsContent>
//           ))}
//         </div>
//       </Tabs>
//     </>
//   )
// }
