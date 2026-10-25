
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8080/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadEmployees() {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
      setError("");
    } catch {
      setError("Unable to load employees. Check your Spring Boot backend.");
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const employee = {
        ...form,
        salary: Number(form.salary),
      };

      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, employee);
      } else {
        await axios.post(API_URL, employee);
      }

      setForm({
        name: "",
        email: "",
        department: "",
        salary: "",
      });
      setEditingId(null);
      setError("");
      await loadEmployees();
    } catch {
      setError("Unable to save employee. Check your API endpoint and backend logs.");
    }
  }

  function handleEdit(employee) {
    setEditingId(employee.id);
    setForm({
      name: employee.name ?? "",
      email: employee.email ?? "",
      department: employee.department ?? "",
      salary: employee.salary ?? "",
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      await loadEmployees();
    } catch {
      setError("Unable to delete employee.");
    }
  }

  return (
    <div className="container">
      <h1>Employee Management System</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <input
          name="salary"
          type="number"
          min="0"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId !== null ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      <h2>Employee List</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.salary}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleEdit(employee)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
