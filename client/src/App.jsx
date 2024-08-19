import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState({ name: "", age: "", city: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const addUser = async () => {
    try {
      const res = await axios.post("http://localhost:8000/users", newUser);
      setUsers([...users, res.data]);
      setNewUser({ name: "", age: "", city: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const updateUser = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:8000/users/${id}`, editingUser);
      setUsers(users.map(user => (user.id === id ? res.data : user)));
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.city.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div>
      <div className="theme">
      <Button onClick={toggleTheme}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} /> {/* Icon changes based on theme */}
          {isDarkMode ? ' Switch to Light Theme' : ' Switch to Dark Theme'}
        </Button>
      </div>
      <div className="container">
        <h3>CRUD</h3>
        
        
        <div className="input-search">
          <input
            type="search"
            placeholder="Search users by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className='btn green' onClick={() => setShowModal(true)}>Add person</Button>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Person</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  value={newUser.age}
                  onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                  placeholder="Enter age"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={newUser.city}
                  onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                  placeholder="Enter city"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={addUser}>
              Add Person
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="table">
          <table>
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
                <th>Edit</th> {/* Separate column for Edit button */}
                <th>Delete</th> {/* Separate column for Delete button */}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>
                    {editingUser && editingUser.id === user.id ? (
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser.id === user.id ? (
                      <input
                        type="number"
                        value={editingUser.age}
                        onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}
                      />
                    ) : (
                      user.age
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser.id === user.id ? (
                      <input
                        type="text"
                        value={editingUser.city}
                        onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                      />
                    ) : (
                      user.city
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser.id === user.id ? (
                      <button className='btn green' onClick={() => updateUser(user.id)}>Save</button>
                    ) : (
                      <button className='btn green' onClick={() => setEditingUser(user)}>Edit</button>
                    )}
                  </td>
                  <td>
                    <button className='btn red' onClick={() => deleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
