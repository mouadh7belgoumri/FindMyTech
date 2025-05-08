export default function ProductFeatures() {
  return (
    <div className="col-span-2 mt-8 border-t border-gray-200 pt-8">
      <h3 className="text-2xl font-bold mb-4">Product Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">High Quality</h4>
          <p className="text-gray-600">
            Our products are made with premium materials and undergo rigorous quality testing.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Fast Shipping</h4>
          <p className="text-gray-600">
            We offer expedited shipping options to get your products to you as quickly as possible.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Warranty</h4>
          <p className="text-gray-600">All our products come with a standard warranty to ensure your satisfaction.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Customer Support</h4>
          <p className="text-gray-600">
            Our dedicated support team is available to assist you with any questions or concerns.
          </p>
        </div>
      </div>
    </div>
  )
}
