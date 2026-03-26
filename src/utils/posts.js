const STRAPI_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const stripHtml = (value) =>
  String(value || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const normalizePost = (post) => {
  const attributes = post?.attributes || {}
  const name = post?.Name || post?.name || attributes?.Name || attributes?.name || 'Untitled Log'
  const pinned = Boolean(post?.Pinned ?? post?.pinned ?? attributes?.Pinned ?? attributes?.pinned)
  const createdAt = post?.createdAt || attributes?.createdAt
  const content = post?.content || attributes?.content || ''
  const image = post?.Image?.[0] || post?.image || attributes?.Image?.[0]
  const imageUrl = image?.url
    ? `${STRAPI_BASE}${image.url}`
    : post?.imageUrl

  return {
    id: post?.id ?? name,
    name,
    pinned,
    createdAt,
    content,
    image,
    imageUrl
  }
}
