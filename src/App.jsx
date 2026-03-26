import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
  readProgress,
  readingRef,
  onReadingScroll,
  posts,
  onOpenPost
}) {
  return (
    <>
      <HighlightSection
        featuredPost={featuredPost}
        loading={loading}
        stripHtml={stripHtml}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        readProgress={readProgress}
        readingRef={readingRef}
        onReadingScroll={onReadingScroll}
      />
      <PostsGrid posts={posts} stripHtml={stripHtml} onOpenPost={onOpenPost} />
      <AboutSection />
      <ContactSection />
    </>
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
  const [activePost, setActivePost] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const [overlayProgress, setOverlayProgress] = useState(0)
  const readingRef = useRef(null)
  const overlayRef = useRef(null)
  const location = useLocation()

  const openPost = useCallback((post) => {
    setActivePost(post)
    setIsClosing(false)
    setOverlayProgress(0)
  }, [])

  const closePost = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)
    window.setTimeout(() => {
      setActivePost(null)
      setIsClosing(false)
      setOverlayProgress(0)
    }, 260)
  }, [isClosing])

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

  const handleOverlayScroll = useCallback(() => {
    const panel = overlayRef.current
    if (!panel) return
    const maxScroll = panel.scrollHeight - panel.clientHeight
    const progress = maxScroll > 0 ? (panel.scrollTop / maxScroll) * 100 : 100
    setOverlayProgress(progress)
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
    if (!activePost) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closePost()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePost, closePost])

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
    if (!activePost) {
      setOverlayProgress(0)
      return
    }

    const panel = overlayRef.current
    if (panel) {
      panel.scrollTop = 0
    }

    handleOverlayScroll()
  }, [activePost, handleOverlayScroll])

  useEffect(() => {
    const sectionMap = {
      '/posts': 'posts',
      '/about': 'about',
      '/contact': 'contact'
    }
    const sectionId = sectionMap[location.pathname]

    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const target = document.getElementById(sectionId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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

  const overlayContent = activePost?.content || '<p>No transmission data available.</p>'
  const homeElement = showLoading ? (
    <SpaceLoader />
  ) : (
    <HomePage
      featuredPost={featuredPost}
      loading={loading}
      expanded={isExpanded}
      onToggleExpand={toggleExpanded}
      readProgress={readProgress}
      readingRef={readingRef}
      onReadingScroll={handleReadingScroll}
      posts={orderedPosts}
      onOpenPost={openPost}
    />
  )

  return (
    <div className={`space-scene min-h-screen w-full text-slate-100 ${activePost ? 'overlay-open' : ''}`}>
      <div className='scene-content'>
        <Navbar />
        <main className='mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10'>
          <Routes>
            <Route path='/' element={homeElement} />
            <Route path='/posts' element={homeElement} />
            <Route path='/about' element={homeElement} />
            <Route path='/contact' element={homeElement} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
          <FooterSection />
        </main>
      </div>

      {activePost && (
        <div
          className={`post-overlay ${isClosing ? 'is-closing' : ''}`}
          role='dialog'
          aria-modal='true'
          aria-label={activePost?.name || 'Transmission'}
          onClick={closePost}
        >
          <div className='post-overlay-panel glass-panel' onClick={(event) => event.stopPropagation()}>
            <div className='post-overlay-header'>
              <div>
                <p className='post-overlay-meta'>
                  <span>{activePost?.pinned ? 'Pinned Transmission' : 'Transmission'}</span>
                  <span>
                    {activePost?.createdAt
                      ? new Date(activePost.createdAt).toLocaleDateString()
                      : 'New log'}
                  </span>
                </p>
                <h2 className='text-2xl font-semibold text-white'>{activePost?.name}</h2>
              </div>
              <button
                type='button'
                className='glass-pill glass-pill-ghost post-overlay-close'
                onClick={closePost}
              >
                Close
              </button>
            </div>

            {activePost?.imageUrl && (
              <img
                src={activePost.imageUrl}
                alt={activePost?.image?.alternativeText || activePost?.name}
                className='post-overlay-image'
              />
            )}

            <div className='post-overlay-reading'>
              <div
                ref={overlayRef}
                onScroll={handleOverlayScroll}
                className='space-content post-overlay-body text-sm text-slate-200/90 md:text-base'
                dangerouslySetInnerHTML={{ __html: overlayContent }}
              />
              <div className='overlay-progress'>
                <div className='overlay-progress-track'>
                  <div className='overlay-progress-bar' style={{ height: `${overlayProgress}%` }} />
                </div>
                <span className='overlay-progress-label'>{Math.round(overlayProgress)}% read</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
