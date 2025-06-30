import AvatarWithInfo from '@/components/shared/AvatarWithInfo'

export default function SettingsInformation({ name, image, details, tab }: { name: string; image?: string; details: string; tab: string }) {
  return (
    <>
      <AvatarWithInfo
        name={name}
        active={false}
        title={`${name} / ${tab?.charAt(0).toUpperCase() + tab?.slice(1, tab.length).split('-').join(' ')}`}
        details={details?.charAt(0).toUpperCase() + details?.slice(1, details.length)}
        image={image}
        imageClass="w-16 h-16 object-cover rounded-full"
      />
    </>
  )
}
