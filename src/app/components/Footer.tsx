import React from 'react'

const Footer = () => {
    return (
        <div>
            <footer className='relative b-black position-fixed bottom-0 w-full h-100'>
                <div className=' text-white flex justify-evenly items-center h-16 flex-row h-full'>
                    <div className='flex flex-col justify-evenly items-center h-full w-quarter'>
                        <h1 className='text-4xl font-serif'><span className="capitalize text-blue">find</span>My<span className='capitalize inline-block text-blue'>tech</span></h1>
                        <p className='text-center leading-8 m-5 font-serif '>Purchasing computer equipment
                            can be complex due to
                            the variety of products and
                            technical specifications.
                            FindMyTech aims
                            to simplify this process by
                            providing a powerful product
                            comparison tool with an
                            integrated store for direct
                            purchases</p>
                    </div>
                    <div className='flex flex-start'>
                        <div className='flex flex-col justify-evenly items-center h-full '>
                            <h1 className='text-4xl font-serif capitalize'>information</h1>
                        </div>
                    </div>
                    <div></div>
                    <div></div>
                </div>

            </footer>
        </div>
    )
}

export default Footer
