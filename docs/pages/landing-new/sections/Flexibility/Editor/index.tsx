// react tree view component:
// +
// shiki

import React from 'react'
import FlexFileTree from './Tree'
import Blockquote from '../../../components/Quote'
import { ChevronRight, ExternalLink } from 'lucide-react'

const ReadOnlyEditor = () => {
  return (
    <>
      <div className="grid grid-cols-2 min-h-100 bg-base-300 z-4 relative border-5 border-primary -mt-0.5 rounded-box">
        <FlexFileTree />
        <div>read-only editor here</div>
      </div>
      <div className="grid grid-cols-8">
        <div className="col-span-4 flex items-center">
          <Blockquote
            authorPictures={['/assets/images/flexibility/author1.jpg', '/assets/images/flexibility/author2.jpg']}
            className="items-start text-sm"
          >
            "Vike's flexibility is a game-changer. It allows us to seamlessly integrate with our existing tools and
            workflows.
          </Blockquote>
        </div>
        <div className="col-span-4 flex justify-end items-center gap-2">
          <a className="btn btn-primary" href="/docs/hooks/introduction">
            Spin it up on Stackblitz <ExternalLink className="w-4 h-4" />
          </a>
          <a className="btn btn-primary" href="/docs/hooks/introduction">
            Checkout the Stack (Bati) <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  )
}

export default ReadOnlyEditor
