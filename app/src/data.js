// The app renders data/ and nothing else. Content changes never require code changes.

const jsonModules = import.meta.glob('../../data/*.json', { eager: true })
const ruleModules = import.meta.glob('../../data/rules/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function pick(name) {
  const key = Object.keys(jsonModules).find((k) => k.endsWith(`/${name}.json`))
  return key ? jsonModules[key].default ?? jsonModules[key] : []
}

export const talents = pick('talents')
export const traits = pick('traits')
export const spells = pick('spells')

export const ruleDocs = Object.entries(ruleModules)
  .map(([path, body]) => {
    const file = path.split('/').pop()
    const heading = /^#\s+(.+)$/m.exec(body)
    return {
      file,
      slug: file.replace(/\.md$/, ''),
      title: heading ? heading[1].trim() : file,
      body,
    }
  })
  .sort((a, b) => a.file.localeCompare(b.file))

export const byId = (rows) => Object.fromEntries(rows.map((r) => [r.id, r]))
export const talentsById = byId(talents)
export const traitsById = byId(traits)

export const SCHOOLS = [...new Set(spells.map((s) => s.school))].sort()
export const TALENT_TAGS = [...new Set(talents.flatMap((t) => t.tags || []))]
  .filter((t) => !t.startsWith('chain:'))
  .sort()
export const SOURCES = [...new Set(talents.map((t) => t.source_class))].sort()
export const CHAINS = [...new Set(
  talents.flatMap((t) => (t.tags || []).filter((x) => x.startsWith('chain:')))
)].sort()
