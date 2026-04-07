import React from 'react'

function HighlightSection({
  featuredPost,
  loading,
  stripHtml,
  expanded,
  onToggleExpand,
  onOpenFeatured,
  readProgress,
  readingRef,
  onReadingScroll
}) {
  const fullContent = featuredPost?.content || '<p>No transmission data available.</p>'
  const hasFeatured = Boolean(featuredPost)

  return (
    <section id='home' className='glass-panel hero-panel highlight-panel scroll-target relative overflow-hidden p-8 md:p-10'>
      <div className='space-orb highlight-orb' />
      <p className='highlight-kicker highlight-reveal text-sm uppercase tracking-[0.35em] text-slate-300'>
        {featuredPost?.pinned ? (
          <span className='inline-flex items-center gap-2'>
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              className='h-3.5 w-3.5'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.6'
            >
              <path d='M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z' />
            </svg>
            Pinned Transmission
          </span>
        ) : (
          'Latest Transmission'
        )}
      </p>
      <h1 className='highlight-title highlight-reveal mt-4 text-4xl font-semibold leading-tight md:text-5xl'>
        {featuredPost?.name || 'A glassy journal for stories drifting through the cosmos.'}
      </h1>
      <p className='highlight-body highlight-reveal mt-4 max-w-2xl text-base text-slate-200/90 md:text-lg'>
        {featuredPost
          ? (() => {
              const plain = stripHtml(featuredPost.content)
              return plain.length > 250 ? `${plain.slice(0, 250)}...` : plain
            })()
          : 'Explore interstellar essays, mission diaries, and creative dispatches from a far-away blog station.'}
      </p>
      {loading && (
        <p className='highlight-status highlight-reveal mt-4 text-xs uppercase tracking-[0.35em] text-cyan-200'>
          <span className='typing-line'>Receiving transmissions...</span>
        </p>
      )}
      {!loading && (
        <div className='highlight-actions highlight-reveal mt-6 flex flex-wrap gap-3'>
          <button
            type='button'
            className='glass-pill px-5 py-2 text-sm font-medium btn-grad'
            onClick={hasFeatured ? onOpenFeatured : onToggleExpand}
            aria-expanded={hasFeatured ? undefined : expanded}
          >
            {hasFeatured ? 'Start Reading' : expanded ? 'Hide Article' : 'Start Reading'}
          </button>
        </div>
      )}

      <div className={`reading-panel ${expanded ? 'is-open' : ''}`}>
        <div className='reading-progress'>
          <div className='reading-progress-track'>
            <div className='reading-progress-bar' style={{ height: `${readProgress}%` }} />
          </div>
          <span className='reading-progress-label'>{Math.round(readProgress)}% read</span>
        </div>
        <div
          ref={readingRef}
          onScroll={onReadingScroll}
          className='space-content reading-body text-sm text-slate-200/90 md:text-base'
          dangerouslySetInnerHTML={{ __html: fullContent }}
        />
      </div>
    </section>
  )
}

export default HighlightSection
