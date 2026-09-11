import { useEffect,useState } from 'react';
import { Menu,X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Brand from './Brand';
import ContactAction from './ContactAction';
export const nav=[['Home','home'],['About','about'],['Products','products'],['Why Choose Us','why-us'],['Contact','contact']];
export default function Header(){const [open,setOpen]=useState(false);const [scrolled,setScrolled]=useState(false);useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>20);onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);useEffect(()=>{const escape=e=>{if(e.key==='Escape')setOpen(false)};document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape)},[]);return <header className={scrolled?'site-header scrolled':'site-header'}><div className="container nav-wrap"><Brand/><button className="menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav id="navigation" className={open?'nav open':'nav'} aria-label="Main navigation">{nav.map(([label,id])=><NavLink key={id} to={`/#${id}`} onClick={()=>setOpen(false)}>{label}</NavLink>)}<ContactAction className="button yellow small">Let's talk</ContactAction></nav></div></header>}
