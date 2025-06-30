import { motion } from 'framer-motion'

export default function ProjectCardLoading() {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            type: 'tween',
            stiffness: 400,
            damping: 25,
            duration: 0.1 * (index + 1)
          }}
        >
          <div className="my-3 animate-pulse cursor-pointer rounded-lg border bg-gray-200 p-4">
            {/* Header */}
            <div className="mb-4 h-4 w-1/4 rounded bg-gray-300"></div>

            {/* Title and Payment Verified */}
            <div className="mb-2 flex items-center justify-between">
              <div className="h-6 w-1/2 rounded bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                <div className="h-4 w-24 rounded bg-gray-300"></div>
              </div>
            </div>

            {/* Rating & Location */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-4 w-4 rounded-full bg-gray-300"></div>
                ))}
              </div>
              <div className="mx-2 h-4 w-4 rounded bg-gray-300"></div>
              <div className="h-4 w-4 rounded-full bg-gray-300"></div>
              <div className="h-4 w-20 rounded bg-gray-300"></div>
            </div>

            {/* Budget */}
            <div className="mb-4 h-5 w-2/3 rounded bg-gray-300"></div>

            {/* Description */}
            <div className="mb-4 space-y-2">
              <div className="h-4 w-full rounded bg-gray-300"></div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {[...Array(Math.floor(Math.random() * 5) + 1)].map((_, index) => (
                <div key={index} className="h-6 w-20 rounded-full bg-gray-300 px-4 py-1"></div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </>
  )
}
