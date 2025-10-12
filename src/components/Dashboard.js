import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import axios from 'axios';
import NavBar from "@/components/NavBar";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ onLogout }) => {
  const [revenueData, setRevenueData] = useState(null);
  const [rentStatus, setRentStatus] = useState({ paid: [], overdue: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getAuthHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    }
  });

    const fetchDashboardData = async () => {
        try {
            const [revenueResponse, statusResponse] = await Promise.all([
                axios.get(`${API}/dashboard/revenue`, getAuthHeaders()),
                axios.get(`${API}/dashboard/rent-status`, getAuthHeaders())
            ]);

            setRevenueData(revenueResponse.data);
            setRentStatus(statusResponse.data);
        } catch (error) {
            console.error('Dashboard API failed, loading sample data.', error);
            toast.error('Failed to load dashboard data. Showing sample data.');

            setRevenueData({
                total_annual: 1200000,
                average_monthly: 100000,
                revenue: [95000, 102000, 98000, 110000, 107000, 98000, 120000, 100000, 95000, 97000, 103000, 99000],
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            });

            setRentStatus({
                paid: [
                    { name: 'John Doe', rent: 25000 },
                    { name: 'Jane Smith', rent: 30000 },
                    { name: 'David Johnson', rent: 18000 },
                ],
                overdue: [
                    { name: 'Emily Brown', rent: 22000 },
                    { name: 'Chris Lee', rent: 19500 },
                ],
                upcoming: [
                    { name: 'Michael Scott', rent: 27000, due_date: 15 },
                    { name: 'Pam Beesly', rent: 26000, due_date: 20 },
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
    onLogout();
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <NavBar></NavBar>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your rental properties and track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ₹{revenueData ? (revenueData.average_monthly || 0).toLocaleString() : '0'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {rentStatus.paid.length + rentStatus.overdue.length + rentStatus.upcoming.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                  <p className="text-2xl font-bold text-green-600">{rentStatus.paid.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{rentStatus.overdue.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart and Rent Status */}
        <div className="grid grid-cols-1 gap-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Monthly Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revenueData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Annual Total</p>
                      <p className="text-lg font-bold text-emerald-600">₹{revenueData.total_annual.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Monthly Average</p>
                      <p className="text-lg font-bold text-blue-600">₹{Math.round(revenueData.average_monthly).toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Highest Month</p>
                      <p className="text-lg font-bold text-green-600">₹{Math.max(...revenueData.revenue).toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Growth Trend</p>
                      <p className="text-lg font-bold text-purple-600">↗ 12.5%</p>
                    </div>
                  </div>
                  
                  {/* Simple Bar Chart */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-12 gap-2 items-end h-48">
                      {revenueData.months.map((month, index) => {
                        const height = (revenueData.revenue[index] / Math.max(...revenueData.revenue)) * 100;
                        return (
                          <div key={month} className="flex flex-col items-center">
                            <div 
                              className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-sm transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500"
                              style={{ height: `${height}%` }}
                              title={`${month}: ₹${revenueData.revenue[index].toLocaleString()}`}
                            ></div>
                            <p className="text-xs text-gray-600 mt-2 font-medium">{month}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rent Payments Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Rent Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Paid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-green-700">Paid ({rentStatus.paid.length})</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Current
                    </Badge>
                  </div>
                  <div className="space-y-2" data-testid="paid-tenants-list">
                    {rentStatus.paid.length > 0 ? (
                      rentStatus.paid.map((tenant, index) => (
                        <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="font-medium text-green-900">{tenant.name}</p>
                          <p className="text-sm text-green-600">₹{tenant.rent?.toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No payments received yet</p>
                    )}
                  </div>
                </div>

                {/* Overdue */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-red-700">Overdue ({rentStatus.overdue.length})</h4>
                    <Badge variant="destructive">Action Required</Badge>
                  </div>
                  <div className="space-y-2" data-testid="overdue-tenants-list">
                    {rentStatus.overdue.length > 0 ? (
                      rentStatus.overdue.map((tenant, index) => (
                        <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
                          <p className="font-medium text-red-900">{tenant.name}</p>
                          <p className="text-sm text-red-600">₹{tenant.rent?.toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No overdue payments</p>
                    )}
                  </div>
                </div>

                {/* Upcoming */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-blue-700">Upcoming ({rentStatus.upcoming.length})</h4>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      Pending
                    </Badge>
                  </div>
                  <div className="space-y-2" data-testid="upcoming-tenants-list">
                    {rentStatus.upcoming.length > 0 ? (
                      rentStatus.upcoming.map((tenant, index) => (
                        <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="font-medium text-blue-900">{tenant.name}</p>
                          <p className="text-sm text-blue-600">₹{tenant.rent?.toLocaleString()}</p>
                          <p className="text-xs text-blue-500">Due: {tenant.due_date}th</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No upcoming payments</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {/*<div className="mt-8">*/}
        {/*  <Card>*/}
        {/*    <CardHeader>*/}
        {/*      <CardTitle>Quick Actions</CardTitle>*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">*/}
        {/*        <Link to="/owner-info">*/}
        {/*          <Button */}
        {/*            className="w-full btn-hover-lift transition-all duration-200 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"*/}
        {/*            data-testid="add-owner-info-btn"*/}
        {/*          >*/}
        {/*            Add Owner Information*/}
        {/*          </Button>*/}
        {/*        </Link>*/}
        {/*        <Link to="/property-info">*/}
        {/*          <Button */}
        {/*            className="w-full btn-hover-lift transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"*/}
        {/*            data-testid="add-property-btn"*/}
        {/*          >*/}
        {/*            Add New Property*/}
        {/*          </Button>*/}
        {/*        </Link>*/}
        {/*        <Link to="/tenant-details">*/}
        {/*          <Button */}
        {/*            className="w-full btn-hover-lift transition-all duration-200 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"*/}
        {/*            data-testid="manage-tenants-btn"*/}
        {/*          >*/}
        {/*            Manage Tenants*/}
        {/*          </Button>*/}
        {/*        </Link>*/}
        {/*      </div>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*</div>*/}
      </main>
    </div>
  );
};

export default Dashboard;