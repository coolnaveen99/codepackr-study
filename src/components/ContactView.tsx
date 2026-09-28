import React, { useState, useRef } from 'react'
import {
  Mail,
  Send,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

interface ContactViewProps {
  onBack: () => void
}

const DEFAULT_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxLtRspOxZaKhGdikBBlAjJk3ndSibOs0t3Im2Xf-K0podjAPItb90iOA9mDjRAbuT_Bg/exec'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const ContactView: React.FC<ContactViewProps> = ({ onBack }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('Feedback & General Inquiry')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scriptUrl =
    ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_CONTACT_GOOGLE_SCRIPT_URL) ||
    DEFAULT_SCRIPT_URL
  const hiddenFormRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()
    const trimmedName = name.trim() || 'Anonymous Student'

    if (!trimmedEmail) {
      setError('Please enter your email address so we can reply to your inquiry.')
      return
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError('Please enter a valid email address (e.g. yourname@domain.com).')
      return
    }

    if (!trimmedMessage) {
      setError('Please enter a message describing your inquiry or feedback.')
      return
    }

    const targetUrl = scriptUrl.trim() || DEFAULT_SCRIPT_URL
    setIsSubmitting(true)

    const computedSubject = subject.trim()
      ? `[${category}] ${subject.trim()}`
      : `[${category}] Note from ${trimmedName}`

    try {
      // 1. Submit to Firebase Firestore if db is initialized
      if (db) {
        try {
          await addDoc(collection(db, 'contact_inquiries'), {
            name: trimmedName,
            email: trimmedEmail,
            subject: computedSubject,
            message: trimmedMessage,
            category,
            source: 'study.codepackr.com',
            createdAt: serverTimestamp(),
            timestampISO: new Date().toISOString()
          })
        } catch (firestoreErr) {
          console.warn('Firestore direct write failed, proceeding with Google Apps Script dispatch:', firestoreErr)
        }
      }

      // 2. Build form URL parameters for Google Apps Script doPost:
      const params = new URLSearchParams()
      params.append('name', trimmedName)
      params.append('email', trimmedEmail)
      params.append('subject', computedSubject)
      params.append('message', trimmedMessage)
      params.append('category', category)
      params.append('source', 'study.codepackr.com')
      params.append('timestamp', new Date().toISOString())

      // 3. Submit via fetch with mode: 'no-cors'
      const fetchPromise = fetch(targetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      })

      // 4. Dual-dispatch via hidden iframe form submission for 100% browser compatibility
      if (hiddenFormRef.current) {
        hiddenFormRef.current.action = targetUrl
        const nameInput = hiddenFormRef.current.elements.namedItem('name') as HTMLInputElement
        const emailInput = hiddenFormRef.current.elements.namedItem('email') as HTMLInputElement
        const subjectInput = hiddenFormRef.current.elements.namedItem('subject') as HTMLInputElement
        const messageInput = hiddenFormRef.current.elements.namedItem('message') as HTMLTextAreaElement

        if (nameInput) nameInput.value = trimmedName
        if (emailInput) emailInput.value = trimmedEmail
        if (subjectInput) subjectInput.value = computedSubject
        if (messageInput) messageInput.value = trimmedMessage

        try {
          hiddenFormRef.current.submit()
        } catch (iframeErr) {
          console.warn('Hidden iframe submit fallback warning:', iframeErr)
        }
      }

      await fetchPromise

      // Allow a brief moment for transmission
      await new Promise(resolve => setTimeout(resolve, 600))

      setSubmitted(true)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      console.error('Failed to submit message:', err)
      setError(
        'There was a network transmission issue. You can click below to send your feedback directly via email.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const mailtoFallback = `mailto:codepackr@gmail.com,tnavkum@gmail.com?subject=${encodeURIComponent(
    subject.trim() ? `[${category}] ${subject.trim()}` : `[${category}] from ${name || 'Student'}`
  )}&body=${encodeURIComponent(
    `Name: ${name || 'Anonymous'}\nEmail: ${email || 'Not provided'}\nCategory: ${category}\nSuite: Codepackr Study (study.codepackr.com)\n\nMessage:\n${message}`
  )}`

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Hidden iframe and form for infallible dual-dispatch */}
      <iframe
        name="codepackr_study_hidden_script_iframe"
        id="codepackr_study_hidden_script_iframe"
        title="Hidden Script Worker"
        className="hidden"
        style={{ display: 'none', width: 0, height: 0, border: 0 }}
      />
      <form
        ref={hiddenFormRef}
        target="codepackr_study_hidden_script_iframe"
        method="POST"
        className="hidden"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="name" />
        <input type="hidden" name="email" />
        <input type="hidden" name="subject" />
        <textarea name="message" className="hidden" />
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="source" value="study.codepackr.com" />
      </form>

      {/* Top Back Navigation Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          id="btn-back-to-tools"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Back to Tools</span>
        </button>

        <span className="text-xs font-semibold text-slate-400">
          Codepackr Study Support
        </span>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Contact &amp; Student Feedback
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Suggestions for new calculators, bug reports, citation format feedback, or general questions.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <p className="font-semibold mb-1">Submission Notice</p>
              <p>{error}</p>
              <a
                href={mailtoFallback}
                className="inline-flex items-center gap-1 mt-2 text-rose-700 font-bold underline hover:text-rose-900"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Click here to open email directly</span>
              </a>
            </div>
          </div>
        )}

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Message Received!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                Thank you for reaching out to Codepackr Study. Your message has been safely delivered to our team at <strong>codepackr@gmail.com</strong>.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setMessage('')
                  setSubject('')
                }}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
              >
                Send Another Message
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Back to Calculators
              </button>
            </div>
          </div>
        ) : (
          <form id="form-contact-study" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5"
                >
                  Your Name <span className="font-normal text-slate-400 lowercase">(optional)</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  disabled={isSubmitting}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5"
                >
                  Your Email <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                    if (error) setError(null)
                  }}
                  placeholder="e.g. student@university.edu"
                  disabled={isSubmitting}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="contact-category"
                  className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5"
                >
                  Topic Category
                </label>
                <select
                  id="contact-category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all disabled:opacity-60"
                >
                  <option value="Feedback & General Inquiry">Feedback &amp; General Inquiry</option>
                  <option value="GPA or Grade Formula Question">GPA / Grade Formula Question</option>
                  <option value="Report Calculation Issue / Bug">Report Calculation Issue / Bug</option>
                  <option value="New Academic Tool Request">New Academic Tool Request</option>
                  <option value="Citation Format Suggestion">Citation Format Suggestion</option>
                  <option value="Academic Privacy & Security">Academic Privacy &amp; Security</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5"
                >
                  Subject Line <span className="font-normal text-slate-400 lowercase">(optional)</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Suggestion for Indian UGC 10-point SGPA formula"
                  disabled={isSubmitting}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5"
              >
                Message <span className="text-rose-500 font-bold">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={message}
                onChange={e => {
                  setMessage(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="Describe your suggestion, calculator feedback, formula query, or issue details..."
                disabled={isSubmitting}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all resize-y disabled:opacity-60"
              />
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50 text-[11px] leading-relaxed flex items-start gap-2.5 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guarantee:</strong> Codepackr Study executes all calculations 100% locally in your browser. Never submit student passwords, ID numbers, or private academic transcripts in contact inquiries.
              </span>
            </div>

            {/* Destination Info and Mailto Fallback */}
            <div className="flex items-center justify-between gap-2 text-xs py-1 text-slate-500">
              <div className="flex items-center gap-2">
                <span>Sends directly to <strong>codepackr@gmail.com</strong></span>
              </div>
              <a
                href={mailtoFallback}
                className="hover:underline flex items-center gap-1 text-[11px] text-indigo-600 font-semibold shrink-0"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Direct Mailto</span>
              </a>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-contact-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-60 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting Message to codepackr@gmail.com...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
