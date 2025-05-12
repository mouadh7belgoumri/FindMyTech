export const metadata = {
    title: "Add Product",
    description: "Add Product",
}
import React from 'react'

const AddProductLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default AddProductLayout
