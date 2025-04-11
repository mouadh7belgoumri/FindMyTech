// import Link from 'next/link'
// import React from 'react'
// import NavBar from './components/navBar'
// import Hero from './components/Hero'
import Card from './components/Card'

// import Footer from './components/Footer'
// import SignUp from './Sign up/page'
// import SignIn from './components/Sign in/page'
import Feature from './components/Feature'
// import Card from './components/Card'

const Home = () => {
  return (
    <div>
      {/* <NavBar /> */}
      {/* <Hero /> */}
      <Feature />
      <Card />
      

      {/* <Link href={'/Sign_up'}>Sign up</Link>
      <Link href={'/Sign_in'}>Sign in</Link> */}
    </div>
  )
}

export default Home
