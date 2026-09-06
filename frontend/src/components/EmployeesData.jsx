import React, { useEffect, useState } from 'react'
import { UserRoundSearch, Users, Plus, MoreHorizontal, Pencil, Ban, CheckCircle, X } from 'lucide-react'
import axios from 'axios'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function EmployeesData({ selectedDepartmentId }) {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Modal State Control
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form Inputs
  const [employeeNameInput, setEmployeeNameInput] = useState("");
  const [selectedDeptForModal, setSelectedDeptForModal] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, title: "", message: "" });

  const showToastNotification = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast({ show: false, title: "", message: "" }), 3500);
  };

  const getEmpId = (emp) => emp?.employeeId;

  const sortEmployees = (list) => {
    return [...list].sort((a, b) => Number(b.isActive) - Number(a.isActive));
  };

  // Fetch departments list for the modal dropdown
  useEffect(() => {
    axios.get('https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/departments', { withCredentials: true })
      .then((response) => {
        const rawDepts = Array.isArray(response.data) ? response.data : response.data.departments;
        setDepartments(rawDepts || []);
      })
      .catch((error) => console.error("Error fetching departments for modal:", error));
  }, []);

  // Fetch employees list
  useEffect(() => {
    const url = selectedDepartmentId 
      ? `https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/employees?departmentId=${selectedDepartmentId}`
      : 'https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/employees';

    axios.get(url, { withCredentials: true })
      .then((response) => {
        const rawData = Array.isArray(response.data) ? response.data : response.data.employees;
        setEmployees(sortEmployees(rawData));
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, [selectedDepartmentId]);

  // 1. ADD EMPLOYEE HANDLER
  const handleCreateEmployee = (e) => {
    e.preventDefault();
    if (!employeeNameInput.trim() || !selectedDeptForModal) return;

    axios.post('https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/employees', 
      { 
        employeeName: employeeNameInput,
        departmentId: Number(selectedDeptForModal)
      },
      { withCredentials: true }
    )
    .then((response) => {
      const newEmp = response.data;
      setEmployees((prev) => sortEmployees([...prev, newEmp]));
      showToastNotification("Employee added", `${employeeNameInput} has been added.`);
      setEmployeeNameInput("");
      setSelectedDeptForModal("");
      setIsAddOpen(false);
    })
    .catch((error) => console.error("Error adding employee:", error));
  };

  // 2. OPEN EDIT MODAL
  const handleOpenEdit = (employee) => {
    setEditingEmployee(employee);
    setEmployeeNameInput(employee.employeeName || "");
    setSelectedDeptForModal(employee.departmentId || employee.department?.departmentId || "");
    setIsEditOpen(true);
  };

  // 3. EDIT EMPLOYEE HANDLER
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!employeeNameInput.trim() || !editingEmployee) return;

    const id = getEmpId(editingEmployee);

    axios.patch(`https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/employees/${id}`, 
      { 
        employeeName: employeeNameInput,
        departmentId: selectedDeptForModal ? Number(selectedDeptForModal) : undefined
      },
      { withCredentials: true }
    )
    .then((response) => {
      const updatedEmp = response.data;
      setEmployees((prev) =>
        prev.map((emp) =>
          getEmpId(emp) === id ? updatedEmp : emp
        )
      );
      showToastNotification("Employee updated", `${employeeNameInput} details saved.`);
      setEmployeeNameInput("");
      setSelectedDeptForModal("");
      setEditingEmployee(null);
      setIsEditOpen(false);
    })
    .catch((error) => console.error("Error editing employee:", error));
  };

  // 4. TOGGLE STATUS (ACTIVATE / DEACTIVATE)
  const handleToggleStatus = (employee) => {
    const id = getEmpId(employee);
    const newStatus = !employee.isActive;

    const endpoint = employee.isActive 
      ? `https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/employees/${id}/deactivate`
      : `https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/employees/${id}/activate`;

    axios.patch(endpoint, {}, { withCredentials: true })
    .then(() => {
      setEmployees((prev) => {
        const updated = prev.map((emp) =>
          getEmpId(emp) === id ? { ...emp, isActive: newStatus } : emp
        );
        return sortEmployees(updated);
      });
      showToastNotification(
        "Status updated", 
        `${employee.employeeName} has been ${newStatus ? "activated" : "deactivated"}.`
      );
    })
    .catch((error) => console.error("Error toggling status:", error));
  };

  return (
    <div className="relative">
      {/* SUCCESS TOAST NOTIFICATION OVERLAY */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-xl transition-all animate-in fade-in slide-in-from-top-2">
          <div className="bg-emerald-600 rounded-full p-1 text-white mt-0.5">
            <CheckCircle className="h-4 w-4" />
          </div>
          <div className="pr-2">
            <h4 className="text-sm font-semibold text-emerald-900">{toast.title}</h4>
            <p className="text-xs text-emerald-700 mt-0.5">{toast.message}</p>
          </div>
          <button 
            type="button"
            onClick={() => setToast({ show: false, title: "", message: "" })} 
            className="text-emerald-400 hover:text-emerald-700 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Header & Search Bar */}
      <div className='h-24 border border-b-slate-300 flex'>
        <Users className='m-8' />
        <div>
          <h2 className='mt-5 mb-2 font-mono text-xl'>Employees</h2>
          <h4 className='font-spacegrotesk'>Manage team members and host operations</h4>
        </div>

        <div className='flex ml-auto'>
          {/* <label className='ml-auto bg-slate-300 m-5 rounded-xl'>
            <div className='flex m-4'>
              <UserRoundSearch className='mr-2 text-slate-600' />
              <input id="employee-search" name='employeeSearch' placeholder='Search Employees' className='rounded-2xl font-spacegrotesk pl-3' />
            </div>
          </label> */}
          <div className='bg-blue-500 flex mt-5 mb-5 mr-6 rounded-xl hover:bg-blue-700 hover:text-blue-400 cursor-pointer'>
            <Plus className='mt-4 mb-4 ml-3 mr-1 text-white' />
            <button 
              type="button" 
              onClick={() => { 
                setEmployeeNameInput("");
                setSelectedDeptForModal(selectedDepartmentId || ""); 
                setIsAddOpen(true); 
              }} 
              className='text-white p-4 mr-2 font-spacegrotesk cursor-pointer'
            >
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Department</TableHead>
            <TableHead className="w-[200px]">Employee Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(employees) && employees.map((employee) => {
            const isInactive = !employee.isActive;
            const deptName = employee.department?.departmentName || "Unassigned";
            const isMaintenance = deptName.toLowerCase() === "maintenance";

            // Priority: Red for Inactive -> Yellow for Maintenance -> Standard
            const rowStyles = isInactive 
              ? "bg-red-50 hover:bg-red-100 text-red-900" 
              : isMaintenance 
              ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-900" 
              : "";

            return (
              <TableRow key={getEmpId(employee) || employee.employeeName} className={rowStyles}>
                {/* DEPARTMENT NAME COLUMN */}
                <TableCell className="font-semibold text-slate-700">
                  {deptName}
                </TableCell>
                <TableCell className="font-medium">
                  {employee.employeeName}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    employee.isActive 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                     {employee.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(employee.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
                
                {/* ACTIONS DROPDOWN MENU */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer outline-none">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="end" className="w-36 bg-white rounded-xl shadow-lg border border-slate-200 p-1">
                      <DropdownMenuItem 
                        onClick={() => handleOpenEdit(employee)}
                        disabled={!employee.isActive}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                          !employee.isActive ? "opacity-50 cursor-not-allowed text-slate-400" : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <Pencil className="h-4 w-4 text-slate-600" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(employee)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                          employee.isActive 
                            ? "text-red-600 hover:bg-red-50" 
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {employee.isActive ? (
                          <>
                            <Ban className="h-4 w-4 text-red-600" />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            <span>Activate</span>
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* ADD EMPLOYEE MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100 relative">
            <button 
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Add employee</h3>
            <p className="text-sm text-slate-500 mb-6">Create an employee profile and assign them to a department.</p>
            
            <form onSubmit={handleCreateEmployee}>
              {/* DEPARTMENT SELECTOR */}
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department
              </label>
              <select
                value={selectedDeptForModal}
                onChange={(e) => setSelectedDeptForModal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm mb-4 bg-white"
                required
              >
                <option value="" disabled>-- Select a Department --</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>

              {/* EMPLOYEE NAME */}
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                value={employeeNameInput}
                onChange={(e) => setEmployeeNameInput(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm mb-6"
                required
              />

              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                >
                  Create employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100 relative">
            <button 
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Edit employee</h3>
            <p className="text-sm text-slate-500 mb-6">Update employee details and department assignment.</p>
            
            <form onSubmit={handleSaveEdit}>
              {/* DEPARTMENT SELECTOR */}
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department
              </label>
              <select
                value={selectedDeptForModal}
                onChange={(e) => setSelectedDeptForModal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm mb-4 bg-white"
                required
              >
                <option value="" disabled>-- Select a Department --</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>

              {/* EMPLOYEE NAME */}
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                value={employeeNameInput}
                onChange={(e) => setEmployeeNameInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm mb-6"
                required
              />

              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}