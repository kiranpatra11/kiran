import Link from 'next/link'

export default function ThanksPage({ params }: { params: { id: string } }) {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">Thanks for your response!</h1>
      <p className="mb-6 text-gray-600">We have recorded your submission.</p>
      <Link href={`/f/${params.id}`} className="rounded border px-3 py-1 text-sm">Back to form</Link>
    </main>
  )
}