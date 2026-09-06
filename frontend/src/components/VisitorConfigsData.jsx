import React, { useEffect, useState } from 'react'
import { Sliders, Car, Users, Plus, CheckCircle, X } from 'lucide-react'
import axios from 'axios'

export function VisitorConfigsData() {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [memberCounts, setMemberCounts] = useState([]);

  // Form Inputs
  const [newVehicleType, setNewVehicleType] = useState("");
  const [newMemberCount, setNewMemberCount] = useState("");

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, title: "", message: "" });

  const showToastNotification = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast({ show: false, title: "", message: "" }), 3500);
  };

  // Fetch initial combined configurations
  const fetchConfigs = () => {
    axios.get('https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/visitorConfigs', { withCredentials: true })
      .then((res) => {
        setVehicleTypes(res.data.vehicleTypes || []);
        setMemberCounts(res.data.memberCounts || []);
      })
      .catch((err) => console.error("Error fetching visitor configs:", err));
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  // 1. ADD VEHICLE TYPE
  const handleAddVehicleType = (e) => {
    e.preventDefault();
    if (!newVehicleType.trim()) return;

    axios.post('https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/visitorConfigs/vehicleTypes', 
      { vehicleType: newVehicleType.trim() },
      { withCredentials: true }
    )
    .then((res) => {
      setVehicleTypes((prev) => [...prev, res.data]);
      showToastNotification("Vehicle Type Added", `"${newVehicleType.trim()}" added to database.`);
      setNewVehicleType("");
    })
    .catch((err) => {
      console.error("Error adding vehicle type:", err);
      alert(err.response?.data?.message || "Failed to add vehicle type.");
    });
  };

  // 2. DELETE VEHICLE TYPE
  const handleDeleteVehicleType = (id, label) => {
    axios.delete(`https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/visitorConfigs/vehicleTypes/${id}`, { withCredentials: true })
      .then(() => {
        setVehicleTypes((prev) => prev.filter((item) => item.vehicleTypeId !== id));
        showToastNotification("Vehicle Type Removed", `"${label}" deleted.`);
      })
      .catch((err) => {
        console.error("Error deleting vehicle type:", err);
        alert(err.response?.data?.message || "Failed to delete vehicle type.");
      });
  };

  // 3. ADD MEMBER COUNT OPTION
  const handleAddMemberCount = (e) => {
    e.preventDefault();
    if (!newMemberCount.trim()) return;

    axios.post('https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/visitorConfigs/memberCounts', 
      { memberCount: newMemberCount.trim() },
      { withCredentials: true }
    )
    .then((res) => {
      setMemberCounts((prev) => [...prev, res.data]);
      showToastNotification("Member Count Added", `"${newMemberCount.trim()}" added to database.`);
      setNewMemberCount("");
    })
    .catch((err) => {
      console.error("Error adding member count:", err);
      alert(err.response?.data?.message || "Failed to add member count option.");
    });
  };

  // 4. DELETE MEMBER COUNT OPTION
  const handleDeleteMemberCount = (id, label) => {
    axios.delete(`https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/admin/visitorConfigs/memberCounts/${id}`, { withCredentials: true })
      .then(() => {
        setMemberCounts((prev) => prev.filter((item) => item.memberCountId !== id));
        showToastNotification("Option Removed", `"${label}" deleted.`);
      })
      .catch((err) => {
        console.error("Error deleting member count:", err);
        alert(err.response?.data?.message || "Failed to delete member count option.");
      });
  };

  return (
    <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
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

      {/* Top Header */}
      <div className='h-24 border-b border-slate-200 flex items-center px-8'>
        <Sliders className='mr-4 text-slate-700' />
        <div>
          <h2 className='font-mono text-xl font-bold text-slate-900'>Form Configurations</h2>
          <h4 className='font-spacegrotesk text-sm text-slate-500'>Configure database dropdown options for visitor check-in forms</h4>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* VEHICLE TYPES CARD */}
        <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
          <div className="flex items-center gap-2.5 mb-2">
            <Car className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Vehicle Types</h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">Database records for vehicle type selection dropdown.</p>

          <form onSubmit={handleAddVehicleType} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newVehicleType}
              onChange={(e) => setNewVehicleType(e.target.value)}
              placeholder="e.g. 2-Wheeler, Electric Scooter"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm bg-white"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </form>

          {/* DYNAMIC TAGS FROM DATABASE */}
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.map((item) => (
              <span 
                key={item.vehicleTypeId} 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-sm"
              >
                {item.vehicleType}
                <button 
                  type="button" 
                  onClick={() => handleDeleteVehicleType(item.vehicleTypeId, item.vehicleType)}
                  className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* MEMBER COUNT OPTIONS CARD */}
        <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
          <div className="flex items-center gap-2.5 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Additional Member Count Options</h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">Database records for accompanying visitor count dropdown.</p>

          <form onSubmit={handleAddMemberCount} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newMemberCount}
              onChange={(e) => setNewMemberCount(e.target.value)}
              placeholder="e.g. 0, 1, 2, 5+"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm bg-white"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </form>

          {/* DYNAMIC TAGS FROM DATABASE */}
          <div className="flex flex-wrap gap-2">
            {memberCounts.map((item) => (
              <span 
                key={item.memberCountId} 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-sm"
              >
                {item.memberCount}
                <button 
                  type="button" 
                  onClick={() => handleDeleteMemberCount(item.memberCountId, item.memberCount)}
                  className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}