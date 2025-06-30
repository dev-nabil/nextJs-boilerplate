import { sellerRoutes } from '@/routes/routes';
import { UserSettingsCardProps } from '@/types';
import { Cog, Crown, LogOut, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const UserSettingsCard: FC<UserSettingsCardProps> = ({
  id,
  name,
  title,
  imageSrc,
  isOnline,
  isBuyer,
  onToggleOnline,
  onToggleBuyer,
  onLogout,
}) => {
  return (
    <div className=" bg-white min-w-52">
      <div className="flex flex-col items-center">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={name}
            width={80}
            height={80}
            className="rounded-full w-[65px] h-[65px] object-cover border-4 border-green-500"
          />
        )}
        <h3 className="mt-3 text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500 capitalize">{title}</p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Online</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isOnline} onChange={onToggleOnline} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full dark:peer-focus:ring-green-800 dark:bg-gray-700 peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Switch to Buyer</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isBuyer} onChange={onToggleBuyer} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Link
          href={sellerRoutes.profile(title, id as string)}
          className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-gray-800"
        >
          <UserRound />
          <span>Your Profile</span>
        </Link>
        <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-gray-800">
          <Crown className="text-purple-500" />
          <span>Membership Plan</span>
        </div>
        <Link href={`/settings`} className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-gray-800">
          <Cog />
          <span>Account Settings</span>
        </Link>
        <div className="flex items-center gap-3 text-red-500 cursor-pointer hover:text-red-600" onClick={onLogout}>
          <LogOut />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsCard;
