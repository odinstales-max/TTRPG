import React, { useEffect, useState } from 'react'
import { ruleDocs, talents, traits, spells } from './data.js'
import Rules from './views/Rules.jsx'
import Talents from './views/Talents.jsx'
import Traits from './views/Traits.jsx'
import Spells from './views/Spells.jsx'
import Builder from './views/Builder.jsx'
import Admin from './views/Admin.jsx'
import { AccountBar } from './account.jsx'

const useHash = () => {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/builder')
  useEffect(() => {
    const on = () => setHash(window.location.hash.slice(1) || '/builder')
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

function NavLink({ to, children, sub }) {
  const hash = useHash()
  const on = hash === to || (to !== '/' && hash.startsWith(to + '/'))
  return (
    <a href={`#${to}`} className={`${on ? 'on' : ''} ${sub ? 'sub' : ''}`}>{children}</a>
  )
}

export default function App() {
  const hash = useHash()
  const [, section, param] = hash.split('/')

  let view
  if (section === 'rules') view = <Rules slug={param} />
  else if (section === 'talents') view = <Talents />
  else if (section === 'traits') view = <Traits />
  else if (section === 'spells') view = <Spells />
  else if (section === 'admin') view = <Admin />
  else view = <Builder />

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          [GAME NAME]
          <small>Core Rules v4 · compendium</small>
        </div>
        <nav className="nav">
          <NavLink to="/builder">Character Builder</NavLink>
          <div className="group">Compendium</div>
          <NavLink to="/talents">Talents <span className="count">{talents.length}</span></NavLink>
          <NavLink to="/traits">Traits <span className="count">{traits.length}</span></NavLink>
          <NavLink to="/spells">Spells <span className="count">{spells.length}</span></NavLink>
          <div className="group">Rules</div>
          {ruleDocs.filter((d) => d.slug !== '00_index').map((d) => (
            <NavLink key={d.slug} to={`/rules/${d.slug}`} sub>{d.title}</NavLink>
          ))}
          <div className="group">Tools</div>
          <NavLink to="/admin">Admin Editor</NavLink>
        </nav>
        <AccountBar />
      </aside>
      <main className="main">{view}</main>
    </div>
  )
}
