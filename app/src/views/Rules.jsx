import React from 'react'
import { ruleDocs } from '../data.js'
import { Markdown } from '../markdown.jsx'

export default function Rules({ slug }) {
  const doc = ruleDocs.find((d) => d.slug === slug) ||
              ruleDocs.find((d) => d.slug === '00_index') ||
              ruleDocs[0]
  if (!doc) return <p className="empty">No rules files found in data/rules/.</p>

  const idx = ruleDocs.findIndex((d) => d.slug === doc.slug)
  const prev = ruleDocs[idx - 1]
  const next = ruleDocs[idx + 1]

  return (
    <>
      <Markdown source={doc.body} />
      <div className="controls" style={{ marginTop: 24 }}>
        {prev ? <a className="chip" href={`#/rules/${prev.slug}`}>← {prev.title}</a> : <span />}
        {next ? <a className="chip" href={`#/rules/${next.slug}`}>{next.title} →</a> : <span />}
        <span className="count">data/rules/{doc.file}</span>
      </div>
    </>
  )
}
