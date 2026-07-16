import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, Clock3, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = { primaryTask: TaskKey; primaryRoute: string; posts: SitePost[]; timeSections: HomeTimeSection[] }
const wrap = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6'

function allPosts(posts: SitePost[], sections: HomeTimeSection[]) {
  return Array.from(new Map([...posts, ...sections.flatMap((s) => s.posts)].map((p) => [p.slug || p.id || p.title, p])).values())
}
function href(task: TaskKey, route: string, post: SitePost) { return postHref(task, post, route) }

function SectionTitle({ children }: { children: ReactNode }) {
  return <div className="mag-section-title"><h2>{children}</h2><span /></div>
}

function OverlayStory({ post, href: url, className = '' }: { post: SitePost; href: string; className?: string }) {
  return <Link href={url} className={`mag-overlay group ${className}`}>
    <img src={getEditablePostImage(post)} alt={post.title || 'Featured business'} />
    <div className="mag-shade" />
    <div className="mag-overlay-copy">
      <span className="mag-badge">{getEditableCategory(post)}</span>
      <p className="mag-date"><Clock3 /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently published'}</p>
      <h3>{post.title || 'Business listing'}</h3>
    </div>
  </Link>
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const items = allPosts(posts, timeSections)
  if (!items.length) return <section className={`${wrap} py-16 text-center`}><h1 className="text-4xl font-bold">Explore businesses on {SITE_CONFIG.name}</h1><p className="mt-3 text-[var(--slot4-muted-text)]">New business listings, products and services will appear here.</p></section>
  return <>
    <section className="mag-brand-hero">
      <div className={`${wrap} mag-brand-inner`}>
        <span className="mag-mark">B</span><div><h1>BARRIER<span>POSTS</span></h1><p>Businesses, products &amp; service discovery</p></div><i aria-hidden="true">&#9889;</i>
      </div>
    </section>
    <section className={`${wrap} pb-10`}>
      <SectionTitle>Featured businesses</SectionTitle>
      <div className="mag-feature-grid">
        <OverlayStory post={items[0]} href={href(primaryTask, primaryRoute, items[0])} className="mag-feature-lead" />
        {items.slice(1, 5).map((p) => <OverlayStory key={p.slug || p.id} post={p} href={href(primaryTask, primaryRoute, p)} />)}
      </div>
    </section>
  </>
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const items = allPosts(posts, timeSections).slice(0, 10)
  if (!items.length) return null
  return <section className={`${wrap} pb-10`}><div className="mag-panel"><SectionTitle>Latest listings</SectionTitle><div className="mag-auto-rail">
    <div className="mag-rail-track">{[...items, ...items].map((p, i) => <Link key={`${p.slug || p.id}-${i}`} href={href(primaryTask, primaryRoute, p)} className="mag-rail-card"><img src={getEditablePostImage(p)} alt="" /><div><span>{getEditableCategory(p)}</span><h3>{p.title || 'Business listing'}</h3></div></Link>)}</div>
  </div></div></section>
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const items = allPosts(posts, timeSections).slice(2, 10)
  if (!items.length) return null
  return <section className="mag-tint"><div className={`${wrap} mag-two-col`}><div className="mag-panel"><SectionTitle>New businesses</SectionTitle><div className="mag-update-grid">
    {items.slice(0, 4).map((p, i) => i < 2 ? <OverlayStory key={p.slug || p.id} post={p} href={href(primaryTask, primaryRoute, p)} /> : <Link key={p.slug || p.id} href={href(primaryTask, primaryRoute, p)} className="mag-horizontal"><img src={getEditablePostImage(p)} alt="" /><div><span>{getEditableCategory(p)}</span><h3>{p.title || 'Business listing'}</h3><p>{getEditableExcerpt(p, 90) || 'Explore this business, its products and available services.'}</p></div></Link>)}
  </div></div><aside className="mag-panel"><SectionTitle>Recent listings</SectionTitle><div className="mag-recent">{items.slice(0, 6).map((p) => <Link key={p.slug || p.id} href={href(primaryTask, primaryRoute, p)}><img src={getEditablePostImage(p)} alt="" /><div><h3>{p.title}</h3><small><Clock3 /> Recently listed</small></div></Link>)}</div></aside></div></section>
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const groups = timeSections.length ? timeSections : [{ key: 'popular', posts: posts.slice(0, 8), href: primaryRoute } as HomeTimeSection]
  return <>{groups.filter((g) => g.posts.length).slice(0, 3).map((g, gi) => <section key={g.key} className={gi % 2 ? 'mag-tint' : ''}><div className={`${wrap} py-10`}><SectionTitle>{gi === 0 ? 'Popular businesses' : gi === 1 ? 'Trending listings' : 'More businesses'}</SectionTitle><div className="mag-editorial-grid">
    {g.posts.slice(0, 7).map((p, i) => i === 0 ? <OverlayStory key={p.slug || p.id} post={p} href={href(primaryTask, primaryRoute, p)} className="mag-editorial-lead" /> : <Link key={p.slug || p.id} href={href(primaryTask, primaryRoute, p)} className="mag-image-card"><img src={getEditablePostImage(p)} alt="" /><span>{getEditableCategory(p)}</span><h3>{p.title || 'Business listing'}</h3></Link>)}
  </div></div></section>)}</>
}

export function EditableHomeCta() {
  return <section className="mag-subscribe"><div className={`${wrap} mag-subscribe-inner`}><div><span>Find the right business</span><h2>Standout businesses, products and services in one place.</h2><p>Search listings, compare available options, or promote your own business to interested customers.</p></div><form action="/search"><Search /><input name="q" placeholder="Search business listings" /><button>Search <ArrowRight /></button></form></div></section>
}
