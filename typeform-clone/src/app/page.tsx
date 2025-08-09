import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const forms = await prisma.form.findMany({ orderBy: { updatedAt: 'desc' } })

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your forms</h1>
        <Link href="/forms/new" className="rounded bg-black px-4 py-2 text-white hover:bg-gray-900">New form</Link>
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {forms.map((f) => (
          <li key={f.id} className="rounded border p-4 hover:shadow">
            <div className="mb-2 text-lg font-medium">{f.title || 'Untitled form'}</div>
            <div className="mb-4 text-sm text-gray-600 line-clamp-2">{f.description}</div>
            <div className="flex gap-2">
              <Link href={`/forms/${f.id}/edit`} className="rounded border px-3 py-1 text-sm">Edit</Link>
              <Link href={`/f/${f.id}`} className="rounded border px-3 py-1 text-sm">Open</Link>
            </div>
          </li>
        ))}
        {forms.length === 0 && (
          <li className="rounded border p-6 text-gray-600">No forms yet. Create one to get started.</li>
        )}
      </ul>
    </main>
  )
}