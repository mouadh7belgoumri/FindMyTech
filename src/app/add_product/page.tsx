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
            name: formData.get('product_name'),
            description: formData.get('product_description'),
            price: formData.get('product_price'),
            category: formData.get('category'),
            image: formData.get('product_image'),
            stock: formData.get('stock'),
            characteristics: formData.get('characteristics'),
            user_id: formData.get('user_id'), // Assuming user_id is passed as a hidden input
        };

        try {
            const response = await fetch('http://localhost:8012/server/add_product.php', {
                method: 'POST',
                body: JSON.stringify(productData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response);

            if (!response.ok) {
                console.log(response);
                throw new Error('Failed to add product');
            }

            alert('Product added successfully!');
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
                                <IoArrowBackCircleOutline className="hover:drop-shadow-[0_0_10px_white] hover:cursor-pointer" />
                            </button>
                        </div>
                        <form className="flex flex-col w-full h-full p-4" onSubmit={handleSubmit}>
                            <input type="text" name="product_name" placeholder="Product Name" required className="p-2 mb-4 border border-gray-300 rounded" />
                            <select name="category" id="category" className="p-2 mb-4 border border-gray-300 rounded">
                                <option value="PCs">PCs</option>
                                <option value="Desktop">Desktop</option>
                                <option value="accessoires">accessoires</option>
                            </select>
                            <input type="text" name="product_description" placeholder="Product Description" required className="p-2 mb-4 border border-gray-300 rounded" />
                            <input type="number" name="product_price" placeholder="Product Price" required className="p-2 mb-4 border border-gray-300 rounded" />
                            <input type="number" name="stock" placeholder="Stock" required className="p-2 mb-4 border border-gray-300 rounded" />
                            <textarea name="characteristics" placeholder="Characteristics (e.g., color, size)" required className="p-2 mb-4 border border-gray-300 rounded"></textarea>
                            <input type="file" name="product_image" accept="image/*" required className="p-2 mb-4 border border-gray-300 rounded hover:cursor-pointer" />
                            {/* Hidden input for user ID */}
                            <input type="hidden" name="user_id" value="123" /> {/* Replace "123" with the actual user ID */}
                            <button type="submit" className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''} hover:bg-blue-700 hover:cursor-pointer`} disabled={loading}>
                                {loading ? 'Loading...' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default page;
