import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter,useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Products from './sections/Products';
import WhyUs from './sections/WhyUs';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import './styles/main.css';
function App(){const location=useLocation();useEffect(()=>{if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView()},[location]);useEffect(()=>{if(!('IntersectionObserver' in window))return;const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}}),{threshold:.06});document.querySelectorAll('.section').forEach(el=>{el.classList.add('reveal');observer.observe(el)});return()=>observer.disconnect()},[]);return <><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main"><Hero/><About/><Products/><WhyUs/><Contact/></main><Footer/></>}
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
