import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React from "react";

export default function NavBar() {

    return (
    <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <Link to="/dashboard" className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-5 4h5" />
                        </svg>
                    </div>

                    <h1 className="text-xl font-semibold text-gray-900 hover:underline">
                        RentalManager
                    </h1>
                </Link>

                <nav className="flex items-center space-x-4">
                    <Link
                        to="/owner-info"
                        className="text-gray-600 hover:text-emerald-600 font-medium transition-colors"
                        data-testid="owner-info-link"
                    >
                        Owner Info
                    </Link>
                    {/*<Link*/}
                    {/*    to="/property-info"*/}
                    {/*    className="text-gray-600 hover:text-emerald-600 font-medium transition-colors"*/}
                    {/*    data-testid="property-info-link"*/}
                    {/*>*/}
                    {/*    Properties*/}
                    {/*</Link>*/}
                    <Link
                        to="/tenant-details"
                        className="text-gray-600 hover:text-emerald-600 font-medium transition-colors"
                        data-testid="tenants-link"
                    >
                        Tenants
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        // onClick={handleLogout}
                        className="ml-4"
                        data-testid="logout-btn"
                    >
                        Logout
                    </Button>
                </nav>
            </div>
        </div>
    </header>
    );
}