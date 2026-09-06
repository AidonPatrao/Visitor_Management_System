import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { uploadVisitorPhoto } from "@/services/imagekit";

export function OperatorDashboard({ className, user, setUser }) {
  // Active Dropdown States fetched from backend
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [memberCounts, setMemberCounts] = useState([]);

  // Camera & Photo States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    visitorName: "",
    phone: "",
    email: "",
    address: "",
    company: "",
    visitingReason: "",
    departmentId: "",
    projectId: "",
    employeeId: "",
    vehicleType: "",
    vehicleNumber: "",
    additionalMembersCount: "",
    additionalMembersNames: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successVisitor, setSuccessVisitor] = useState(null);

  // LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      if (setUser) setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  // Safe individual fetcher helper to prevent one failing request from breaking others
  useEffect(() => {
    const fetchConfigs = async () => {
      const getReq = (url) =>
        axios.get(url, { withCredentials: true }).catch((err) => {
          console.error(`Failed loading ${url}:`, err);
          return { data: {} };
        });

      const [deptRes, projRes, empRes, vehRes, memRes] = await Promise.all([
        getReq("http://localhost:3000/api/visitors/departments"),
        getReq("http://localhost:3000/api/visitors/projects"),
        getReq("http://localhost:3000/api/visitors/employees"),
        getReq("http://localhost:3000/api/visitors/vehicle-types"),
        getReq("http://localhost:3000/api/visitors/member-counts"),
      ]);

      setDepartments(deptRes.data.departments || []);
      setProjects(projRes.data.projects || []);
      setEmployees(empRes.data.employees || []);
      setVehicleTypes(vehRes.data.vehicleTypes || []);
      setMemberCounts(memRes.data.memberCounts || []);
    };

    fetchConfigs();
  }, []);

  // Cleanup webcam stream on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // CAMERA LOGIC
  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setErrorMsg("Unable to access webcam. Please check browser permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1. Upload photo to ImageKit service
      let photoUrl = "https://via.placeholder.com/150";
      if (capturedPhoto) {
        photoUrl = await uploadVisitorPhoto(capturedPhoto);
      }

      // 2. Submit Visitor Record
      const response = await axios.post(
        "http://localhost:3000/api/visitors",
        {
          ...formData,
          photoUrl,
          createdBy: user?.email || "operator@invenger.com",
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccessVisitor({
          ...response.data.visitor,
          localCapturedPhoto: capturedPhoto || photoUrl,
        });

        // Reset form
        setFormData({
          visitorName: "",
          phone: "",
          email: "",
          address: "",
          company: "",
          visitingReason: "",
          departmentId: "",
          projectId: "",
          employeeId: "",
          vehicleType: "",
          vehicleNumber: "",
          additionalMembersCount: "",
          additionalMembersNames: "",
        });
        setCapturedPhoto(null);
      }
    } catch (err) {
      console.error("Error creating visitor record:", err);
      setErrorMsg(err.response?.data?.message || "Failed to create visitor entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen w-full bg-orange-50 text-slate-100 p-6 md:p-12 relative", )}>
      {/* Hidden canvas for drawing video frame */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.32em] text-sky-500">
              Operator Console
            </p>
            <h1 className="font-spacegrotesk text-3xl font-bold text-sky-600 sm:text-4xl">
              New Visitor Registration
            </h1>
          </div>

          {/* LOGOUT BUTTON */}
          <button 
            type="button"
            onClick={handleLogout}
            className="bg-red-300 p-3 rounded-2xl w-56 text-slate-600 hover:text-red-300 hover:bg-slate-600 font-spacegrotesk cursor-pointer transition-colors"
          >
            Log-Out
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 text-center font-mono">
            {errorMsg}
          </div>
        )}

        {/* Form Container */}
        <Card className="w-full rounded-3xl border border-sky-300/15 bg-slate-500 shadow-2xl shadow-sky-950/40 backdrop-blur-sm p-2">
          <CardHeader>
            <CardTitle className="font-mono text-xl text-orange-100">Visitor Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* CAMERA CAPTURE SECTION */}
              <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center space-y-4">
                <FieldLabel className="font-jakarta text-white text-sm font-semibold">Visitor Photo Capture</FieldLabel>
                
                <div className="w-64 h-48 bg-slate-950 border-2 border-dashed border-slate-700 rounded-xl overflow-hidden flex items-center justify-center relative">
                  {capturedPhoto ? (
                    <img src={capturedPhoto} alt="Captured Visitor" className="w-full h-full object-cover" />
                  ) : isCameraOpen ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400">No Photo Captured</span>
                  )}
                </div>

                <div className="flex gap-3">
                  {!isCameraOpen && !capturedPhoto && (
                    <Button type="button" onClick={startCamera} className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-lg cursor-pointer">
                       Open Camera
                    </Button>
                  )}

                  {isCameraOpen && (
                    <>
                      <Button type="button" onClick={capturePhoto} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-lg cursor-pointer">
                         Snap Photo
                      </Button>
                      <Button type="button" onClick={stopCamera} className="bg-red-500/80 hover:bg-red-500 text-white font-bold text-xs py-2 px-4 rounded-lg cursor-pointer">
                        Cancel
                      </Button>
                    </>
                  )}

                  {capturedPhoto && (
                    <Button type="button" onClick={retakePhoto} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-lg cursor-pointer">
                       Retake Photo
                    </Button>
                  )}
                </div>
              </div>

              {/* Core Visitor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FieldLabel htmlFor="visitorName" className="font-jakarta text-white">Visitor Name *</FieldLabel>
                  <Input
                    id="visitorName"
                    name="visitorName"
                    value={formData.visitorName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-500 p-4 mt-1"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="phone" className="font-jakarta text-white">Phone Number *</FieldLabel>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="9876543210"
                    className="border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-500 p-4 mt-1"
                  />
                </div>
              </div>

              {/* Email, Address & Company */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <FieldLabel htmlFor="email" className="font-jakarta text-white">Email Address</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="visitor@company.com"
                    className="border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-500 p-4 mt-1"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="address" className="font-jakarta text-white">Address</FieldLabel>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Bengaluru"
                    className="border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-500 p-4 mt-1"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="company" className="font-jakarta text-white">Company / Firm</FieldLabel>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="ABC Solutions"
                    className="border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-500 p-4 mt-1"
                  />
                </div>
              </div>

              {/* Dynamic Relations: Department, Project, Employee */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Department */}
            <div>
  <FieldLabel htmlFor="departmentId" className="font-jakarta text-white">Department *</FieldLabel>
  <select
    id="departmentId"
    name="departmentId"
    value={formData.departmentId}
    onChange={handleChange}
    required
    className="w-full mt-1 bg-slate-900/70 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-400"
  >
    <option value="">Select Department</option>
    {departments.map((d) => {
      const isMaintenance = d.departmentName?.toLowerCase() === 'maintenance';
      return (
        <option 
          key={d.departmentId} 
          value={d.departmentId} 
          className={
            isMaintenance 
              ? "bg-amber-400 text-slate-950 font-semibold" 
              : "bg-slate-900 text-white"
          }
        >
          {d.departmentName}
        </option>
      );
    })}
  </select>
</div>

                {/* Project */}
               <div>
                  <FieldLabel htmlFor="projectId" className="font-jakarta text-white">Project *</FieldLabel>
                  <select
                    id="projectId"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    required
                    className={`w-full mt-1 border rounded-xl p-3 focus:outline-none ${
                      projects.find((p) => String(p.projectId) === String(formData.projectId))?.projectName?.toLowerCase() === "none"
                        ? "bg-amber-400 text-slate-950 border-amber-500 focus:border-amber-600 font-semibold"
                        : "bg-slate-900/70 border-slate-700 text-slate-100 focus:border-sky-400"
                    }`}
                  >
                    <option value="" className="bg-slate-900 text-white">Select Project</option>
                    {projects.map((p) => (
                      <option 
                        key={p.projectId} 
                        value={p.projectId} 
                        className={p.projectName?.toLowerCase() === "none" ? "bg-amber-400 text-slate-950 font-semibold" : "bg-slate-900 text-white"}
                      >
                        {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employee */}
             <div>
                  <FieldLabel htmlFor="employeeId" className="font-jakarta text-white">Visiting Employee *</FieldLabel>
                  <select
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                    className={`w-full mt-1 border rounded-xl p-3 focus:outline-none ${
                      ["n/a", "na", "none"].includes(
                        employees.find((e) => String(e.employeeId) === String(formData.employeeId))?.employeeName?.trim().toLowerCase() || ""
                      )
                        ? "bg-amber-400 text-slate-950 border-amber-500 focus:border-amber-600 font-semibold"
                        : "bg-slate-900/70 border-slate-700 text-slate-100 focus:border-sky-400"
                    }`}
                  >
                    <option value="" className="bg-slate-900 text-white">Select Employee</option>
                    {employees.map((e) => {
                      const isNA = ["n/a", "na", "none"].includes(e.employeeName?.trim().toLowerCase());
                      return (
                        <option 
                          key={e.employeeId} 
                          value={e.employeeId} 
                          className={isNA ? "bg-amber-400 text-slate-950 font-semibold" : "bg-slate-900 text-white"}
                        >
                          {e.employeeName}
                        </option>
                      );
                    })}
                  </select>
                </div>

              </div>

              {/* Visiting Reason & Vehicle Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <FieldLabel htmlFor="visitingReason" className="font-jakarta text-white">Visiting Reason</FieldLabel>
                  <Input
                    id="visitingReason"
                    name="visitingReason"
                    value={formData.visitingReason}
                    onChange={handleChange}
                    placeholder="Discussion regarding project"
                    className="border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-500 p-4 mt-1"
                  />
                </div>

                {/* Vehicle Type Dropdown */}
                <div>
                  <FieldLabel htmlFor="vehicleType" className="font-jakarta text-white">Vehicle Type</FieldLabel>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full mt-1 bg-slate-900/70 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-400"
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map((v) => (
                      <option key={v.vehicleTypeId} value={v.vehicleType} className="bg-slate-900 text-white">
                        {v.vehicleType}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="vehicleNumber" className="font-jakarta text-white">Vehicle Number</FieldLabel>
                  <Input
                    id="vehicleNumber"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="KA-19-AB-1234"
                    className="border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-500 p-4 mt-1"
                  />
                </div>
              </div>

              {/* Additional Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Member Counts Dropdown */}
                <div>
                  <FieldLabel htmlFor="additionalMembersCount" className="font-jakarta text-white">Additional Members</FieldLabel>
                  <select
                    id="additionalMembersCount"
                    name="additionalMembersCount"
                    value={formData.additionalMembersCount}
                    onChange={handleChange}
                    className="w-full mt-1 bg-slate-900/70 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-400"
                  >
                    <option value="">0 (None)</option>
                    {memberCounts.map((m) => (
                      <option key={m.memberCountId} value={m.memberCount} className="bg-slate-900 text-white">
                        {m.memberCount}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="additionalMembersNames" className="font-jakarta text-white">Additional Member Names</FieldLabel>
                  <Input
                    id="additionalMembersNames"
                    name="additionalMembersNames"
                    value={formData.additionalMembersNames}
                    onChange={handleChange}
                    placeholder="e.g. Jane Doe, Bob Smith"
                    className="border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-500 p-4 mt-1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-4 rounded-xl cursor-pointer"
                >
                  {loading ? "Creating Entry..." : "Submit & Generate Visitor Pass"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

        {/* Printable Badge Preview Modal */}
        {successVisitor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-sky-300/30 rounded-2xl p-6 max-w-lg w-full flex flex-col items-center">
              <h3 className="text-xl font-bold font-mono text-sky-300 mb-4">Visitor Entry Created!</h3>
              
              {/* Badge Printable Target */}
              <div id="printable-card" className="w-[380px] bg-white text-black p-6 border-2 border-slate-900 rounded-lg font-serif shadow-xl">
                <div className="text-center pb-2 border-b border-black">
                  <h2 className="text-2xl font-bold font-sans tracking-tight">Invenger</h2>
                  <p className="text-[10px] text-slate-800">WareHouse Rd, Ballalbagh, Mangaluru, Karnataka - 575 003</p>
                  <h3 className="text-base font-bold uppercase mt-1">VISITOR'S PASS</h3>
                </div>

                <div className="flex justify-between items-start my-3 gap-2 text-xs">
                  <div className="w-20 h-24 bg-slate-200 border border-slate-400 overflow-hidden shrink-0 flex items-center justify-center text-[10px] text-slate-500">
                    {successVisitor.localCapturedPhoto || successVisitor.photoUrl ? (
                      <img src={successVisitor.localCapturedPhoto || successVisitor.photoUrl} alt="Visitor Pass" className="w-full h-full object-cover" />
                    ) : (
                      "PHOTO"
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between"><span className="font-sans">No:</span><span className="font-bold">{successVisitor.visitorId}</span></div>
                    <div className="flex justify-between"><span className="font-sans">Date:</span><span className="font-bold">{new Date().toLocaleDateString('en-GB')}</span></div>
                    <div className="flex justify-between"><span className="font-sans">In Time:</span><span className="font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                  </div>
                </div>

                <div className="text-xs space-y-1 border-t border-b border-black py-2 my-2">
                  <div className="grid grid-cols-[90px_1fr]"><span className="font-sans">Name:</span><span className="font-bold uppercase">{successVisitor.visitorName}</span></div>
                  <div className="grid grid-cols-[90px_1fr]"><span className="font-sans">Company:</span><span className="font-bold uppercase">{successVisitor.company || "N/A"}</span></div>
                  <div className="grid grid-cols-[90px_1fr]"><span className="font-sans">Mobile:</span><span className="font-bold">{successVisitor.phone}</span></div>
                  <div className="grid grid-cols-[90px_1fr]"><span className="font-sans">Dept:</span><span className="font-bold uppercase">{successVisitor.department?.departmentName || "N/A"}</span></div>
                  <div className="grid grid-cols-[90px_1fr]"><span className="font-sans">Reason:</span><span className="font-bold uppercase">{successVisitor.visitingReason || "OFFICIAL"}</span></div>
                  <div className="grid grid-cols-[90px_1fr]"><span className="font-sans">Add. Member (count):</span><span className="font-bold uppercase">{successVisitor.additionalMembersCount|| "0"}</span></div>
                  <div className="grid grid-cols-[90px_1fr]"><span className="font-sans">Add. Member names:</span><span className="font-bold uppercase">{successVisitor.additionalMembersNames|| "N/A"}</span></div>
                  <div className="grid grid-cols-[90px_1fr]"><span className="font-sans">Vehicle No:</span><span className="font-bold uppercase">{successVisitor.vehicleNumber|| "0"}</span></div>
                </div>

                <div className="grid grid-cols-3 text-center text-[9px] mt-6 pt-2">
                  <div className="border-t border-dashed border-black pt-1">Visitor's Signature</div>
                  <div className="border-t border-dashed border-black pt-1">Visiting To</div>
                  <div className="border-t border-dashed border-black pt-1">Issued by</div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => window.print()}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-2 rounded-xl cursor-pointer"
                >
                  Print Pass .
                </button>
                <button
                  onClick={() => setSuccessVisitor(null)}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-2 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}