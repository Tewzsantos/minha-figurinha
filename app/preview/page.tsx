import { Suspense } from 'react'
import PreviewClient from './PreviewClient'

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-verde border-t-transparent rounded-full" />
      </div>
    }>
      <PreviewClient />
    </Suspense>
  )
}
