import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Input, Table, Space, Popconfirm } from 'antd'; // Ant Design Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faPen, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'; // Font Awesome Icons

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

  // Fetch all users from the back-end
  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Add a new user
  const addUser = async () => {
    try {
      const res = await axios.post("http://localhost:8000/users", newUser);
      setUsers([...users, res.data]);
      setNewUser({ name: "", age: "", city: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding user:", error.message);
    }
  };

  // Update user details
  const updateUser = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:8000/users/${id}`, editingUser);
      setUsers(users.map(user => (user._id === id ? res.data : user)));
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  // Filter users by search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.city.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle dark and light theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Ant Design Table Columns Definition
  const columns = [
    {
      title: 'S.NO',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      render: (text, user) => (
        editingUser && editingUser._id === user._id ? (
          <Input
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
          />
        ) : (
          user.name
        )
      ),
    },
    {
      title: 'Age',
      render: (text, user) => (
        editingUser && editingUser._id === user._id ? (
          <Input
            type="number"
            value={editingUser.age}
            onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}
          />
        ) : (
          user.age
        )
      ),
    },
    {
      title: 'City',
      render: (text, user) => (
        editingUser && editingUser._id === user._id ? (
          <Input
            value={editingUser.city}
            onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
          />
        ) : (
          user.city
        )
      ),
    },
    {
      title: 'Actions',
      render: (_, user) => (
        <Space size="middle">
          {editingUser && editingUser._id === user._id ? (
            <Button
              icon={<FontAwesomeIcon icon={faCheck} />}
              onClick={() => updateUser(user._id)}
              type="primary"
              size="small"
            />
          ) : (
            <Button
              icon={<FontAwesomeIcon icon={faPen} />}
              onClick={() => setEditingUser(user)}
              disabled={editingUser && editingUser._id === user._id}
              type="primary"
              size="small"
            />
          )}
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => deleteUser(user._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<FontAwesomeIcon icon={faTrash} />}
              type="danger"
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="theme">
        <Button onClick={toggleTheme} type="link">
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          {isDarkMode ? ' Switch to Light Theme' : ' Switch to Dark Theme'}
        </Button>
      </div>

      <div className="container">
        <h3>CRUD Application</h3>
        <div className="input-search">
          <Input.Search
            placeholder="Search users by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            enterButton
            style={{ width: 300, marginBottom: 16 }}
          />
          <Button type="primary" onClick={() => setShowModal(true)} style={{ marginLeft: 16 }}>
            Add Person
          </Button>
        </div>

        {/* Modal to add a new person */}
        <Modal
          title="Add Person"
          visible={showModal}
          onCancel={() => setShowModal(false)}
          footer={[
            <Button key="back" onClick={() => setShowModal(false)}>
              Close
            </Button>,
            <Button key="submit" type="primary" onClick={addUser}>
              Add Person
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter name"
              />
            </Form.Item>
            <Form.Item label="Age">
              <Input
                type="number"
                value={newUser.age}
                onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                placeholder="Enter age"
              />
            </Form.Item>
            <Form.Item label="City">
              <Input
                value={newUser.city}
                onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                placeholder="Enter city"
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Displaying Users in Ant Design Table */}
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </div>
    </div>
  );
};

export default App;
