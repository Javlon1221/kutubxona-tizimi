import React, { useState, useEffect } from 'react';
import { BookOpen, Users as UsersIcon, ArrowRight, ArrowLeft, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { booksAPI, usersAPI, borrowAPI } from '../services/api';

const Borrow = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [borrowLoading, setBorrowLoading] = useState(false);

  // 🔹 Yangi state confirm uchun
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookToReturn, setBookToReturn] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksResponse, usersResponse] = await Promise.all([
        booksAPI.getAll(),
        usersAPI.getAll(),
      ]);
      setBooks(booksResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedBook) return;

    try {
      setBorrowLoading(true);
      await borrowAPI.borrow({
        user_id: parseInt(selectedUser),
        book_id: selectedBook.id,
      });

      const response = await booksAPI.getAll();
      setBooks(response.data);

      setIsBorrowModalOpen(false);
      setSelectedBook(null);
      setSelectedUser('');
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Kitob olishda xato yuz berdi: ' + (error.response?.data?.message || error.message));
    } finally {
      setBorrowLoading(false);
    }
  };

  // 🔹 Modal ochish
  const openConfirm = (book) => {
    setBookToReturn(book);
    setConfirmOpen(true);
  };

  // 🔹 Qaytarishni tasdiqlash
  const confirmReturn = async () => {
    try {
      await booksAPI.update(bookToReturn.id, {
        nomi: bookToReturn.nomi,
        muallif: bookToReturn.muallif,
        yil: bookToReturn.yil,
        mavjud: true,
      });
      await fetchData();
    } catch (error) {
      console.error('Error returning book:', error);
    } finally {
      setConfirmOpen(false);
      setBookToReturn(null);
    }
  };

  const availableBooks = books.filter((book) => book.mavjud);
  const borrowedBooks = books.filter((book) => !book.mavjud);

  const filteredAvailableBooks = availableBooks.filter(
    (book) =>
      book.nomi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.muallif.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBorrowedBooks = borrowedBooks.filter(
    (book) =>
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kitob Olish/Qaytarish</h1>
        <p className="mt-2 text-gray-600">Kitob olish va qaytarish jarayonini boshqaring</p>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Kitob nomi yoki muallif bo'yicha qidiring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Available Books */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-green-600" />
            Mavjud Kitoblar ({availableBooks.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAvailableBooks.map((book) => (
            <Card key={book.id} hover className="animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{book.nomi}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book.muallif}</p>
                  <p className="text-xs text-gray-500">{book.yil}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedBook(book);
                    setIsBorrowModalOpen(true);
                  }}
                  className="flex items-center space-x-1"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Olish</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Borrowed Books */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
          <UsersIcon className="w-5 h-5 mr-2 text-red-600" />
          Olingan Kitoblar ({borrowedBooks.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBorrowedBooks.map((book) => (
            <Card key={book.id} hover className="animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{book.nomi}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book.muallif}</p>
                  <p className="text-xs text-gray-500">{book.yil}</p>
                </div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => openConfirm(book)}
                  className="flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Qaytarish</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Borrow Modal */}
      <Modal
        isOpen={isBorrowModalOpen}
        onClose={() => {
          setIsBorrowModalOpen(false);
          setSelectedBook(null);
          setSelectedUser('');
        }}
        title="Kitob Olish"
      >
        {selectedBook && (
          <form onSubmit={handleBorrow} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">{selectedBook.nomi}</h3>
              <p className="text-sm text-gray-600">{selectedBook.muallif}</p>
              <p className="text-xs text-gray-500">{selectedBook.yil}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                O'quvchini tanlang
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="input"
                required
              >
                <option value="">O'quvchini tanlang...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.ism} {user.familiya}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsBorrowModalOpen(false);
                  setSelectedBook(null);
                  setSelectedUser('');
                }}
              >
                Bekor Qilish
              </Button>
              <Button type="submit" loading={borrowLoading}>
                Kitobni Olish
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Confirm Modal for Return */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Tasdiqlash"
      >
        <p>Haqiqatan ham "{bookToReturn?.nomi}" kitobini qaytarmoqchimisiz?</p>
        <div className="flex justify-end space-x-3 mt-4">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Yo‘q
          </Button>
          <Button variant="success" onClick={confirmReturn}>
            Ha, Qaytarish
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Borrow;
