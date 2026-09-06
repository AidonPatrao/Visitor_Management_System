import React, { useEffect, useState } from 'react'
import { UserRoundSearch, School, Plus, MoreHorizontal, Pencil, Ban, CheckCircle, X } from 'lucide-react'
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

export function DepartmentsData() {
  const [departments, setDepartments] = useState([]);

  // Modal State Control
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form Inputs
  const [departmentNameInput, setDepartmentNameInput] = useState("");
  const [editingDepartment, setEditingDepartment] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, title: "", message: "" });

  const showToastNotification = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast({ show: false, title: "", message: "" }), 3500);
  };

  const getDeptId = (dept) => dept?.departmentId;

  const sortDepartments = (list) => {
    return [...list].sort((a, b) => Number(b.isActive) - Number(a.isActive));
  };

  useEffect(() => {
    axios.get('https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/departments', { withCredentials: true })
      .then((response) => {
        const rawData = Array.isArray(response.data) ? response.data : response.data.departments;
        setDepartments(sortDepartments(rawData));
      })
      .catch((error) => console.error("Error fetching departments:", error));
  }, []);

  // 1. ADD DEPARTMENT HANDLER
  const handleCreateDepartment = (e) => {
    e.preventDefault();
    if (!departmentNameInput.trim()) return;

    axios.post('https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/departments', 
      { departmentName: departmentNameInput },
      { withCredentials: true }
    )
    .then((response) => {
      const newDept = response.data;
      setDepartments((prev) => sortDepartments([...prev, newDept]));
      showToastNotification("Department created", `${departmentNameInput} has been created.`);
      setDepartmentNameInput("");
      setIsAddOpen(false);
    })
    .catch((error) => console.error("Error adding department:", error));
  };

  // 2. OPEN EDIT MODAL
  const handleOpenEdit = (department) => {
    setEditingDepartment(department);
    setDepartmentNameInput(department.departmentName);
    setIsEditOpen(true);
  };

  // 3. EDIT DEPARTMENT NAME HANDLER
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!departmentNameInput.trim() || !editingDepartment) return;

    const id = getDeptId(editingDepartment);

    axios.patch(`https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/departments/${id}`, 
      { departmentName: departmentNameInput },
      { withCredentials: true }
    )
    .then(() => {
      setDepartments((prev) =>
        prev.map((dept) =>
          getDeptId(dept) === id 
            ? { ...dept, departmentName: departmentNameInput } 
            : dept
        )
      );
      showToastNotification("Department updated", `${departmentNameInput} has been saved.`);
      setDepartmentNameInput("");
      setEditingDepartment(null);
      setIsEditOpen(false);
    })
    .catch((error) => console.error("Error editing department:", error));
  };

  // 4. TOGGLE STATUS (ACTIVATE / DEACTIVATE)
  const handleToggleStatus = (department) => {
    const id = getDeptId(department);
    const newStatus = !department.isActive;

    const endpoint = department.isActive 
      ? `https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/departments/${id}/deactivate`
      : `https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/departments/${id}/activate`;

    axios.patch(endpoint, {}, { withCredentials: true })
    .then(() => {
      setDepartments((prev) => {
        const updated = prev.map((dept) =>
          getDeptId(dept) === id ? { ...dept, isActive: newStatus } : dept
        );
        return sortDepartments(updated);
      });
      showToastNotification(
        "Status updated", 
        `${department.departmentName} has been ${newStatus ? "activated" : "deactivated"}.`
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
        <School className='m-8' />
        <div>
          <h2 className='mt-5 mb-2 font-mono text-xl'>Departments</h2>
          <h4 className='font-spacegrotesk'>Organizational units visitors can be hosted by</h4>
        </div>

        <div className='flex ml-auto'>
          {/* <label className='ml-auto bg-slate-300 m-5 rounded-xl'>
            <div className='flex m-4'>
              <UserRoundSearch className='mr-2 text-slate-600' />
              <input id="department-search" name='departmentSearch' placeholder='Search Departments' className='rounded-2xl font-spacegrotesk pl-3' />
            </div>
          </label> */}
          <div className='bg-blue-500 flex mt-5 mb-5 mr-6 rounded-xl hover:bg-blue-700 hover:text-blue-400 cursor-pointer'>
            <Plus className='mt-4 mb-4 ml-3 mr-1 text-white' />
            <button 
              type="button" 
              onClick={() => { setDepartmentNameInput(""); setIsAddOpen(true); }}  
              className='text-white p-4 mr-2 font-spacegrotesk cursor-pointer'
            >
              Add Department
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Department Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(departments) && departments.map((department) => {
            const isMaintenance = department.departmentName === "Maintenance";
            const isInactive = !department.isActive;

            let rowStyles = "";
            if (isMaintenance) {
              rowStyles = "bg-yellow-50 hover:bg-yellow-100 text-yellow-900";
            } else if (isInactive) {
              rowStyles = "bg-red-50 hover:bg-red-100 text-red-900";
            }

            return (
              <TableRow key={getDeptId(department) || department.departmentName} className={rowStyles}>
                <TableCell className="font-medium">
                  {department.departmentName}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    department.isActive 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                     {department.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(department.createdAt).toLocaleDateString('en-US', {
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
                        onClick={() => handleOpenEdit(department)}
                        disabled={!department.isActive}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                          !department.isActive ? "opacity-50 cursor-not-allowed text-slate-400" : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <Pencil className="h-4 w-4 text-slate-600" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(department)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                          department.isActive 
                            ? "text-red-600 hover:bg-red-50" 
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {department.isActive ? (
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

      {/* ADD DEPARTMENT MODAL */}
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
            <h3 className="text-lg font-bold text-slate-900">Add department</h3>
            <p className="text-sm text-slate-500 mb-6">This record becomes selectable in the visitor registration form.</p>
            
            <form onSubmit={handleCreateDepartment}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Department Name
              </label>
              <input 
                type="text" 
                value={departmentNameInput}
                onChange={(e) => setDepartmentNameInput(e.target.value)}
                placeholder="e.g. Facilities & Security"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm mb-6"
                autoFocus
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
                  Create department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DEPARTMENT MODAL */}
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
            <h3 className="text-lg font-bold text-slate-900">Edit department</h3>
            <p className="text-sm text-slate-500 mb-6">Update the master data record used by operators.</p>
            
            <form onSubmit={handleSaveEdit}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Department Name
              </label>
              <input 
                type="text" 
                value={departmentNameInput}
                onChange={(e) => setDepartmentNameInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm mb-6"
                autoFocus
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