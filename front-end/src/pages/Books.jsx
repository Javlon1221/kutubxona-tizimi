import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, BookOpen, Calendar, User } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { booksAPI } from '../services/api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    nomi: '',
    muallif: '',
    yil: '',
    mavjud: true,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await booksAPI.update(editingBook.id, formData);
      } else {
        await booksAPI.create(formData);
      }
      await fetchBooks();
      setIsModalOpen(false);
      setEditingBook(null);
      setFormData({ nomi: '', muallif: '', yil: '', mavjud: true });
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      nomi: book.nomi,
      muallif: book.muallif,
      yil: book.yil,
      mavjud: book.mavjud,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kitobni o\'chirishni xohlaysizmi?')) {
      try {
        await booksAPI.delete(id);
        await fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const filteredBooks = books.filter(book =>
    book.nomi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.muallif.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Kitoblar</h1>
          <p className="mt-2 text-lg text-gray-600">Kutubxona kitoblarini boshqaring va tashkil eting</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
          size="lg"
          className="shadow-lg"
        >
          Yangi Kitob
        </Button>
      </div>

      {/* Search */}
      <Card gradient>
        <div className="relative">
          <Input
            type="text"
            placeholder="Kitob nomi yoki muallif bo'yicha qidiring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="text-lg"
          />
        </div>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBooks.map((book) => (
          <Card key={book.id} hover gradient className="animate-fade-in group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{book.nomi}</h3>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  book.mavjud 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.mavjud ? 'Mavjud' : 'Olingan'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{book.muallif}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{book.yil} yil</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit}
                  onClick={() => handleEdit(book)}
                  className="flex-1"
                >
                  Tahrirlash
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(book.id)}
                  className="flex-1"
                >
                  O'chirish
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Kitoblar topilmadi</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Qidiruv natijasiga mos kitoblar topilmadi' : 'Hali hech qanday kitob qo\'shilmagan'}
            </p>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(null);
          setFormData({ nomi: '', muallif: '', yil: '', mavjud: true });
        }}
        title={editingBook ? 'Kitobni Tahrirlash' : 'Yangi Kitob Qo\'shish'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Kitob Nomi"
            value={formData.nomi}
            onChange={(e) => setFormData({ ...formData, nomi: e.target.value })}
            required
          />
          <Input
            label="Muallif"
            value={formData.muallif}
            onChange={(e) => setFormData({ ...formData, muallif: e.target.value })}
            required
          />
          <Input
            label="Nashr Yili"
            type="number"
            value={formData.yil}
            onChange={(e) => setFormData({ ...formData, yil: e.target.value })}
            required
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mavjud"
              checked={formData.mavjud}
              onChange={(e) => setFormData({ ...formData, mavjud: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="mavjud" className="text-sm font-medium text-gray-700">
              Kitob mavjud
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingBook(null);
                setFormData({ nomi: '', muallif: '', yil: '', mavjud: true });
              }}
            >
              Bekor Qilish
            </Button>
            <Button type="submit">
              {editingBook ? 'Yangilash' : 'Qo\'shish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Books;
