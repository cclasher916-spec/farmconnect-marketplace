import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, ShoppingCart, Store, Warehouse, Leaf } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">FarmConnect</h1>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Connect Directly with <span className="text-green-600">Farmers</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Fresh produce, fair prices, direct from farm to your table. 
            Eliminate the middleman and support local farmers.
          </p>
          <Link to="/register">
            <Button size="lg" className="px-8 py-4 text-lg">
              Start Shopping Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Role Selection */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Role</h3>
          <p className="text-gray-600">Join our marketplace as a farmer, customer, retailer, or storage provider</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover className="text-center p-8">
            <Tractor className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-3">Farmer</h4>
            <p className="text-gray-600 mb-6">Sell your produce directly to customers</p>
            <Link to="/register?role=farmer">
              <Button fullWidth>Join as Farmer</Button>
            </Link>
          </Card>

          <Card hover className="text-center p-8">
            <ShoppingCart className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-3">Customer</h4>
            <p className="text-gray-600 mb-6">Buy fresh produce directly from farmers</p>
            <Link to="/register?role=customer">
              <Button fullWidth>Shop Now</Button>
            </Link>
          </Card>

          <Card hover className="text-center p-8">
            <Store className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-3">Retailer</h4>
            <p className="text-gray-600 mb-6">Bulk orders for your business</p>
            <Link to="/register?role=retailer">
              <Button fullWidth>Join as Retailer</Button>
            </Link>
          </Card>

          <Card hover className="text-center p-8">
            <Warehouse className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-3">Storage Provider</h4>
            <p className="text-gray-600 mb-6">Offer storage solutions</p>
            <Link to="/register?role=storage_provider">
              <Button fullWidth>Provide Storage</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FarmConnect?</h3>
            <p className="text-gray-600">Direct connections, fair prices, and fresh produce</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Fresh & Organic</h4>
              <p className="text-gray-600">Direct from farm ensures maximum freshness and quality</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Fair Prices</h4>
              <p className="text-gray-600">No middlemen means better prices for both farmers and customers</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tractor className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Support Farmers</h4>
              <p className="text-gray-600">Help local farmers get fair compensation for their hard work</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-green-400" />
              <span className="text-xl font-bold">FarmConnect</span>
            </div>
            <p className="text-gray-400 mb-4">Connecting farms to tables, directly.</p>
            <p className="text-sm text-gray-500">
              © 2025 FarmConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;