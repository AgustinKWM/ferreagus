// src/pages/admin/UserManagement.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@styles/AdminStyles.css';

export const UserManagement = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  // Datos de ejemplo - reemplazar con tu API real
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@ferremas.com' },
    { id: 2, name: 'María Gómez', email: 'maria@ferremas.com' }
  ]);

  const handleCreate = () => {
    navigate('/admin/create-employee');
  };

  const handleEdit = (employee) => {
    setSelectedUser(employee);
    navigate(`/admin/edit-employee/${employee.id}`);
  };

  const handleDelete = (employeeId) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      // Aquí iría la llamada a tu API
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    }
  };

  const handleLogout = () => {
    // Aquí iría tu lógica de logout
    navigate('/login');
  };

  return (
    <div className="employee-management">
      <h2>Gestión de Empleados</h2>
      
      <div className="button-group">
        <button onClick={handleCreate} className="btn-create">
          Crear Cuenta Empleado
        </button>
        
        {selectedUser && (
          <button 
            onClick={() => handleEdit(selectedUser)} 
            className="btn-edit"
            disabled={!selectedUser}
          >
            Editar Cuenta Seleccionada
          </button>
        )}
        
        {selectedUser && (
          <button 
            onClick={() => handleDelete(selectedUser.id)} 
            className="btn-delete"
            disabled={!selectedUser}
          >
            Eliminar Empleado Seleccionado
          </button>
        )}
        
        <button onClick={handleLogout} className="btn-logout">
          Salir
        </button>
      </div>

      <div className="employee-list">
        <h3>Lista de Empleados</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr 
                key={employee.id} 
                className={selectedUser?.id === employee.id ? 'selected' : ''}
              >
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>
                  <button 
                    onClick={() => setSelectedUser(employee)}
                    className="btn-select"
                  >
                    {selectedUser?.id === employee.id ? '✓ Seleccionado' : 'Seleccionar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};