const { PrismaClient, FieldType } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const form = await prisma.form.upsert({
    where: { id: 'demo' },
    update: {},
    create: {
      id: 'demo',
      title: 'Customer Feedback',
      description: 'Help us improve by answering a few questions',
      fields: {
        create: [
          { label: 'What is your name?', type: FieldType.SHORT_TEXT, orderIndex: 0, options: [] },
          { label: 'Your email', type: FieldType.EMAIL, orderIndex: 1, options: [] },
          { label: 'How satisfied are you? (1-10)', type: FieldType.NUMBER, orderIndex: 2, options: [] },
          { label: 'Additional comments', type: FieldType.LONG_TEXT, orderIndex: 3, options: [] },
        ],
      },
    },
  })
  console.log('Seeded form id:', form.id)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})