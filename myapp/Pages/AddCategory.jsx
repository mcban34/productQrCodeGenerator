import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');

  const handleCategoryAdd = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost/qrApp/api/add_category.php', {
        name: categoryName
      });

      if (response.data.message) {
        setMessage(response.data.message);
        setCategoryName('');
      }
    } catch (error) {
      setMessage('Error adding category');
      console.error('Error adding category:', error);
    }
  };

  return (
    <div>
      <h1>Add New Category</h1>
      <form onSubmit={handleCategoryAdd}>
        <div>
          <label>Category Name:</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Category</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddCategory;
