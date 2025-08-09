import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default function NewFormPage() {
  async function createForm(formData: FormData) {
    'use server'
    const title = String(formData.get('title') || 'Untitled form')
    const description = String(formData.get('description') || '')
    const form = await prisma.form.create({ data: { title, description } })
    redirect(`/forms/${form.id}/edit`)
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create a new form</h1>
      <form action={createForm} className="space-y-4">
        <input name="title" placeholder="Form title" className="w-full rounded border px-3 py-2" />
        <textarea name="description" placeholder="Description" className="w-full rounded border px-3 py-2" />
        <button className="rounded bg-black px-4 py-2 text-white">Create</button>
      </form>
    </main>
  )
}