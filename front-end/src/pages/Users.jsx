import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Users as UsersIcon, Phone, User } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { usersAPI } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    ism: '',
    familiya: '',
    telefon: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersAPI.update(editingUser.id, formData);
      } else {
        await usersAPI.create(formData);
      }
      await fetchUsers();
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ ism: '', familiya: '', telefon: '' });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      ism: user.ism,
      familiya: user.familiya,
      telefon: user.telefon || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu o\'quvchini o\'chirishni xohlaysizmi?')) {
      try {
        await usersAPI.delete(id);
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.ism} ${user.familiya}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.telefon && user.telefon.includes(searchTerm))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">O'quvchilar</h1>
          <p className="mt-2 text-gray-600">Kutubxona o'quvchilarini boshqaring</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi O'quvchi</span>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Ism, familiya yoki telefon bo'yicha qidiring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} hover className="animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <UsersIcon className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">
                    {user.ism} {user.familiya}
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>ID: {user.id}</span>
                  </div>
                  {user.telefon && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{user.telefon}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(user)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">O'quvchilar topilmadi</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Qidiruv natijasiga mos o\'quvchilar topilmadi' : 'Hali hech qanday o\'quvchi ro\'yxatdan o\'tmagan'}
            </p>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          setFormData({ ism: '', familiya: '', telefon: '' });
        }}
        title={editingUser ? 'O\'quvchini Tahrirlash' : 'Yangi O\'quvchi Qo\'shish'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Ism"
            value={formData.ism}
            onChange={(e) => setFormData({ ...formData, ism: e.target.value })}
            required
          />
          <Input
            label="Familiya"
            value={formData.familiya}
            onChange={(e) => setFormData({ ...formData, familiya: e.target.value })}
            required
          />
          <Input
            label="Telefon Raqami"
            type="tel"
            value={formData.telefon}
            onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
            placeholder="+998 90 123 45 67"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingUser(null);
                setFormData({ ism: '', familiya: '', telefon: '' });
              }}
            >
              Bekor Qilish
            </Button>
            <Button type="submit">
              {editingUser ? 'Yangilash' : 'Qo\'shish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
