import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Leaf } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Card from '@/components/common/Card';
import { RegisterFormData, UserRole } from '@/types';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') as UserRole || 'customer';
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    defaultValues: {
      role: defaultRole,
    },
  });

  const password = watch('password');

  const roleOptions = [
    { value: 'customer', label: 'Customer' },
    { value: 'farmer', label: 'Farmer' },
    { value: 'retailer', label: 'Retailer' },
    { value: 'storage_provider', label: 'Storage Provider' },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await registerUser(data.email, data.password, {
        name: data.name,
        role: data.role,
        phone: data.phone,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">FarmConnect</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Create your account</h2>
          <p className="text-gray-500 mt-2">Join our marketplace today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
            error={errors.name?.message}
          />

          <Input
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Phone (Optional)"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <Select
            label="Role"
            options={roleOptions}
            {...register('role', {
              required: 'Please select a role',
            })}
            error={errors.role?.message}
          />

          <Input
            label="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => 
                value === password || 'Passwords do not match',
            })}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;