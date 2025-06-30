import { Icons } from '@/components/custom/icons'
import fetchData from '@/lib/fetch'
import { MapPin, Smartphone } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function ClientFooter() {
  const cookieStore = await cookies()

  const settingsData: any = await fetchData('/settings/public', {
    exHeader: {
      cookie: cookieStore.toString()
    }
  })
  const { instagramUrl, linkedinUrl, facebookUrl, twitterUrl } = settingsData.data || {}

  return (
    <footer
      className="relative isolate mb-[4rem] w-full overflow-hidden text-white lg:mb-0"
      style={{
        background: 'linear-gradient(90deg,rgba(17, 83, 78, 1) 0%, rgba(14, 129, 112, 1) 50%, rgba(17, 147, 117, 1) 100%)'
      }}
    >
      <div
        className="absolute -top-[40%] left-[30%] z-[-1] h-[350px] w-[356px] rounded-full opacity-15"
        style={{
          background: 'linear-gradient(90deg,rgba(19, 180, 133, 1) 0%, rgba(18, 179, 159, 1) 100%)'
        }}
      ></div>
      <div
        className="absolute -bottom-[80%] -left-[5%] z-[-1] h-[533px] w-[550px] rounded-full opacity-35"
        style={{
          background: 'linear-gradient(90deg,rgba(19, 180, 133, 1) 0%, rgba(18, 179, 159, 1) 100%)'
        }}
      ></div>
      <div
        className="absolute -top-[40%] -right-[10%] z-[-1] h-[533px] w-[550px] rounded-full opacity-35"
        style={{
          background: 'linear-gradient(90deg,rgba(19, 180, 133, 1) 0%, rgba(18, 179, 159, 1) 100%)'
        }}
      ></div>
      <div className="relative z-50 mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-white p-2">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold">YahaChha</h2>
            </div>

            <p className="mb-6 max-w-xs text-teal-100">
              Providing premium creative services since 2010. Your Trusted partner for digital and design needs.
            </p>

            <div className="mt-4 flex space-x-3 sm:mt-5 sm:space-x-4">
              <Link
                href={instagramUrl || '#'}
                className="rounded-full border border-gray-50 p-2 text-white transition hover:bg-teal-600 sm:p-3"
              >
                <Icons.instagram className="sm:w/-6 h-5 w-5 sm:h-6" />
              </Link>
              <Link
                href={facebookUrl || 'https://www.facebook.com/'}
                className="rounded-full border border-gray-50 p-2 text-white transition hover:bg-teal-600 sm:p-3"
              >
                <Icons.facebook className="sm:w/-6 h-5 w-5 sm:h-6" />
              </Link>
              <Link
                href={linkedinUrl || 'https://bd.linkedin.com/'}
                className="rounded-full border border-gray-50 p-2 text-white transition hover:bg-teal-600 sm:p-3"
              >
                <Icons.LinkDin className="sm:w/-6 h-5 w-5 sm:h-6" />
              </Link>
              <Link
                href={twitterUrl || 'https://x.com/?lang=en'}
                className="rounded-full border border-gray-50 p-2 text-white transition hover:bg-teal-600 sm:p-3"
              >
                <Icons.PackageX className="sm:w/-6 h-5 w-5 sm:h-6" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3 text-teal-100">
              <li>
                <Link href="#service" className="transition-colors hover:text-white">
                  Service
                </Link>
              </li>
              <li>
                <Link href="#about" className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="transition-colors hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#register" className="transition-colors hover:text-white">
                  Register / Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Services</h3>
            <ul className="space-y-3 text-teal-100">
              <li>
                <Link href="#video-editing" className="transition-colors hover:text-white">
                  Video Editing Services
                </Link>
              </li>
              <li>
                <Link href="#photo-editing" className="transition-colors hover:text-white">
                  Photo Editing Services
                </Link>
              </li>
              <li>
                <Link href="#graphic-design" className="transition-colors hover:text-white">
                  Graphic Design Services
                </Link>
              </li>
              <li>
                <Link href="#photography" className="transition-colors hover:text-white">
                  Photography Services
                </Link>
              </li>
              <li>
                <Link href="#makeup" className="transition-colors hover:text-white">
                  Makeup Artist
                </Link>
              </li>
              <li>
                <Link href="#invitations" className="transition-colors hover:text-white">
                  Invitation Design & Printing
                </Link>
              </li>
              <li>
                <Link href="#marketing" className="transition-colors hover:text-white">
                  Social Media & Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Company</h3>
            <ul className="space-y-3 text-teal-100">
              <li>
                <Link href="#about" className="transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="#help" className="transition-colors hover:text-white">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="terms-and-conditions" className="transition-colors hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="privacy-policy" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-teal-500 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-teal-100">Copyright © 2010-2024 YahaChha. All Rights Reserved.</p>
            <div className="flex items-center gap-2 text-teal-100 transition-colors hover:text-white">
              <div className="rounded-full bg-white p-1">
                <Smartphone className="h-4 w-4 text-teal-600" />
              </div>
              <Link href="#mobile-app" className="text-sm">
                Mobile App
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
