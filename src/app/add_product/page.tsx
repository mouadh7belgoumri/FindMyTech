'use client'
import React from 'react'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

// Validation schema
const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  category: z.string().min(1, { message: 'Category is required' }),
  characteristics: z.string().min(5, { message: 'Characteristics must be at least 5 characters' }),
  price: z.number().min(1, { message: 'Price must be greater than 0' }),
  stock: z.number().min(0, { message: 'Stock cannot be negative' }),
  photo: z.string(),
})

type ProductFormData = z.infer<typeof productSchema>

const AddProductPage = () => {
    const A = 888;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name:  ``,
      description:  ``,
      category:  ``,
      characteristics:  ``,
      price: 0,
      stock: 0,
      photo:  ``,
    }
  })

  // Create product mutation
  const createProduct = useMutation({
    mutationFn: async (data: ProductFormData & { seller_id: number }) => {
      const response = await axios.post('http://localhost:8012/server/add_product.php', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Product added successfully!')
      reset() // Reset form on success
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to add product. Please try again.')
    }
  })

  const onSubmit = (data: ProductFormData) => {
    // Add the seller_id to the data
    const productData = {
      ...data,
      seller_id: 1 // Always 1 as requested
    }
    
    createProduct.mutate(productData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#212026] to-[#2d2d33] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#3b82f6] p-6 flex justify-between items-center">
          <Link href="/" className="text-white hover:text-gray-200 transition-colors">
            <IoArrowBackCircleOutline className="text-3xl" />
          </Link>
          <h1 className="text-2xl font-bold text-white text-center flex-grow">Add New Product</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Product Name</label>
            <input
              {...register('name')}
              id="name"
              type="text"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
              <input
                {...register('category')}
                id="category"
                type="text"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category"
              />
              {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="photo" className="text-sm font-medium text-gray-700">Photo URL</label>
              <input
                {...register('photo')}
                id="photo"
                type="text"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter photo URL"
                defaultValue="localhost:8000/admin/flower.png"
              />
              {errors.photo && <p className="text-red-600 text-sm">{errors.photo.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
            ></textarea>
            {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="characteristics" className="text-sm font-medium text-gray-700">Characteristics</label>
            <textarea
              {...register('characteristics')}
              id="characteristics"
              rows={2}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product characteristics (color, size, etc.)"
            ></textarea>
            {errors.characteristics && <p className="text-red-600 text-sm">{errors.characteristics.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label htmlFor="price" className="text-sm font-medium text-gray-700">Price</label>
              <input
                {...register('price', { valueAsNumber: true })}
                id="price"
                type="number"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
              />
              {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="stock" className="text-sm font-medium text-gray-700">Stock</label>
              <input
                {...register('stock', { valueAsNumber: true })}
                id="stock"
                type="number"
                min="0"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter available stock"
              />
              {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end pt-6">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 mr-4 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={createProduct.isPending}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {createProduct.isPending ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;