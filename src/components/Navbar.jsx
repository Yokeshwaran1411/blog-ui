import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const socialIcons = {
    instagram: (
      <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        className='h-5 w-5'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.6'
      >
        <rect x='3' y='3' width='18' height='18' rx='5' />
        <circle cx='12' cy='12' r='4.2' />
        <circle cx='17' cy='7' r='1.2' fill='currentColor' stroke='none' />
      </svg>
    ),
    linkedin: (
      <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        className='h-5 w-5'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.6'
      >
        <rect x='3' y='3' width='18' height='18' rx='3' />
        <circle cx='8' cy='9' r='1.2' fill='currentColor' stroke='none' />
        <path d='M7 11v7' />
        <path d='M11 11v7' />
        <path d='M11 14c0-1.8 1.2-3 3-3 1.9 0 3 1.2 3 3v4' />
      </svg>
    )
  }


  const links = [
    { name: 'Home', to: '/', social: false },
    { name: 'Articles', to: '/posts', social: false },
    { name: 'About', to: '/about', social: false },
    { name: 'Contact', to: '/contact', social: false },
    { name: 'Insta', href: 'https://www.instagram.com/_easy_bugboy_?igsh=MWkxZGQ4ejFhY2Y5YQ==', social: true, icon: 'instagram' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/yokesh1406/', social: true, icon: 'linkedin' }
  ]

  const handleToggle = () => setMenuOpen(prev => !prev)
  const handleClose = () => setMenuOpen(false)

  return (
    <header className='mt-6 z-50 w-full px-4'>
      <nav className='glass-nav mx-auto flex w-full max-w-6xl items-center justify-between gap-6 relative'>
        <div className='flex items-center gap-3'>
          <div className='moon-icon' aria-hidden='true'>
            <span className='moon-spark' />
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              className='moon-icon-svg'
              fill='none'
            >
              <circle cx='12' cy='12' r='8.2' fill='rgba(226,232,240,0.9)' />
              <circle cx='9' cy='10' r='1.4' fill='rgba(148,163,184,0.65)' />
              <circle cx='14.5' cy='13.5' r='1.1' fill='rgba(148,163,184,0.55)' />
              <circle cx='12.5' cy='8.2' r='0.8' fill='rgba(148,163,184,0.5)' />
            </svg>
          </div>
          <div>
            <p className='flex items-center text-sm uppercase tracking-[0.3em] text-slate-300'>
              OrbitLogs
              <span className='ml-2 flex items-center gap-1 text-cyan-200/80'>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  className='h-3.5 w-3.5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.6'
                >
                  <path d='m12 4 2.6 5.2 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4.1 5.8-.8L12 4Z' />
                </svg>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  className='h-3.5 w-3.5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.6'
                >
                  <circle cx='12' cy='12' r='6.5' />
                  <circle cx='18.5' cy='6' r='1.4' fill='currentColor' stroke='none' />
                </svg>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  className='h-3.5 w-3.5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.6'
                >
                  <rect x='10' y='10' width='4' height='4' rx='0.8' />
                  <path d='M3.5 9.5 9 12l-5.5 2.5' />
                  <path d='M20.5 9.5 15 12l5.5 2.5' />
                </svg>
              </span>
            </p>
            <p className='text-xs text-slate-400'>Deep space blog</p>
          </div>
        </div>

        <button
          type='button'
          className='nav-toggle'
          aria-expanded={menuOpen}
          aria-label='Toggle navigation'
          onClick={handleToggle}
        >
          <span className={`nav-toggle-line ${menuOpen ? 'is-open' : ''}`} />
          <span className={`nav-toggle-line ${menuOpen ? 'is-open' : ''}`} />
          <span className={`nav-toggle-line ${menuOpen ? 'is-open' : ''}`} />
        </button>

        <ul className={`nav-links flex flex-wrap items-center justify-end gap-2 text-sm text-slate-200 ${menuOpen ? 'is-open' : ''}`}>
          {links.map(link => (
            <li key={link.name}>
              {link.href ? (
                <a
                  href={link.href}
                  target={link.social ? '_blank' : undefined}
                  rel={link.social ? 'noopener noreferrer' : undefined}
                  className={`nav-link ${link.social ? 'nav-link-social' : ''}`}
                  onClick={handleClose}
                  aria-label={link.social ? link.name : undefined}
                >
                  <span className='flex justify-center items-center gap-2 p-1'>
                    {link.icon ? socialIcons[link.icon] : null}
                    {link.social ? <span className='sr-only'>{link.name}</span> : link.name}
                  </span>
                </a>
              ) : (
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className='nav-link'
                  onClick={handleClose}
                >
                  {link.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
