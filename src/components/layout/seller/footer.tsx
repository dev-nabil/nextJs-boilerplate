import { Icons } from '@/components/custom/icons'
import { Instagram, Linkedin, MapPin, Share, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function SellerFooter() {
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
      <div className="relative z-50 mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-0">
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

            <div className="flex space-x-3">
              <a href="#" className="rounded-full bg-teal-500 p-3 text-white transition hover:bg-teal-400">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full bg-teal-500 p-3 text-white transition hover:bg-teal-400">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full bg-teal-500 p-3 text-white transition hover:bg-teal-400">
                <Icons.facebook className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full bg-teal-500 p-3 text-white transition hover:bg-teal-400">
                <Share className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3 text-teal-100">
              <li>
                <a href="#service" className="transition-colors hover:text-white">
                  Service
                </a>
              </li>
              <li>
                <a href="#about" className="transition-colors hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#register" className="transition-colors hover:text-white">
                  Register / Login
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Services</h3>
            <ul className="space-y-3 text-teal-100">
              <li>
                <a href="#video-editing" className="transition-colors hover:text-white">
                  Video Editing Services
                </a>
              </li>
              <li>
                <a href="#photo-editing" className="transition-colors hover:text-white">
                  Photo Editing Services
                </a>
              </li>
              <li>
                <a href="#graphic-design" className="transition-colors hover:text-white">
                  Graphic Design Services
                </a>
              </li>
              <li>
                <a href="#photography" className="transition-colors hover:text-white">
                  Photography Services
                </a>
              </li>
              <li>
                <a href="#makeup" className="transition-colors hover:text-white">
                  Makeup Artist
                </a>
              </li>
              <li>
                <a href="#invitations" className="transition-colors hover:text-white">
                  Invitation Design & Printing
                </a>
              </li>
              <li>
                <a href="#marketing" className="transition-colors hover:text-white">
                  Social Media & Marketing
                </a>
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
        <div className="mt-4 border-t border-teal-500 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-teal-100">Copyright © 2010-2024 YahaChha. All Rights Reserved.</p>
            <div className="flex items-center gap-2 text-teal-100 transition-colors hover:text-white">
              <div className="rounded-full bg-white p-1">
                <Smartphone className="h-4 w-4 text-teal-600" />
              </div>
              <a href="#mobile-app" className="text-sm">
                Mobile App
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
