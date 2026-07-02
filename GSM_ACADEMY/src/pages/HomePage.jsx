import React from 'react'
import Hero from '../components/home/Hero'
import StatsBanner from '../components/home/StatsBanner'
import About from '../components/home/About'
import Courses from '../components/home/Courses'
import Events from '../components/home/Events'
import Teachers from '../components/home/Teachers'
import Gallery from '../components/home/Gallery'
import Testimonials from '../components/home/Testimonials'
import Footer from '../components/home/Footer'

const HomePage = () => {
  return (
    <main>
      <Hero />
      <StatsBanner />
      <About />
      <Courses />
      <Events />
      <Teachers />
      <Gallery />
      <Testimonials />
      <Footer />
    </main>
  )
}

export default HomePage
