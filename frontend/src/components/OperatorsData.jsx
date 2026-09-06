import React, { useEffect, useState } from 'react'
import { UserRoundSearch, ShieldUser, Plus, MoreHorizontal, Ban, CheckCircle, X } from 'lucide-react'
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

export function OperatorsData() {
  const [operators, setOperators] = useState([]);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form Inputs
  const [userNameInput, setUserNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, title: "", message: "" });

  const showToastNotification = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast({ show: false, title: "", message: "" }), 3500);
  };

  const getOperatorId = (op) => op?.userId;

  const sortOperators = (list) => {
    return [...list].sort((a, b) => Number(b.isActive) - Number(a.isActive));
  };

  // Fetch operators list on mount
  useEffect(() => {
    axios.get('https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/operators', { withCredentials: true })
      .then((response) => {
        const rawData = Array.isArray(response.data) ? response.data : response.data.operators;
        setOperators(sortOperators(rawData || []));
      })
      .catch((error) => console.error("Error fetching operators:", error));
  }, []);

  // 1. CREATE OPERATOR HANDLER
  const handleCreateOperator = (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) return;

    axios.post('https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/operators', 
      { 
        userName: userNameInput,
        email: emailInput,
        password: passwordInput
      },
      { withCredentials: true }
    )
    .then((response) => {
      const newOp = response.data;
      setOperators((prev) => sortOperators([newOp, ...prev]));
      showToastNotification("Operator created", `${userNameInput || emailInput} has been added.`);
      setUserNameInput("");
      setEmailInput("");
      setPasswordInput("");
      setIsAddOpen(false);
    })
    .catch((error) => {
      console.error("Error creating operator:", error);
      alert(error.response?.data?.message || "Failed to create operator");
    });
  };

  // 2. TOGGLE OPERATOR STATUS (ACTIVATE / DEACTIVATE)
  const handleToggleStatus = (operator) => {
    const id = getOperatorId(operator);
    const newStatus = !operator.isActive;

    const endpoint = operator.isActive 
      ? `https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/operators/${id}/deactivate`
      : `https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/operators/${id}/activate`;

    axios.patch(endpoint, {}, { withCredentials: true })
      .then(() => {
        setOperators((prev) => {
          const updated = prev.map((op) =>
            getOperatorId(op) === id ? { ...op, isActive: newStatus } : op
          );
          return sortOperators(updated);
        });
        showToastNotification(
          "Status updated", 
          `${operator.userName || operator.email} has been ${newStatus ? "activated" : "deactivated"}.`
        );
      })
      .catch((error) => console.error("Error toggling operator status:", error));
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
        <ShieldUser className='m-8' />
        <div>
          <h2 className='mt-5 mb-2 font-mono text-xl'>Operators</h2>
          <h4 className='font-spacegrotesk'>Manage system operators and registration permissions</h4>
        </div>

        <div className='flex ml-auto'>
          {/* <label className='ml-auto bg-slate-300 m-5 rounded-xl'>
            <div className='flex m-4'>
              <UserRoundSearch className='mr-2 text-slate-600' />
              <input id="operator-search" name='operatorSearch' placeholder='Search Operators' className='rounded-2xl font-spacegrotesk pl-3' />
            </div>
          </label> */}
          <div className='bg-blue-500 flex mt-5 mb-5 mr-6 rounded-xl hover:bg-blue-700 hover:text-blue-400 cursor-pointer'>
            <Plus className='mt-4 mb-4 ml-3 mr-1 text-white' />
            <button 
              type="button" 
              onClick={() => { 
                setUserNameInput("");
                setEmailInput("");
                setPasswordInput("");
                setIsAddOpen(true); 
              }} 
              className='text-white p-4 mr-2 font-spacegrotesk cursor-pointer'
            >
              Add Operator
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Operator Name</TableHead>
            <TableHead className="w-[220px]">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(operators) && operators.map((operator) => {
            const isInactive = !operator.isActive;
            const rowStyles = isInactive ? "bg-red-50 hover:bg-red-100 text-red-900" : "";

            return (
              <TableRow key={getOperatorId(operator) || operator.email} className={rowStyles}>
                <TableCell className="font-medium">
                  {operator.userName || "Unnamed Operator"}
                </TableCell>
                <TableCell>
                  {operator.email}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    operator.isActive 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                     {operator.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(operator.createdAt).toLocaleDateString('en-US', {
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
                        onClick={() => handleToggleStatus(operator)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                          operator.isActive 
                            ? "text-red-600 hover:bg-red-50" 
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {operator.isActive ? (
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

      {/* ADD OPERATOR MODAL */}
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
            <h3 className="text-lg font-bold text-slate-900">Add Operator</h3>
            <p className="text-sm text-slate-500 mb-6">Register a new operator account for the portal.</p>
            
            <form onSubmit={handleCreateOperator}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Operator Name
              </label>
              <input 
                type="text" 
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                placeholder="e.g. Alex Smith"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm mb-4"
              />

              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. alex@company.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm mb-4"
                required
              />

              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
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
                  Create Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}