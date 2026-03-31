const STRAPI_BASE = String(import.meta.env.VITE_API_URL || '')
  .trim()
  .replace(/^['"]|['"]$/g, '')
  .replace(/\/$/, '')

const toAbsoluteUrl = (url) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return STRAPI_BASE ? `${STRAPI_BASE}${url}` : url
}

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

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
  const slug = post?.slug || attributes?.slug || post?.Slug || attributes?.Slug || slugify(name)
  const image = post?.Image?.[0] || post?.image || attributes?.Image?.[0]
  const imageUrl = image?.url ? toAbsoluteUrl(image.url) : post?.imageUrl

  return {
    id: post?.id ?? name,
    name,
    pinned,
    createdAt,
    content,
    slug,
    image,
    imageUrl
  }
}
