import { ClipboardList, Home, Plus, Users } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Tasks', href: '/tasks', icon: ClipboardList },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className='flex flex-col w-64 bg-gray-800 text-white'>
      <div className='flex items-center justify-between h-16 px-4'>
        <h1 className='text-lg font-semibold'>SeaPunk Manager</h1>
      </div>

      <nav className='flex-1 px-2 py-4 space-y-2'>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <item.icon className='mr-3 h-5 w-5' />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className='px-2 py-4 border-t border-gray-700'>
        <Link
          to='/tasks/new'
          className='flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors'
        >
          <Plus className='mr-3 h-5 w-5' />
          New Task
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
