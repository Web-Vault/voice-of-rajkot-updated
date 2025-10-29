import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-lg text-gray-700 mb-6">Page Not Found</p>
            <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded">Go Home</Link>
      </div>
);

export default NotFound;
