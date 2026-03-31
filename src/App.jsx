import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from './components/Navbar'
import HighlightSection from './components/HighlightSection'
import PostsGrid from './components/PostsGrid'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import FooterSection from './components/FooterSection'
import { fetchPosts } from './api/api.js'
import demoPosts from './constants/demoData.json'
import { normalizePost, stripHtml } from './utils/posts.js'

function HomePage({
  featuredPost,
  loading,
  expanded,
  onToggleExpand,
  onOpenFeatured,
  readProgress,
  readingRef,
  onReadingScroll,
  posts
}) {
  const showPostsLoader = loading && posts.length === 0

  return (
    <>
      <HighlightSection
        featuredPost={featuredPost}
        loading={loading}
        stripHtml={stripHtml}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        onOpenFeatured={onOpenFeatured}
        readProgress={readProgress}
        readingRef={readingRef}
        onReadingScroll={onReadingScroll}
      />
      {showPostsLoader ? <SpaceLoader /> : <PostsGrid posts={posts} stripHtml={stripHtml} />}
      <AboutSection />
      <ContactSection />
    </>
  )
}

function PostsPage({ posts, loading }) {
  const showPostsLoader = loading && posts.length === 0
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement
      const maxScroll = doc.scrollHeight - doc.clientHeight
      const progress = maxScroll > 0 ? (doc.scrollTop / maxScroll) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className='articles-layout'>
      <div className='articles-stack'>
        <section className='glass-panel articles-hero flex flex-col gap-3 p-8'>
          <p className='text-xs uppercase tracking-[0.35em] text-cyan-200/80'>Articles</p>
          <h1 className='text-3xl font-semibold text-white'>All transmissions</h1>
          <p className='text-sm text-slate-200/80 md:text-base'>
            Browse the latest mission logs, story drafts, and orbital dispatches.
          </p>
        </section>
        {showPostsLoader ? <SpaceLoader /> : <PostsGrid posts={posts} stripHtml={stripHtml} />}
      </div>
      <div className='articles-progress' aria-hidden='true'>
        <div className='articles-progress-track' style={{ '--progress': `${scrollProgress}%` }}>
          <span className='articles-progress-glow' />
        </div>
        <span className='articles-progress-label'>{Math.round(scrollProgress)}%</span>
      </div>
    </section>
  )
}

function PostDetailPage({ posts, loading }) {
  const { slug } = useParams()
  const decodedSlug = decodeURIComponent(slug || '')
  const post = posts.find(item => String(item.slug) === decodedSlug)

  if (loading && !post) {
    return <SpaceLoader />
  }

  if (!post) {
    return (
      <section className='glass-panel flex flex-col gap-4 p-8 text-center'>
        <p className='text-xs uppercase tracking-[0.35em] text-cyan-200/80'>Signal Missing</p>
        <h1 className='text-3xl font-semibold text-white'>Transmission not found</h1>
        <p className='text-sm text-slate-200/80'>
          The coordinates you requested are empty. Try another article.
        </p>
        <Link
          className='glass-pill mx-auto px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]'
          to='/'
          aria-label='Back to Home'
          title='Back to Home'
        >
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            className='h-4 w-4'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.6'
          >
            <path d='M3 11.5 12 4l9 7.5' />
            <path d='M6 10.5V20h12v-9.5' />
          </svg>
        </Link>
      </section>
    )
  }

  const content = post.content || '<p>No transmission data available.</p>'
  const currentIndex = posts.findIndex(item => String(item.slug) === decodedSlug)
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null
  const nextPost = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

  return (
    <article className='glass-panel post-detail-panel flex flex-col gap-6 p-8'>
      <div className='post-detail-ambient' aria-hidden='true'>
        <span className='post-ambient-orb orb-one' />
        <span className='post-ambient-orb orb-two' />
        <span className='post-ambient-orb orb-three' />
        <span className='post-ambient-star star-one' />
        <span className='post-ambient-star star-two' />
        <span className='post-ambient-star star-three' />
        <span className='post-ambient-star star-four' />
        <span className='post-ambient-comet' />
      </div>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-slate-300'>
            <span>{post.pinned ? 'Pinned Transmission' : 'Transmission'}</span>
            <span className='text-[10px] text-slate-400'>
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'New log'}
            </span>
          </p>
          <h1 className='mt-3 text-2xl font-semibold leading-snug text-white sm:text-3xl md:text-4xl'>
            {post.name}
          </h1>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Link
            className='glass-pill px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]'
            to='/'
            aria-label='Back to Home'
            title='Back to Home'
          >
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.6'
            >
              <path d='M3 11.5 12 4l9 7.5' />
              <path d='M6 10.5V20h12v-9.5' />
            </svg>
          </Link>
        </div>
      </div>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.image?.alternativeText || post.name}
          className='w-full rounded-3xl object-contain'
          style={{ maxHeight: '70vh' }}
        />
      )}

      <div
        className='space-content text-sm text-slate-200/90 md:text-base'
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {(prevPost || nextPost) && (
        <nav className='flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-6'>
          {prevPost && (
            <Link
              className='glass-pill w-fit px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]'
              to={`/posts/${encodeURIComponent(String(prevPost.slug))}`}
              aria-label='Previous article'
              title='Previous'
            >
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.6'
              >
                <path d='M15 6l-6 6 6 6' />
              </svg>
            </Link>
          )}
          {nextPost && (
            <Link
              className='glass-pill w-fit px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]'
              to={`/posts/${encodeURIComponent(String(nextPost.slug))}`}
              aria-label='Next article'
              title='Next'
            >
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.6'
              >
                <path d='M9 6l6 6-6 6' />
              </svg>
            </Link>
          )}
        </nav>
      )}
    </article>
  )
}

function SpaceLoader() {
  return (
    <section className='glass-panel space-loader' role='status' aria-live='polite'>
      <div className='space-loader-core' aria-hidden='true'>
        <span className='space-loader-planet' />
        <span className='space-loader-orbit orbit-one' />
        <span className='space-loader-orbit orbit-two' />
        <span className='space-loader-orbit orbit-three' />
        <span className='space-loader-star star-one' />
        <span className='space-loader-star star-two' />
        <span className='space-loader-star star-three' />
      </div>
      <div>
        <p className='space-loader-title'>Aligning the star charts...</p>
        <p className='space-loader-sub'>Warming up the comms relay</p>
      </div>
    </section>
  )
}

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const readingRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  const handleReadingScroll = useCallback(() => {
    const panel = readingRef.current
    if (!panel) return
    const maxScroll = panel.scrollHeight - panel.clientHeight
    const progress = maxScroll > 0 ? (panel.scrollTop / maxScroll) * 100 : 100
    setReadProgress(progress)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchPosts()
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching posts:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!isExpanded) {
      setReadProgress(0)
      return
    }

    const panel = readingRef.current
    if (panel) {
      panel.scrollTop = 0
    }

    handleReadingScroll()
  }, [isExpanded, handleReadingScroll])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const hasPosts = posts.length > 0
  const showLoading = loading && !hasPosts
  const showDemoPosts = !loading && !hasPosts
  const rawPosts = hasPosts ? posts : showDemoPosts ? demoPosts : []
  const normalizedPosts = rawPosts.map(normalizePost)
  const orderedPosts = [...normalizedPosts].sort((a, b) => {
    const pinScore = Number(b.pinned) - Number(a.pinned)
    if (pinScore) return pinScore
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return bDate - aDate
  })
  const pinnedPosts = normalizedPosts.filter(post => post.pinned)
  const pinnedLatest = [...pinnedPosts].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return bDate - aDate
  })[0]
  const latestPost = [...normalizedPosts].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return bDate - aDate
  })[0]
  const featuredPost = pinnedLatest || latestPost
  const openFeaturedPost = useCallback(() => {
    if (!featuredPost) {
      toggleExpanded()
      return
    }
    const postSlug = featuredPost.slug || featuredPost.name
    if (!postSlug) {
      return
    }
    navigate(`/posts/${encodeURIComponent(String(postSlug))}`)
  }, [featuredPost, navigate, toggleExpanded])

  const homeElement = (
    <HomePage
      featuredPost={featuredPost}
      loading={loading}
      expanded={isExpanded}
      onToggleExpand={toggleExpanded}
      onOpenFeatured={openFeaturedPost}
      readProgress={readProgress}
      readingRef={readingRef}
      onReadingScroll={handleReadingScroll}
      posts={orderedPosts}
    />
  )

  return (
    <div className='space-scene min-h-screen w-full text-slate-100'>
      <div className='scene-content'>
        <Navbar />
        <main className='mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10'>
          <Routes>
            <Route path='/' element={homeElement} />
            <Route path='/posts' element={<PostsPage posts={orderedPosts} loading={showLoading} />} />
            <Route path='/posts/:slug' element={<PostDetailPage posts={orderedPosts} loading={showLoading} />} />
            <Route path='/about' element={<AboutSection />} />
            <Route path='/contact' element={<ContactSection />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
          <FooterSection />
        </main>
      </div>
    </div>
  )
}

export default App
