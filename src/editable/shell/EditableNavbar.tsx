'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, LogOut, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open,setOpen]=useState(false); const pathname=usePathname(); const {session,logout}=useEditableLocalAuthSession()
  const tasks=useMemo(()=>SITE_CONFIG.tasks.filter(t=>t.enabled&&t.key==='listing').map(t=>({label:t.label,href:t.route})),[])
  const links=[{label:'Home',href:'/'},...tasks,{label:'About Us',href:'/about'},{label:'Contact',href:'/contact'}]
  return <header className="mag-header">
    <div className="mag-mainnav"><Link href="/" className="mag-logo"><strong><img src="/favicon.png" alt="BarrierPosts logo" /></strong><span>BARRIER<em>POSTS</em></span></Link>
      <nav className="mag-desktop-nav">{links.slice(0,7).map(l=><Link key={l.href} href={l.href} className={pathname===l.href?'active':''}>{l.label}{l.href!=='/'&&<ChevronDown />}</Link>)}</nav>
      <form action="/search" className="mag-nav-search"><input name="q" type="search" placeholder="Search businesses, products or services" aria-label="Search business listings"/><button aria-label="Search"><Search /></button></form>
      <div className="mag-account">{session?<><span className="mag-user">{session.name}</span><Link href="/create">Create</Link><button onClick={logout}><LogOut/> Logout</button></>:<><Link href="/login">Login</Link><Link href="/signup" className="signup">Sign up</Link></>}</div>
      <button className="mag-menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
    </div>
    {open&&<div className="mag-mobile-nav"><form action="/search" className="mag-mobile-search"><input name="q" type="search" placeholder="Search business listings" aria-label="Search business listings"/><button aria-label="Search"><Search /></button></form>{links.map(l=><Link key={l.href} href={l.href} onClick={()=>setOpen(false)}>{l.label}</Link>)}{session?<><b>{session.name}</b><Link href="/create">Create Listing</Link><button onClick={logout}>Logout</button></>:<><Link href="/login">Login</Link><Link href="/signup">Sign up</Link></>}</div>}
  </header>
}
