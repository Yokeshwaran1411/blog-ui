import emailjs from '@emailjs/browser'

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const authHeaders = () => ({
  Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`
})

export const fetchPosts = () =>
  fetch(`${API_BASE}/api/posts?populate=*`, {
    headers: authHeaders()
  })
    .then(response => response.json())
    .then(data => (Array.isArray(data?.data) ? data.data : []))
    .catch(error => {
      console.error('Error fetching posts:', error)
      throw error
    })

export const fetchPost = (slug) => {
  const url = `${API_BASE}/api/posts?filters[slug][$eq]=${slug}&populate=*`
  return fetch(url, {
    headers: authHeaders()
  })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data?.data) && data.data.length > 0) {
        return data.data[0]
      }
      throw new Error('Post not found')
    })
    .catch(error => {
      console.error('Error fetching post:', error)
      throw error
    })
}

export const sendContact = ({ name, email, subject, message }) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('Email service is not configured.')
  }

  return emailjs.send(
    serviceId,
    templateId,
    {
      name,
      email,
      subject,
      message
    },
    { publicKey }
  )
}

export default fetchPost
