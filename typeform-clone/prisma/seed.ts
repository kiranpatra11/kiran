import { PrismaClient, FieldType } from '@prisma/client'

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
          { label: 'What is your name?', type: FieldType.SHORT_TEXT, orderIndex: 0 },
          { label: 'Your email', type: FieldType.EMAIL, orderIndex: 1 },
          { label: 'How satisfied are you? (1-10)', type: FieldType.NUMBER, orderIndex: 2 },
          { label: 'Additional comments', type: FieldType.LONG_TEXT, orderIndex: 3 },
        ],
      },
    },
  })
  console.log('Seeded form id:', form.id)
}

main().finally(() => prisma.$disconnect())