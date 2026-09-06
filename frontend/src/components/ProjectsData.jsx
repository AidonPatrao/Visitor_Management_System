import React, { useEffect, useState } from 'react'
import { UserRoundSearch, Briefcase, Plus, MoreHorizontal, Pencil, Ban, CheckCircle, X } from 'lucide-react'
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

export function ProjectsData({ selectedDepartmentId }) {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Modal State Control
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form Inputs
  const [projectNameInput, setProjectNameInput] = useState("");
  const [selectedDeptForModal, setSelectedDeptForModal] = useState("");
  const [editingProject, setEditingProject] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, title: "", message: "" });

  const showToastNotification = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast({ show: false, title: "", message: "" }), 3500);
  };

  const getProjectId = (proj) => proj?.projectId;

  const sortProjects = (list) => {
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

  // Fetch projects list
  useEffect(() => {
    const url = selectedDepartmentId 
      ? `https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/projects?departmentId=${selectedDepartmentId}`
      : 'https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/projects';

    axios.get(url, { withCredentials: true })
      .then((response) => {
        const rawData = Array.isArray(response.data) ? response.data : response.data.projects;
        setProjects(sortProjects(rawData));
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, [selectedDepartmentId]);

  // 1. ADD PROJECT HANDLER
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projectNameInput.trim() || !selectedDeptForModal) return;

    axios.post('https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/projects', 
      { 
        projectName: projectNameInput,
        departmentId: Number(selectedDeptForModal)
      },
      { withCredentials: true }
    )
    .then((response) => {
      const newProj = response.data;
      setProjects((prev) => sortProjects([...prev, newProj]));
      showToastNotification("Project created", `${projectNameInput} has been created.`);
      setProjectNameInput("");
      setSelectedDeptForModal("");
      setIsAddOpen(false);
    })
    .catch((error) => console.error("Error adding project:", error));
  };

  // 2. OPEN EDIT MODAL
  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setProjectNameInput(project.projectName);
    setSelectedDeptForModal(project.departmentId || project.department?.departmentId || "");
    setIsEditOpen(true);
  };

  // 3. EDIT PROJECT NAME HANDLER
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!projectNameInput.trim() || !editingProject) return;

    const id = getProjectId(editingProject);

    axios.patch(`https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/projects/${id}`, 
      { 
        projectName: projectNameInput,
        departmentId: selectedDeptForModal ? Number(selectedDeptForModal) : undefined
      },
      { withCredentials: true }
    )
    .then((response) => {
      const updatedProj = response.data;
      setProjects((prev) =>
        prev.map((proj) =>
          getProjectId(proj) === id ? updatedProj : proj
        )
      );
      showToastNotification("Project updated", `${projectNameInput} has been saved.`);
      setProjectNameInput("");
      setSelectedDeptForModal("");
      setEditingProject(null);
      setIsEditOpen(false);
    })
    .catch((error) => console.error("Error editing project:", error));
  };

  // 4. TOGGLE STATUS (ACTIVATE / DEACTIVATE)
  const handleToggleStatus = (project) => {
    const id = getProjectId(project);
    const newStatus = !project.isActive;

    const endpoint = project.isActive 
      ? `https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/projects/${id}/deactivate`
      : `https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/projects/${id}/activate`;

    axios.patch(endpoint, {}, { withCredentials: true })
    .then(() => {
      setProjects((prev) => {
        const updated = prev.map((proj) =>
          getProjectId(proj) === id ? { ...proj, isActive: newStatus } : proj
        );
        return sortProjects(updated);
      });
      showToastNotification(
        "Status updated", 
        `${project.projectName} has been ${newStatus ? "activated" : "deactivated"}.`
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
        <Briefcase className='m-8' />
        <div>
          <h2 className='mt-5 mb-2 font-mono text-xl'>Projects</h2>
          <h4 className='font-spacegrotesk'>Manage organizational projects and operations</h4>
        </div>

        <div className='flex ml-auto'>
          {/* <label className='ml-auto bg-slate-300 m-5 rounded-xl'>
            <div className='flex m-4'>
              <UserRoundSearch className='mr-2 text-slate-600' />
              <input id="project-search" name='projectSearch' placeholder='Search Projects' className='rounded-2xl font-spacegrotesk pl-3' />
            </div>
          </label> */}
          <div className='bg-blue-500 flex mt-5 mb-5 mr-6 rounded-xl hover:bg-blue-700 hover:text-blue-400 cursor-pointer'>
            <Plus className='mt-4 mb-4 ml-3 mr-1 text-white' />
            <button 
              type="button" 
              onClick={() => { 
                setProjectNameInput(""); 
                setSelectedDeptForModal(selectedDepartmentId || "");
                setIsAddOpen(true); 
              }} 
              className='text-white p-4 mr-2 font-spacegrotesk cursor-pointer'
            >
              Add Project
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Department</TableHead>
            <TableHead className="w-[200px]">Project Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(projects) && projects.map((project) => {
            const isInactive = !project.isActive;
            const deptName = project.department?.departmentName || "Unassigned";
            const isMaintenance = deptName.toLowerCase() === "maintenance";

            // Priority: Red for Inactive -> Yellow for Maintenance -> Standard
            const rowStyles = isInactive 
              ? "bg-red-50 hover:bg-red-100 text-red-900" 
              : isMaintenance 
              ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-900" 
              : "";

            return (
              <TableRow key={getProjectId(project) || project.projectName} className={rowStyles}>
                {/* DEPARTMENT NAME COLUMN */}
                <TableCell className="font-semibold text-slate-700">
                  {deptName}
                </TableCell>
                <TableCell className="font-medium">
                  {project.projectName}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    project.isActive 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                     {project.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(project.createdAt).toLocaleDateString('en-US', {
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
                        onClick={() => handleOpenEdit(project)}
                        disabled={!project.isActive}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                          !project.isActive ? "opacity-50 cursor-not-allowed text-slate-400" : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <Pencil className="h-4 w-4 text-slate-600" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(project)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                          project.isActive 
                            ? "text-red-600 hover:bg-red-50" 
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {project.isActive ? (
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

      {/* ADD PROJECT MODAL */}
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
            <h3 className="text-lg font-bold text-slate-900">Add project</h3>
            <p className="text-sm text-slate-500 mb-6">Create a project and assign it to a department.</p>
            
            <form onSubmit={handleCreateProject}>
              {/* DEPARTMENT SELECTOR */}
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select Department
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

              {/* PROJECT NAME */}
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Project Name
              </label>
              <input 
                type="text" 
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                placeholder="e.g. Site Expansion Phase 2"
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
                  Create project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
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
            <h3 className="text-lg font-bold text-slate-900">Edit project</h3>
            <p className="text-sm text-slate-500 mb-6">Update project name and assignment.</p>
            
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

              {/* PROJECT NAME */}
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Project Name
              </label>
              <input 
                type="text" 
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
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