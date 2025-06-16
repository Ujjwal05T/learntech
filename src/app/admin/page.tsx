"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToken } from '@/hooks/useToken';
import { useUserStore } from '../../../stores/user-store';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { 
  Users, 
  Search, 
  Mail, 
  Shield,
  Eye,
  Trash2,
  RefreshCw,
  AlertTriangle,
  User as UserIcon
} from 'lucide-react';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface UserStats {
  totalUsers: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [mounted, setMounted] = useState(false);

  const {  getToken } = useToken();
  const { user } = useUserStore();
  const router = useRouter();

  // Ensure component is mounted before checking authentication
  useEffect(() => {
    setMounted(true);
  }, []);
  // Check if user is admin
  useEffect(() => {
    if (!mounted) return;

    if (!user) {
      router.push('/login');
      return;
    }
    

    if (user?.role !== 'admin') {
      router.push('/home');
      return;
    }

    fetchUsers();
  }, [mounted, user, router]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('Fetching users with token:', token);
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // console.log(response.data);
      
      if (response.data.success) {
        const userData = response.data.data;
        setUsers(userData);
        
        // Calculate stats
        const totalUsers = userData.length;

        setStats({
          totalUsers
        });
      }
    } catch (err:unknown) {
      const error = err as AxiosError;
      console.error('Error fetching users:', err);
      if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      //   router.push('/login');
      } else {
        setError(error.message || 'Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = getToken();
      const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
        // Update stats
        setStats(prev => ({
          totalUsers: prev.totalUsers - 1
        }));
      }
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error('Error deleting user:', err);
      setError(error.message || 'Failed to delete user');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Show loading during mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#060317] to-[#0c0825] flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#060317] to-[#0c0825] flex items-center justify-center">
        <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30 p-8">
          <div className="text-center">
            <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">You need admin privileges to access this page.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060317] to-[#0c0825] text-white pt-20 pb-12">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-12 w-12 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400">Manage users and view system statistics</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-600/10 border-red-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-300">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-8 max-w-md">
          <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white w-64"
                  />
                </div>
                <Button
                  onClick={fetchUsers}
                  variant="outline"
                  size="sm"
                  className="bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
                <span className="ml-3 text-gray-400">Loading users...</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.username[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium text-lg">{user.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">{user.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-600/10 text-red-400 border border-red-500/30 hover:bg-red-600/20"
                                onClick={() => deleteUser(user._id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {currentUsers.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">
                      {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-gray-400 text-sm">
                      Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="bg-gray-800/30 text-gray-300 border border-gray-600/30"
                      >
                        Previous
                      </Button>
                      <span className="text-gray-400 text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="bg-gray-800/30 text-gray-300 border border-gray-600/30"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}