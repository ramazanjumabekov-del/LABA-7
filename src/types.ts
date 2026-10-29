export type Category = 'Недвижимость' | 'Транспорт' | 'Электроника' | 'Работа' | 'Услуги' | 'Другое'

export interface Announcement {
  id: string
  title: string
  description: string
  price: number
  category: Category
  city: string
  author: string
  phone: string
  createdAt: string
}

export type AnnouncementDraft = Omit<Announcement, 'id' | 'createdAt'>
