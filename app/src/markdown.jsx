import React from 'react'

// A small renderer for the subset of Markdown the rules files use: headings,
// tables, lists, blockquotes, and inline emphasis/code/links. Cross-file links
// (01_attributes_and_dice.md) become in-app routes.

function inline(text, key = 0) {
  const nodes = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) {
      nodes.push(<strong key={`${key}-${i++}`}>{tok.slice(2, -2)}</strong>)
    } else if (tok.startsWith('`')) {
      nodes.push(<code key={`${key}-${i++}`}>{tok.slice(1, -1)}</code>)
    } else if (tok.startsWith('[')) {
      const lm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)
      const href = lm[2]
      const local = /^([0-9]{2}_[a-z_]+)\.md(#.*)?$/.exec(href)
      nodes.push(
        local
          ? <a key={`${key}-${i++}`} href={`#/rules/${local[1]}`}>{lm[1]}</a>
          : <a key={`${key}-${i++}`} href={href} target="_blank" rel="noreferrer">{lm[1]}</a>
      )
    } else {
      nodes.push(<em key={`${key}-${i++}`}>{tok.slice(1, -1)}</em>)
    }
    last = m.index + tok.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

const splitRow = (line) =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())

export function Markdown({ source }) {
  const lines = source.split('\n')
  const out = []
  let i = 0
  let key = 0

  const flushList = (ordered, items) =>
    ordered
      ? <ol key={key++}>{items.map((t, n) => <li key={n}>{inline(t, n)}</li>)}</ol>
      : <ul key={key++}>{items.map((t, n) => <li key={n}>{inline(t, n)}</li>)}</ul>

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) { i++; continue }

    const h = /^(#{1,6})\s+(.*)$/.exec(line)
    if (h) {
      const Tag = `h${Math.min(6, h[1].length)}`
      out.push(<Tag key={key++}>{inline(h[2], key)}</Tag>)
      i++
      continue
    }

    // table: header row followed by a |---| separator
    if (line.trim().startsWith('|') && /^\s*\|[-\s|:]+\|\s*$/.test(lines[i + 1] || '')) {
      const head = splitRow(line)
      i += 2
      const body = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        body.push(splitRow(lines[i]))
        i++
      }
      out.push(
        <div className="table-wrap" key={key++}>
          <table>
            <thead><tr>{head.map((c, n) => <th key={n}>{inline(c, n)}</th>)}</tr></thead>
            <tbody>
              {body.map((row, rn) => (
                <tr key={rn}>{row.map((c, cn) => <td key={cn}>{inline(c, cn)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    if (line.trimStart().startsWith('>')) {
      const buf = []
      while (i < lines.length && lines[i].trimStart().startsWith('>')) {
        buf.push(lines[i].replace(/^\s*>\s?/, ''))
        i++
      }
      out.push(
        <blockquote key={key++}>
          {buf.filter((b) => b.trim()).map((b, n) => <p key={n}>{inline(b, n)}</p>)}
        </blockquote>
      )
      continue
    }

    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    const numbered = /^\s*\d+\.\s+(.*)$/.exec(line)
    if (bullet || numbered) {
      const ordered = Boolean(numbered)
      const items = []
      while (i < lines.length) {
        const b = /^\s*[-*]\s+(.*)$/.exec(lines[i])
        const n = /^\s*\d+\.\s+(.*)$/.exec(lines[i])
        if (ordered && n) items.push(n[1])
        else if (!ordered && b) items.push(b[1])
        else if (lines[i].startsWith('  ') && items.length) items[items.length - 1] += ' ' + lines[i].trim()
        else break
        i++
      }
      out.push(flushList(ordered, items))
      continue
    }

    const para = []
    while (i < lines.length && lines[i].trim() &&
           !/^(#{1,6})\s/.test(lines[i]) &&
           !lines[i].trimStart().startsWith('>') &&
           !lines[i].trim().startsWith('|') &&
           !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
      para.push(lines[i].trim())
      i++
    }
    if (para.length) out.push(<p key={key++}>{inline(para.join(' '), key)}</p>)
  }

  return <div className="prose">{out}</div>
}
