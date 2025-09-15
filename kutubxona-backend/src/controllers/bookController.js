const pool = require("../models/db");

//  Kitob qo‘shish
exports.createBook = async (req, res) => {
  try {
    const { nomi, muallif, yil } = req.body;
    const result = await pool.query(
      "INSERT INTO books (nomi, muallif, yil) VALUES ($1, $2, $3) RETURNING *",
      [nomi, muallif, yil]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Barcha kitoblar
exports.getBooks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Bitta kitob qidirish
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM books WHERE id=$1", [id]);
    if (!result.rows.length) return res.status(404).json({ message: "Kitob topilmadi" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Kitobni yangilash
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomi, muallif, yil, mavjud } = req.body;
    const result = await pool.query(
      "UPDATE books SET nomi=$1, muallif=$2, yil=$3, mavjud=$4 WHERE id=$5 RETURNING *",
      [nomi, muallif, yil, mavjud, id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Kitob topilmadi" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Kitobni o‘chirish
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM books WHERE id=$1 RETURNING *", [id]);
    if (!result.rows.length) return res.status(404).json({ message: "Kitob topilmadi" });
    res.json({ message: "Kitob o‘chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
