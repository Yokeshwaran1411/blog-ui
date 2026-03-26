import React from 'react'

function AboutSection() {
  return (
    <section id='about' className='glass-panel about-panel scroll-target flex flex-col gap-10 p-8 md:flex-row md:items-center'>
      <div className='about-copy flex-1 space-y-4'>
        <p className='text-xs uppercase tracking-[0.4em] text-cyan-200/80'>
          About the Station
        </p>
        <h2 className='text-3xl font-semibold text-white'>
          A quiet archive for deep-space signals
        </h2>
        <p className='text-sm text-slate-200/90 md:text-base'>
          OrbitLogs is a roaming catalog of transmissions, field notes, and star-mapped essays. We
          collect small signals from distant crews and keep them orbiting in a calm, readable space.
        </p>
        <p className='text-sm text-slate-300/80'>
          Expect slow reading, luminous gradients, and a steady pulse of discoveries from the
          unknown.
        </p>
      </div>

      <div className='about-visual flex-1'>
        <div className='about-stack'>
          <div className='about-card'>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-300'>Log Type</p>
            <h3 className='mt-2 text-xl font-semibold text-white'>Archaeology Briefs</h3>
            <p className='mt-3 text-sm text-slate-200/80'>
              Curated fragments from research crews mapping the dark between constellations.
            </p>
          </div>
          <div className='about-card about-card-alt'>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-300'>Signal Status</p>
            <h3 className='mt-2 text-xl font-semibold text-white'>Active Relay</h3>
            <p className='mt-3 text-sm text-slate-200/80'>
              Pulsing beacons keep the archive alive, guiding readers deeper into each transmission.
            </p>
          </div>
        </div>
        <div className='about-orbit' />
        <div className='about-comet about-comet-a' />
        <div className='about-comet about-comet-b' />
        <div className='about-glow' />
      </div>
    </section>
  )
}

export default AboutSection
