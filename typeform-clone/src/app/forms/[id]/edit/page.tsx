import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function EditFormPage({ params }: { params: { id: string } }) {
  const form = await prisma.form.findUnique({ where: { id: params.id }, include: { fields: { orderBy: { orderIndex: 'asc' } } } })
  if (!form) return notFound()

  async function updateForm(formData: FormData) {
    'use server'
    const title = String(formData.get('title') || '')
    const description = String(formData.get('description') || '')
    await prisma.form.update({ where: { id: form.id }, data: { title, description } })
  }

  async function addField(formData: FormData) {
    'use server'
    const label = String(formData.get('label') || 'Question')
    const type = String(formData.get('type') || 'SHORT_TEXT') as any
    const isRequired = Boolean(formData.get('isRequired'))
    const orderIndex = (form.fields.at(-1)?.orderIndex ?? -1) + 1
    await prisma.field.create({ data: { formId: form.id, label, type, isRequired, options: [], orderIndex } })
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit form</h1>
        <div className="flex gap-2">
          <Link href={`/f/${form.id}`} className="rounded border px-3 py-1 text-sm">Preview</Link>
        </div>
      </div>

      <form action={updateForm} className="mb-6 space-y-3">
        <input name="title" defaultValue={form.title} className="w-full rounded border px-3 py-2" />
        <textarea name="description" defaultValue={form.description ?? ''} className="w-full rounded border px-3 py-2" />
        <button className="rounded border px-3 py-1 text-sm">Save</button>
      </form>

      <div className="mb-4 text-lg font-medium">Fields</div>
      <ul className="mb-6 space-y-2">
        {form.fields.map((field) => (
          <li key={field.id} className="rounded border p-3">
            <div className="text-sm text-gray-500">{field.type}</div>
            <div className="text-base font-medium">{field.label}</div>
          </li>
        ))}
        {form.fields.length === 0 && (
          <li className="rounded border p-6 text-gray-600">No fields yet.</li>
        )}
      </ul>

      <form action={addField} className="flex flex-wrap items-end gap-3 rounded border p-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm">Label</label>
          <input name="label" placeholder="Question text" className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm">Type</label>
          <select name="type" className="rounded border px-3 py-2">
            <option value="SHORT_TEXT">Short text</option>
            <option value="LONG_TEXT">Long text</option>
            <option value="EMAIL">Email</option>
            <option value="NUMBER">Number</option>
            <option value="BOOLEAN">Yes/No</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="isRequired" id="isRequired" />
          <label htmlFor="isRequired">Required</label>
        </div>
        <button className="rounded bg-black px-4 py-2 text-white">Add field</button>
      </form>
    </main>
  )
}