import React, { useState, useEffect } from 'react';
import { BookOpen, Users as UsersIcon, BookMarked, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import { booksAPI, usersAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    availableBooks: 0,
    borrowedBooks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [booksResponse, usersResponse] = await Promise.all([
        booksAPI.getAll(),
        usersAPI.getAll(),
      ]);

      const books = booksResponse.data;
      const availableBooks = books.filter(book => book.mavjud).length;
      const borrowedBooks = books.filter(book => !book.mavjud).length;

      setStats({
        totalBooks: books.length,
        totalUsers: usersResponse.data.length,
        availableBooks,
        borrowedBooks,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Jami Kitoblar',
      value: stats.totalBooks,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Mavjud Kitoblar',
      value: stats.availableBooks,
      icon: BookMarked,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Olingan Kitoblar',
      value: stats.borrowedBooks,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'O\'quvchilar',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        {/* <h1 className="text-5xl font-bold gradient-text mb-4">Dashboard</h1> */}
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Kutubxona tizimi boshqaruvi - barcha ma'lumotlar bir joyda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover gradient className="animate-fade-in group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card gradient>
        <Card.Header>
          <Card.Title gradient>Tezkor Amallar</Card.Title>
          <Card.Description>
            Kutubxona tizimida tez-tez ishlatiladigan amallar
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200/50 rounded-2xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-primary-100 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors">
                  <BookOpen className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">Yangi Kitob Qo'shish</h3>
                  <p className="text-sm text-gray-600 mt-1">Kutubxonaga yangi kitob qo'shing</p>
                </div>
              </div>
            </div>
            <div className="p-6 border border-gray-200/50 rounded-2xl hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                  <UsersIcon className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-700">O'quvchi Ro'yxatdan O'tkazish</h3>
                  <p className="text-sm text-gray-600 mt-1">Yangi o'quvchini ro'yxatdan o'tkazing</p>
                </div>
              </div>
            </div>
            <div className="p-6 border border-gray-200/50 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                  <BookMarked className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-700">Kitob Olish/Qaytarish</h3>
                  <p className="text-sm text-gray-600 mt-1">Kitob olish va qaytarish jarayonini boshqaring</p>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard;
