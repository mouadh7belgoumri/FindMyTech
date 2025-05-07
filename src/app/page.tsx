import Link from 'next/link'



import Card from './components/Card'




import Feature from './components/Feature'


const Home = () => {
  return (
    <div className='flex flex-wrap justify-center'>
      
      
      

      <Link href={'/Sign_up'}>Sign up</Link>
      <Link href={'/Sign_in'}>Sign in </Link>
      <Link href={'/reset_password'}>reset password</Link>
    </div>
  )
}

export default Home
