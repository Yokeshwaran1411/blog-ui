import React from 'react'
import { Link } from 'react-router-dom'

function FooterSection() {
  return (
    <footer className='footer-panel glass-panel'>
      <div className='footer-content'>
        <div>
          <p className='text-xs uppercase tracking-[0.35em] text-slate-300'>OrbitLogs</p>
          <p className='mt-2 text-sm text-slate-200/80'>
            An archive of transmissions drifting through the cosmos.
          </p>
        </div>
        <div className='footer-links'>
          <Link className='footer-link' to='/'>Home</Link>
          <Link className='footer-link' to='/posts'>Articles</Link>
          <Link className='footer-link' to='/about'>About</Link>
          <Link className='footer-link' to='/contact'>Contact</Link>
        </div>
      </div>
      <div className='footer-bar'>
        <span>© 2026 OrbitLogs. All rights reserved.</span>
        <span className='footer-meta'>Crafted in low gravity.</span>
      </div>
    </footer>
  )
}

export default FooterSection
