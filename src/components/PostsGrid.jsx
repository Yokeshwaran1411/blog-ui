import React from 'react'

function PostsGrid({ posts, stripHtml, onOpenPost }) {
  return (
    <section id='posts' className='scroll-target grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {posts.map((post, index) => {
        const name = post.name
        const isPinned = post.pinned
        const createdAt = post.createdAt
        const content = post.content
        const image = post.image
        const imageUrl = post.imageUrl
        const plain = stripHtml(content)
        const isTruncated = plain.length > 250
        const preview = isTruncated ? plain.slice(0, 250) : plain
        const handleOpen = () => onOpenPost?.(post)

        return (
          <article
            key={post?.id ?? `${name}-${index}`}
            className='glass-card reveal flex h-full flex-col gap-4 overflow-hidden'
            style={{ animationDelay: `${index * 120}ms` }}
            onClick={handleOpen}
            role='button'
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleOpen()
              }
            }}
          >
            <div className='relative'>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={image?.alternativeText || name}
                  className='h-40 w-full object-cover'
                  loading='lazy'
                />
              ) : (
                <div className='flex h-40 items-center justify-center bg-slate-900/60 text-xs uppercase tracking-[0.3em] text-slate-400'>
                  No image
                </div>
              )}
              {isPinned && (
                <span className='glass-pill pinned-badge absolute left-4 top-4 flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.3em]'>
                  <svg
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    className='h-3 w-3'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.6'
                  >
                    <path d='M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z' />
                  </svg>
                  Pinned
                </span>
              )}
            </div>

            <div className='flex flex-1 flex-col gap-4 p-6'>
              <div className='flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-300'>
                <span>{isPinned ? 'Featured' : 'Journal'}</span>
                <span className='text-[10px] text-slate-400'>
                  {createdAt ? new Date(createdAt).toLocaleDateString() : 'New log'}
                </span>
              </div>
              <h2 className='text-xl font-semibold text-white'>{name}</h2>
              <p className='text-sm text-slate-200/90'>
                {preview}
                {isTruncated && (
                  <button
                    type='button'
                    className='ellipsis-dots'
                    onClick={(event) => {
                      event.stopPropagation()
                      handleOpen()
                    }}
                    aria-label={`Open full article for ${name}`}
                  >
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </button>
                )}
              </p>
              <button
                type='button'
                className='read-link mt-auto w-fit text-sm font-semibold text-cyan-200 hover:text-cyan-100'
                onClick={(event) => {
                  event.stopPropagation()
                  handleOpen()
                }}
              >
                Open article
              </button>
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default PostsGrid
