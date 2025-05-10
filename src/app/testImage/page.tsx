import React from 'react'
import Image from 'next/image'
import ImageLayout from './layout'

const Pic = () => {
    return (
        <ImageLayout >
            <div>
                <Image src='' alt='test' width={5} height={5} />
            </div>
        </ImageLayout>
    )
}

export default Pic
