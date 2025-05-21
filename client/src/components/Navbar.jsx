import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  BarChart2,
  Wallet,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/plan', name: 'Plan', icon: <BookOpen size={20} /> },
    { path: '/tasks', name: 'Tasks', icon: <ClipboardCheck size={20} /> },
    { path: '/notes', name: 'Notes', icon: <GraduationCap size={20} /> },
    { path: '/tests', name: 'Tests', icon: <BarChart2 size={20} /> },
    { path: '/wallet', name: 'Wallet', icon: <Wallet size={20} /> },
    { path: '/profile', name: 'Profile', icon: <User size={20} /> },
  ];
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-blue-600">AI Classroom</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut size={20} />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {item.icon}
                </Link>
              ))}
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
