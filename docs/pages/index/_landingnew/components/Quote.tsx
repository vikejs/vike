import { cmMerge } from '@classmatejs/react'
import React from 'react'

const QuoteSvgIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58.092 51" className="w-14 h-14 text-grey-200">
    <g fill="currentColor">
      <path d="M16.488 1.941A27.8 27.8 0 0 1 26.709 0v13.717c-1.62 0-3.226.305-4.723.897a12.4 12.4 0 0 0-4.004 2.554c-1.146 1.094-2.055 2.393-2.676 3.823s-.94 2.962-.94 4.51h2.122c3.13-.016 9.388 2.003 9.388 10.205V51H0V25.5c0-3.348.69-6.664 2.033-9.758s3.31-5.905 5.79-8.273a26.8 26.8 0 0 1 8.665-5.528zM47.87 1.941A27.8 27.8 0 0 1 58.091 0v13.717c-1.62 0-3.225.305-4.723.897a12.4 12.4 0 0 0-4.004 2.554c-1.146 1.094-2.055 2.393-2.675 3.823s-.94 2.962-.94 4.51h2.121c3.13-.016 9.388 2.003 9.388 10.205V51H31.382V25.5c0-3.348.691-6.664 2.033-9.758a25.5 25.5 0 0 1 5.79-8.273 26.8 26.8 0 0 1 8.665-5.528z"></path>
    </g>
  </svg>
)

interface QuoteProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  authorPictures: string[]
}

const Blockquote = ({ children, authorPictures, className, ...props }: QuoteProps) => {
  return (
    <div className={cmMerge('flex items-center gap-3 justify-between', className)} {...props}>
      <div className="flex flex-1">
        <QuoteSvgIcon />
        <blockquote className="italic text-grey">{children}</blockquote>
      </div>
      {authorPictures && authorPictures.length > 0 && (
        <div className="flex -space-x-2">
          {authorPictures.map((src, index) => {
            const isLast = index === authorPictures.length - 1

            return (
              <img
                key={index}
                src={src}
                alt={`Author ${index + 1}`}
                className={cmMerge(isLast ? '' : '', 'w-8 h-8 rounded-full border-2 border-white')}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Blockquote
