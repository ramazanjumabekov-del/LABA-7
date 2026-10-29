import type { Announcement, AnnouncementDraft } from './types'

const key = 'noticeboard-announcements'
const endpoint = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

const examples: Announcement[] = [
  { id: '1', title: 'iPhone 13, 128 GB', description: 'Отличное состояние, полный комплект. Аккумулятор 89%.', price: 42000, category: 'Электроника', city: 'Бишкек', author: 'Айдана', phone: '+996 555 123 456', createdAt: '2026-10-28T10:30:00.000Z' },
  { id: '2', title: 'Сдам 1-комнатную квартиру', description: 'Уютная квартира в центре, рядом с остановкой. На долгий срок.', price: 30000, category: 'Недвижимость', city: 'Бишкек', author: 'Нурбек', phone: '+996 700 222 333', createdAt: '2026-10-27T08:00:00.000Z' },
  { id: '3', title: 'Репетитор по английскому', description: 'Индивидуальные занятия онлайн и офлайн для школьников и взрослых.', price: 900, category: 'Услуги', city: 'Ош', author: 'Мария', phone: '+996 777 444 555', createdAt: '2026-10-26T14:20:00.000Z' },
]

function localItems(): Announcement[] {
  const saved = localStorage.getItem(key)
  if (!saved) return examples
  try { return JSON.parse(saved) as Announcement[] } catch { return examples }
}
function saveLocal(items: Announcement[]) { localStorage.setItem(key, JSON.stringify(items)) }

export async function getAnnouncements(): Promise<Announcement[]> {
  if (!endpoint) return localItems()
  const response = await fetch(`${endpoint}/announcements`)
  if (!response.ok) throw new Error('Не удалось загрузить объявления')
  return response.json() as Promise<Announcement[]>
}

export async function createAnnouncement(draft: AnnouncementDraft): Promise<Announcement> {
  if (!endpoint) {
    const item: Announcement = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    saveLocal([item, ...localItems()])
    return item
  }
  const response = await fetch(`${endpoint}/announcements`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) })
  if (!response.ok) throw new Error('Не удалось опубликовать объявление')
  return response.json() as Promise<Announcement>
}

export async function deleteAnnouncement(id: string): Promise<void> {
  if (!endpoint) { saveLocal(localItems().filter((item) => item.id !== id)); return }
  const response = await fetch(`${endpoint}/announcements/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Не удалось удалить объявление')
}
