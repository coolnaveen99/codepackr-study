import React from 'react'

type Page = 'about' | 'privacy'

interface Props {
  page: Page
  onBack: () => void
  onOpenContact: () => void
  onOpenPrivacy?: () => void
}

export const LegalTrustView: React.FC<Props> = ({ page, onBack, onOpenContact }) => {
  const isAbout = page === 'about'
  return (
    <article className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <button onClick={onBack} className="text-sm font-semibold text-indigo-600 hover:underline">
        ← Back to Study tools
      </button>
      <header className="space-y-2 border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {isAbout ? 'About Codepackr Study' : 'Privacy Policy — Codepackr Study'}
        </h1>
        <p className="text-sm text-slate-600">Last updated: 25 September 2026 · Operated from Chennai, India</p>
      </header>
      <section className="space-y-2 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900">Who operates this site</h2>
        <p>Codepackr Study is an independent student-tools site operated by <strong>Naveen</strong> in Chennai, India.</p>
        <h2 className="text-base font-bold text-slate-900">Privacy and ads</h2>
        <p>Tools run in the browser. Google AdSense (ca-pub-7526363571565796) may show ads and use cookies. Contact: <a className="text-indigo-600 font-semibold underline" href="mailto:codepackr@gmail.com">codepackr@gmail.com</a>.</p>
        <button type="button" onClick={onOpenContact} className="text-indigo-600 font-semibold underline">Open contact form</button>
      </section>
    </article>
  )
}
