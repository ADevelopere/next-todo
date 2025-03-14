import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Todo App - Stay Organized',
    description: 'A simple and elegant todo application to help you stay organized',
    viewport: 'width=device-width, initial-scale=1',
    icons: {
      icon: '/47-to-do-list.svg',
      shortcut: '/47-to-do-list.svg',
      apple: '/47-to-do-list.svg',
      other: {
        rel: 'mask-icon',
        url: '/47-to-do-list.svg',
      },
    }
  }
}

export const metadata: Metadata = generateMetadata()
