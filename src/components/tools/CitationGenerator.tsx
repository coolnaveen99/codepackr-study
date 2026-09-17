import React, { useState, useMemo } from 'react'
import { BookOpen, Copy, Check } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'
import { CitationStyle, SourceType } from '../../types'

interface BookFields {
  authors: string // e.g. "Kahneman, Daniel"
  title: string   // e.g. "Thinking, Fast and Slow"
  publisher: string // e.g. "Farrar, Straus and Giroux"
  year: string    // e.g. "2011"
  edition?: string // e.g. "1st"
}

interface JournalFields {
  authors: string // e.g. "Watson, James D., & Crick, Francis H."
  articleTitle: string // e.g. "Molecular Structure of Nucleic Acids"
  journalName: string // e.g. "Nature"
  year: string // e.g. "1953"
  volume: string // e.g. "171"
  issue: string // e.g. "4356"
  pages: string // e.g. "737-738"
  doi: string // e.g. "10.1038/171737a0"
}

interface WebFields {
  authorOrOrg: string // e.g. "World Health Organization"
  pageTitle: string // e.g. "Mental health: strengthening our response"
  siteName: string // e.g. "WHO Newsroom"
  publishYear: string // e.g. "2022"
  url: string // e.g. "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"
  accessDate: string // e.g. "2026-03-15"
}

export const CitationGenerator: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'citation-generator')!
  const [style, setStyle] = useState<CitationStyle>('APA')
  const [sourceType, setSourceType] = useState<SourceType>('book')

  const [book, setBook] = useState<BookFields>({
    authors: 'Kahneman, Daniel',
    title: 'Thinking, Fast and Slow',
    publisher: 'Farrar, Straus and Giroux',
    year: '2011',
    edition: ''
  })

  const [journal, setJournal] = useState<JournalFields>({
    authors: 'Watson, James D., and Francis H. Crick',
    articleTitle: 'Molecular structure of nucleic acids: A structure for deoxyribose nucleic acid',
    journalName: 'Nature',
    year: '1953',
    volume: '171',
    issue: '4356',
    pages: '737-738',
    doi: '10.1038/171737a0'
  })

  const [web, setWeb] = useState<WebFields>({
    authorOrOrg: 'NASA',
    pageTitle: 'James Webb Space Telescope: Unfolding the Universe',
    siteName: 'NASA Astrophysics',
    publishYear: '2023',
    url: 'https://science.nasa.gov/mission/webb',
    accessDate: '2026-02-10'
  })

  const [copiedBib, setCopiedBib] = useState(false)
  const [copiedInText, setCopiedInText] = useState(false)

  // Format citations
  const { bibText, bibHtml, inText } = useMemo(() => {
    let bib = ''
    let html = ''
    let inTextCitation = ''

    if (sourceType === 'book') {
      const author = book.authors.trim() || 'Author, A.'
      const year = book.year.trim() || 'n.d.'
      const title = book.title.trim() || 'Book Title'
      const pub = book.publisher.trim() ? `${book.publisher.trim()}.` : ''
      const firstAuthorLastName = author.split(',')[0].trim() || 'Author'

      if (style === 'APA') {
        bib = `${author} (${year}). ${title}. ${pub}`
        html = `${author} (${year}). <em>${title}</em>. ${pub}`
        inTextCitation = `(${firstAuthorLastName}, ${year})`
      } else if (style === 'MLA') {
        bib = `${author}. ${title}. ${pub} ${year}.`
        html = `${author}. <em>${title}</em>. ${pub} ${year}.`
        inTextCitation = `(${firstAuthorLastName} 45)`
      } else if (style === 'Harvard') {
        bib = `${author}, ${year}. ${title}. ${pub}`
        html = `${author}, ${year}. <em>${title}</em>. ${pub}`
        inTextCitation = `(${firstAuthorLastName}, ${year})`
      } else { // Chicago
        bib = `${author}. ${year}. ${title}. ${pub}`
        html = `${author}. ${year}. <em>${title}</em>. ${pub}`
        inTextCitation = `(${firstAuthorLastName} ${year})`
      }
    } else if (sourceType === 'journal') {
      const author = journal.authors.trim() || 'Author, A.'
      const year = journal.year.trim() || 'n.d.'
      const artTitle = journal.articleTitle.trim() || 'Article Title'
      const jName = journal.journalName.trim() || 'Journal Name'
      const vol = journal.volume.trim()
      const issue = journal.issue.trim()
      const pages = journal.pages.trim()
      const doi = journal.doi.trim() ? `https://doi.org/${journal.doi.trim().replace(/^https?:\/\/doi.org\//, '')}` : ''
      const firstAuthorLastName = author.split(',')[0].trim() || 'Author'

      if (style === 'APA') {
        const issuePart = issue ? `(${issue})` : ''
        const pagesPart = pages ? `, ${pages}` : ''
        const doiPart = doi ? ` ${doi}` : ''
        bib = `${author} (${year}). ${artTitle}. ${jName}, ${vol}${issuePart}${pagesPart}.${doiPart}`
        html = `${author} (${year}). ${artTitle}. <em>${jName}</em>, <em>${vol}</em>${issuePart}${pagesPart}.${doiPart}`
        inTextCitation = `(${firstAuthorLastName}, ${year})`
      } else if (style === 'MLA') {
        const volPart = vol ? `vol. ${vol}, ` : ''
        const issPart = issue ? `no. ${issue}, ` : ''
        const yrPart = `${year}, `
        const ppPart = pages ? `pp. ${pages}.` : ''
        bib = `${author}. "${artTitle}." ${jName}, ${volPart}${issPart}${yrPart}${ppPart}`
        html = `${author}. "${artTitle}." <em>${jName}</em>, ${volPart}${issPart}${yrPart}${ppPart}`
        inTextCitation = `(${firstAuthorLastName} ${pages.split('-')[0] || '12'})`
      } else if (style === 'Harvard') {
        const volPart = vol ? `${vol}` : ''
        const issPart = issue ? `(${issue})` : ''
        const ppPart = pages ? `, pp.${pages}` : ''
        bib = `${author}, ${year}. ${artTitle}. ${jName}, ${volPart}${issPart}${ppPart}.`
        html = `${author}, ${year}. '${artTitle}', <em>${jName}</em>, ${volPart}${issPart}${ppPart}.`
        inTextCitation = `(${firstAuthorLastName}, ${year})`
      } else { // Chicago
        const volPart = vol ? `${vol}` : ''
        const issPart = issue ? `, no. ${issue}` : ''
        const yrPart = ` (${year}): `
        const ppPart = pages ? `${pages}.` : '.'
        bib = `${author}. ${year}. "${artTitle}." ${jName} ${volPart}${issPart}${yrPart}${ppPart}`
        html = `${author}. ${year}. "${artTitle}." <em>${jName}</em> ${volPart}${issPart}${yrPart}${ppPart}`
        inTextCitation = `(${firstAuthorLastName} ${year}, ${pages.split('-')[0] || '737'})`
      }
    } else { // Website
      const author = web.authorOrOrg.trim() || 'Author / Organization'
      const year = web.publishYear.trim() || 'n.d.'
      const title = web.pageTitle.trim() || 'Page Title'
      const site = web.siteName.trim()
      const url = web.url.trim() || 'https://example.com'
      const firstAuthorLastName = author.split(',')[0].trim() || 'Author'

      if (style === 'APA') {
        const sitePart = site ? `${site}. ` : ''
        bib = `${author}. (${year}). ${title}. ${sitePart}${url}`
        html = `${author}. (${year}). <em>${title}</em>. ${sitePart}<a href="${url}" class="text-indigo-600 underline" target="_blank">${url}</a>`
        inTextCitation = `(${firstAuthorLastName}, ${year})`
      } else if (style === 'MLA') {
        const sitePart = site ? `${site}, ` : ''
        bib = `${author}. "${title}." ${sitePart}${year}, ${url}. Accessed ${web.accessDate}.`
        html = `${author}. "${title}." <em>${sitePart}</em>${year}, ${url}. Accessed ${web.accessDate}.`
        inTextCitation = `("${title.slice(0, 20)}...")`
      } else if (style === 'Harvard') {
        bib = `${author}, ${year}. ${title}. [online] Available at: <${url}> [Accessed ${web.accessDate}].`
        html = `${author}, ${year}. <em>${title}</em>. [online] Available at: &lt;${url}&gt; [Accessed ${web.accessDate}].`
        inTextCitation = `(${firstAuthorLastName}, ${year})`
      } else {
        bib = `${author}. "${title}." ${site}. Last modified ${year}. ${url}.`
        html = `${author}. "${title}." ${site}. Last modified ${year}. ${url}.`
        inTextCitation = `(${firstAuthorLastName} ${year})`
      }
    }

    return { bibText: bib, bibHtml: html, inText: inTextCitation }
  }, [style, sourceType, book, journal, web])

  const handleLoadSample = () => {
    setSourceType('book')
    setBook({
      authors: 'Kahneman, Daniel',
      title: 'Thinking, Fast and Slow',
      publisher: 'Farrar, Straus and Giroux',
      year: '2011',
      edition: '1st'
    })
  }

  const handleReset = () => {
    if (sourceType === 'book') {
      setBook({ authors: '', title: '', publisher: '', year: '' })
    } else if (sourceType === 'journal') {
      setJournal({ authors: '', articleTitle: '', journalName: '', year: '', volume: '', issue: '', pages: '', doi: '' })
    } else {
      setWeb({ authorOrOrg: '', pageTitle: '', siteName: '', publishYear: '', url: '', accessDate: '' })
    }
  }

  const handleCopyBib = async () => {
    const ok = await copyToClipboard(bibText)
    if (ok) {
      setCopiedBib(true)
      setTimeout(() => setCopiedBib(false), 2000)
    }
  }

  const handleCopyInText = async () => {
    const ok = await copyToClipboard(inText)
    if (ok) {
      setCopiedInText(true)
      setTimeout(() => setCopiedInText(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <ToolHeader
        title={toolDef.name}
        description={toolDef.description}
        badge={toolDef.badge}
        categoryName="Writing & Citations"
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onCopyResult={handleCopyBib}
        isCopied={copiedBib}
        onBack={onBack}
      />

      {/* Style & Source Type Pickers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Style Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit">
          {(['APA', 'MLA', 'Harvard', 'Chicago'] as CitationStyle[]).map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                style === s
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Source Type Selector */}
        <div className="flex items-center gap-2">
          {(['book', 'journal', 'website'] as SourceType[]).map(st => (
            <button
              key={st}
              onClick={() => setSourceType(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer capitalize ${
                sourceType === st
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Inputs (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Source Details ({sourceType.toUpperCase()})
          </h3>

          {sourceType === 'book' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Author(s) <span className="text-slate-400">(Format: Last, First M.)</span>
                </label>
                <input
                  type="text"
                  value={book.authors}
                  onChange={e => setBook({ ...book, authors: e.target.value })}
                  placeholder="e.g. Kahneman, Daniel"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Book Title
                  </label>
                  <input
                    type="text"
                    value={book.title}
                    onChange={e => setBook({ ...book, title: e.target.value })}
                    placeholder="Thinking, Fast and Slow"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Year Published
                  </label>
                  <input
                    type="text"
                    value={book.year}
                    onChange={e => setBook({ ...book, year: e.target.value })}
                    placeholder="2011"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Publisher
                </label>
                <input
                  type="text"
                  value={book.publisher}
                  onChange={e => setBook({ ...book, publisher: e.target.value })}
                  placeholder="e.g. Farrar, Straus and Giroux"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {sourceType === 'journal' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Author(s)
                </label>
                <input
                  type="text"
                  value={journal.authors}
                  onChange={e => setJournal({ ...journal, authors: e.target.value })}
                  placeholder="Watson, J. D., & Crick, F. H."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  value={journal.articleTitle}
                  onChange={e => setJournal({ ...journal, articleTitle: e.target.value })}
                  placeholder="Molecular structure of nucleic acids"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Journal Name
                  </label>
                  <input
                    type="text"
                    value={journal.journalName}
                    onChange={e => setJournal({ ...journal, journalName: e.target.value })}
                    placeholder="Nature"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={journal.year}
                    onChange={e => setJournal({ ...journal, year: e.target.value })}
                    placeholder="1953"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Volume
                  </label>
                  <input
                    type="text"
                    value={journal.volume}
                    onChange={e => setJournal({ ...journal, volume: e.target.value })}
                    placeholder="171"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Issue
                  </label>
                  <input
                    type="text"
                    value={journal.issue}
                    onChange={e => setJournal({ ...journal, issue: e.target.value })}
                    placeholder="4356"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Pages
                  </label>
                  <input
                    type="text"
                    value={journal.pages}
                    onChange={e => setJournal({ ...journal, pages: e.target.value })}
                    placeholder="737-738"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  DOI or Direct URL
                </label>
                <input
                  type="text"
                  value={journal.doi}
                  onChange={e => setJournal({ ...journal, doi: e.target.value })}
                  placeholder="10.1038/171737a0"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {sourceType === 'website' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Author or Publishing Organization
                </label>
                <input
                  type="text"
                  value={web.authorOrOrg}
                  onChange={e => setWeb({ ...web, authorOrOrg: e.target.value })}
                  placeholder="NASA or Smith, Jane"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Page Title / Article Title
                </label>
                <input
                  type="text"
                  value={web.pageTitle}
                  onChange={e => setWeb({ ...web, pageTitle: e.target.value })}
                  placeholder="James Webb Space Telescope: Overview"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Website Name
                  </label>
                  <input
                    type="text"
                    value={web.siteName}
                    onChange={e => setWeb({ ...web, siteName: e.target.value })}
                    placeholder="NASA Science"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Year Published
                  </label>
                  <input
                    type="text"
                    value={web.publishYear}
                    onChange={e => setWeb({ ...web, publishYear: e.target.value })}
                    placeholder="2023"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={web.url}
                  onChange={e => setWeb({ ...web, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Formatted Output Preview (1 col) */}
        <div className="space-y-6">
          {/* Bibliography Entry */}
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-slate-900 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {style} Reference Entry
              </span>
              <button
                onClick={handleCopyBib}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                {copiedBib ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBib ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: bibHtml }}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/40 text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-serif"
            />
          </div>

          {/* In-Text Parenthetical */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                In-Text Parenthetical
              </span>
              <button
                onClick={handleCopyInText}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                {copiedInText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInText ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              {inText}
            </div>
          </div>
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
