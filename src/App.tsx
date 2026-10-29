import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { createAnnouncement, deleteAnnouncement, getAnnouncements } from './api'
import type { Announcement, AnnouncementDraft, Category } from './types'

const categories: Category[] = ['Недвижимость', 'Транспорт', 'Электроника', 'Работа', 'Услуги', 'Другое']
const initialDraft: AnnouncementDraft = { title: '', description: '', price: 0, category: 'Другое', city: '', author: '', phone: '' }

function dateLabel(date: string) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date(date))
}

export default function App() {
  const [items, setItems] = useState<Announcement[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'Все'>('Все')
  const [isModalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Announcement | null>(null)
  const [draft, setDraft] = useState(initialDraft)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { void load() }, [])
  async function load() {
    setLoading(true); setError('')
    try { setItems((await getAnnouncements()).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))) }
    catch (e) { setError(e instanceof Error ? e.message : 'Неизвестная ошибка') }
    finally { setLoading(false) }
  }
  const shown = useMemo(() => items.filter((item) =>
    (category === 'Все' || item.category === category) &&
    `${item.title} ${item.description} ${item.city}`.toLowerCase().includes(query.toLowerCase()),
  ), [items, category, query])
  function updateDraft<K extends keyof AnnouncementDraft>(name: K, value: AnnouncementDraft[K]) { setDraft((old) => ({ ...old, [name]: value })) }
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('')
    try { const item = await createAnnouncement(draft); setItems((old) => [item, ...old]); setDraft(initialDraft); setModalOpen(false) }
    catch (e) { setError(e instanceof Error ? e.message : 'Не удалось опубликовать объявление') }
  }
  async function remove(id: string) {
    if (!confirm('Удалить это объявление?')) return
    try { await deleteAnnouncement(id); setItems((old) => old.filter((item) => item.id !== id)); setSelected(null) }
    catch (e) { setError(e instanceof Error ? e.message : 'Не удалось удалить объявление') }
  }

  return <main>
    <header className="topbar"><a className="brand" href="/">Доска<span>+</span></a><button className="primary" onClick={() => setModalOpen(true)}>+ Подать объявление</button></header>
    <section className="hero"><div><p className="eyebrow">Быстро. Просто. Рядом.</p><h1>Найдите нужное<br />или продайте своё</h1><p>Объявления от людей для людей — в одном месте.</p></div><div className="hero-number"><strong>{items.length}</strong><span>объявления<br />уже опубликованы</span></div></section>
    <section className="controls" aria-label="Поиск и фильтры"><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Что вы ищете?" /></label><div className="chips"><button className={category === 'Все' ? 'chip active' : 'chip'} onClick={() => setCategory('Все')}>Все</button>{categories.map((name) => <button key={name} className={category === name ? 'chip active' : 'chip'} onClick={() => setCategory(name)}>{name}</button>)}</div></section>
    <section className="content"><div className="section-title"><h2>Свежие объявления</h2><span>{shown.length} найдено</span></div>{error && <p className="error">{error}</p>}{loading ? <p className="status">Загружаем объявления…</p> : shown.length ? <div className="grid">{shown.map((item) => <article className="card" key={item.id} onClick={() => setSelected(item)}><div className="card-top"><span className="tag">{item.category}</span><span>{dateLabel(item.createdAt)}</span></div><h3>{item.title}</h3><p>{item.description}</p><footer><strong>{item.price.toLocaleString('ru-RU')} сом</strong><span>⌖ {item.city}</span></footer></article>)}</div> : <div className="empty">По вашему запросу ничего не найдено.</div>}</section>
    <footer className="page-footer">Доска+ · учебный проект на React и TypeScript</footer>
    {isModalOpen && <div className="overlay" role="dialog" aria-modal="true"><form className="modal" onSubmit={submit}><button type="button" className="close" onClick={() => setModalOpen(false)}>×</button><p className="eyebrow">Новое объявление</p><h2>Расскажите, что предлагаете</h2><div className="form-grid"><label>Заголовок<input required value={draft.title} onChange={(e) => updateDraft('title', e.target.value)} placeholder="Например, продам велосипед" /></label><label>Категория<select value={draft.category} onChange={(e) => updateDraft('category', e.target.value as Category)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Цена, сом<input required min="0" type="number" value={draft.price || ''} onChange={(e) => updateDraft('price', Number(e.target.value))} /></label><label>Город<input required value={draft.city} onChange={(e) => updateDraft('city', e.target.value)} /></label><label>Ваше имя<input required value={draft.author} onChange={(e) => updateDraft('author', e.target.value)} /></label><label>Телефон<input required value={draft.phone} onChange={(e) => updateDraft('phone', e.target.value)} /></label></div><label>Описание<textarea required rows={4} value={draft.description} onChange={(e) => updateDraft('description', e.target.value)} /></label><button className="primary submit">Опубликовать</button></form></div>}
    {selected && <div className="overlay" role="dialog" aria-modal="true"><section className="modal detail"><button className="close" onClick={() => setSelected(null)}>×</button><span className="tag">{selected.category}</span><h2>{selected.title}</h2><strong className="price">{selected.price.toLocaleString('ru-RU')} сом</strong><p>{selected.description}</p><div className="contact"><span>Продавец: <b>{selected.author}</b></span><a href={`tel:${selected.phone.replace(/\s/g, '')}`}>{selected.phone}</a></div><div className="detail-actions"><small>⌖ {selected.city} · {dateLabel(selected.createdAt)}</small><button className="delete" onClick={() => void remove(selected.id)}>Удалить</button></div></section></div>}
  </main>
}
