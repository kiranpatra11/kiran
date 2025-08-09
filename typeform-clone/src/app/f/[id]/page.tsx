import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function RunFormPage({ params }: { params: { id: string } }) {
  const form = await prisma.form.findUnique({ where: { id: params.id }, include: { fields: { orderBy: { orderIndex: 'asc' } } } })
  if (!form) return notFound()

  async function submit(formData: FormData) {
    'use server'
    const submission = await prisma.submission.create({ data: { formId: form.id } })
    const answersData: { fieldId: string; value: any }[] = []
    for (const field of form.fields) {
      const key = `field_${field.id}`
      const raw = formData.get(key)
      if (raw != null && String(raw).length > 0) {
        answersData.push({ fieldId: field.id, value: parseValue(field.type, raw) })
      }
    }
    if (answersData.length > 0) {
      await prisma.answer.createMany({ data: answersData.map(a => ({ submissionId: submission.id, fieldId: a.fieldId, value: a.value })) })
    }
    redirect(`/f/${form.id}/thanks`)
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">{form.title}</h1>
      {form.description && <p className="mb-6 text-gray-600">{form.description}</p>}
      <form action={submit} className="space-y-4">
        {form.fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm text-gray-700">{field.label}{field.isRequired && ' *'}</label>
            <FieldInput field={field} />
          </div>
        ))}
        <button className="rounded bg-black px-4 py-2 text-white">Submit</button>
      </form>
    </main>
  )
}

function parseValue(type: string, raw: FormDataEntryValue) {
  const value = String(raw)
  switch (type) {
    case 'NUMBER':
      return Number(value)
    case 'BOOLEAN':
      return value === 'on' || value === 'true'
    default:
      return value
  }
}

function FieldInput({ field }: { field: { id: string; type: string; isRequired: boolean } }) {
  const name = `field_${field.id}`
  switch (field.type) {
    case 'LONG_TEXT':
      return <textarea name={name} required={field.isRequired} className="w-full rounded border px-3 py-2" />
    case 'EMAIL':
      return <input type="email" name={name} required={field.isRequired} className="w-full rounded border px-3 py-2" />
    case 'NUMBER':
      return <input type="number" name={name} required={field.isRequired} className="w-full rounded border px-3 py-2" />
    case 'BOOLEAN':
      return <input type="checkbox" name={name} className="h-4 w-4" />
    default:
      return <input name={name} required={field.isRequired} className="w-full rounded border px-3 py-2" />
  }
}