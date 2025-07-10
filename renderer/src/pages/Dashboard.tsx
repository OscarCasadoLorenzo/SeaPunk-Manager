import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTasks } from '@/hooks/useTasks';
import { useUsers } from '@/hooks/useUsers';
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

export const Dashboard: React.FC = () => {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: users, isLoading: usersLoading } = useUsers();

  if (tasksLoading || usersLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  const completedTasks = tasks?.filter((task) => task.completed).length || 0;
  const totalTasks = tasks?.length || 0;
  const pendingTasks = totalTasks - completedTasks;
  const urgentTasks =
    tasks?.filter((task) => task.priority === 'URGENT').length || 0;

  const stats = [
    {
      name: 'Total Users',
      value: users?.length || 0,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Tasks',
      value: totalTasks,
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
    },
    {
      name: 'Urgent Tasks',
      value: urgentTasks,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
        <p className='text-gray-600'>Overview of your task management system</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {stats.map((stat) => (
          <div key={stat.name} className='card'>
            <div className='card-content'>
              <div className='flex items-center'>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className='h-6 w-6 text-white' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>
                    {stat.name}
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='card'>
          <div className='card-header'>
            <h3 className='text-lg font-semibold'>Task Progress</h3>
          </div>
          <div className='card-content'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-gray-600'>
                Completion Rate
              </span>
              <span className='text-sm font-medium text-gray-900'>
                {totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-green-500 h-2 rounded-full transition-all duration-300'
                style={{
                  width: `${
                    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                  }%`,
                }}
              />
            </div>
            <div className='mt-4 flex justify-between text-sm text-gray-600'>
              <span>Completed: {completedTasks}</span>
              <span>Pending: {pendingTasks}</span>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='card-header'>
            <h3 className='text-lg font-semibold'>Recent Activity</h3>
          </div>
          <div className='card-content'>
            <div className='text-sm text-gray-600 space-y-2'>
              <div className='flex items-center justify-between'>
                <span>Users registered</span>
                <span className='font-medium'>{users?.length || 0}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span>Tasks created</span>
                <span className='font-medium'>{totalTasks}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span>Tasks completed</span>
                <span className='font-medium'>{completedTasks}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span>Urgent tasks</span>
                <span className='font-medium text-red-600'>{urgentTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
