'use client'
import React from 'react'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Link from 'next/link'
import { useState } from 'react'
const page = () => {
  const [loading, setLoading] = useState(false);
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const productData = {
            product_name: formData.get('product_name'),
            product_description: formData.get('product_description'),
            product_price: formData.get('product_price'),
            product_image: formData.get('product_image'),
        };

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                body: JSON.stringify(productData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            alert('Product added successfully!');
            event.currentTarget.reset();
        } catch (error) {
            console.error(error);
            alert('An error occurred while adding the product.');
        } finally {
            setLoading(false);
        }
    }
  return (
    <>
    <div className="flex flex-row justify-center bg-[#212026]">
        <div className="h-screen flex max-md:flex-col justify-center items-center content-center w-full">
            <div className="flex h-2/3 w-1/3 max-md:h-1/2 max-md:w-full flex-col content-center items-center justify-between bg-[#717171] shadow-[0_0_15px_black]">
            <div className="flex w-full justify-start ">
                <button className="text-white text-2xl p-4">
                <IoArrowBackCircleOutline className='hover:drop-shadow-[0_0_10px_white] hover:cursor-pointer '/>
                </button>
            </div>
            <form className="flex flex-col w-full h-full p-4" onSubmit={handleSubmit}>
                <input type="text" name="product_name" placeholder="Product Name" required className="p-2 mb-4 border border-gray-300 rounded" />
                <select name="category" id="category " className='p-2 mb-4 border border-gray-300 rounded"'>
                    <option value="PCs">PCs</option>
                    <option value="Desktop">Desktop</option>
                    <option value="accessoires">accessoires</option>
                </select>
                <input type="text" name="product_description" placeholder="Product Description" required className="p-2 mb-4 border border-gray-300 rounded" />
                <input type="number" name="product_price" placeholder="Product Price" required className="p-2 mb-4 border border-gray-300 rounded" />
                <input type="file" name="product_image" accept="image/*" required className="p-2 mb-4 border border-gray-300 rounded hover:cursor-pointer" />
                <button type="submit" className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''} hover:bg-blue-700 hover:cursor-pointer`} disabled={loading}>
                {loading ? 'Loading...' : 'Add Product'}
                </button>
            </form>
            </div>
        </div>
    </div>
    </>
  )
}

export default page
