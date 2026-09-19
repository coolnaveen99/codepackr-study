import { useState, type FormEvent } from 'react'
import { ArrowLeft, Mail, Send, CheckCircle2, AlertCircle, MessageSquare, ShieldCheck } from 'lucide-react'

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxLtRspOxZaKhGdikBBlAjJk3ndSibOs0t3Im2Xf-K0podjAPItb90iOA9mDjRAbuT_Bg/exec'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ContactView({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('Feedback & General Comment')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()
    const trimmedName = name.trim() || 'Anonymous Student'
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!trimmedMessage) {
      setError('Please enter a message.')
      return
    }
    setBusy(true)
    const computedSubject = subject.trim() ? `[${category}] ${subject.trim()}` : `[${category}] Note from ${trimmedName}`
    const params = new URLSearchParams({
      name: trimmedName,
      email: trimmedEmail,
      subject: computedSubject,
      message: trimmedMessage,
      category,
      timestamp: new Date().toISOString(),
      source: 'study.codepackr.com',
    })
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
      setDone(true)
      setName(''); setEmail(''); setSubject(''); setMessage('')
    } catch {
      setError('Network issue. Use the email fallback below.')
    } finally {
      setBusy(false)
    }
  }

  const mailto = `mailto:codepackr@gmail.com?subject=${encodeURIComponent(subject || 'Codepackr Study feedback')}&body=${encodeURIComponent(message)}`

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to tools
      </button>
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-600 text-white"><MessageSquare className="w-5 h-5" /></span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contact & Feedback</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">Same inbox as codepackr.com — messages go to codepackr@gmail.com.</p>
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error} <a className="underline font-semibold" href={mailto}>Email instead</a>
          </div>
        )}
        {done ? (
          <div className="text-center space-y-3 py-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="font-bold">Message sent</p>
            <button type="button" onClick={() => setDone(false)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold">Send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm">
                <option>Feedback & General Comment</option>
                <option>Bug Report</option>
                <option>New Tool Request</option>
                <option>Feature Improvement</option>
                <option>Security or Privacy</option>
              </select>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (optional)" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm" />
            </div>
            <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message *" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm" />
            <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Same webhook as codepackr.com</span>
              <button disabled={busy} type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-50">
                <Send className="w-4 h-4" /> {busy ? 'Sending…' : 'Send'}
              </button>
            </div>
            <a href={mailto} className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"><Mail className="w-3.5 h-3.5" /> codepackr@gmail.com</a>
          </form>
        )}
      </div>
    </div>
  )
}
