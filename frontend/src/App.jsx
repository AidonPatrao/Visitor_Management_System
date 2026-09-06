import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginForm } from './components/loginForm'
import { AdminDashboard } from './components/AdminDashboard'
import { OperatorDashboard } from './components/OperatorDashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import { cn } from "@/lib/utils"

export default function App() {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  // Sync user state changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT DIRECT REDIRECT */}
        <Route 
          path="/" 
          element={
            <Navigate 
              to={user ? (user.role === 'ADMIN' ? '/admin' : '/operator') : '/login'} 
              replace 
            />
          } 
        />

        {/* PUBLIC LOGIN ROUTE */}
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to={user.role === 'ADMIN' ? '/admin' : '/operator'} replace />
            ) : (
              <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-[#064f5ed8] px-4 py-10 text-slate-100 sm:px-6">
                
                {/* Header Title Section */}
                <div className="relative z-10 mb-12 text-center sm:mb-16">
                  <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.32em] text-sky-300/80">
                    Secure visitor access
                  </p>
                  <h1 className="font-spacegrotesk text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                    Visitor Management System
                  </h1>
                </div>

                {/* Grid Background Pattern */}
                <div
                  className={cn(
                    "absolute inset-0",
                    "[background-size:72px_72px]",
                    "[background-image:linear-gradient(to_right,rgba(125,211,252,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,211,252,0.09)_1px,transparent_1px)]"
                  )} 
                />

                {/* Radial Gradient Glows */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,116,144,0.28),transparent_38%),radial-gradient(circle_at_10%_100%,rgba(30,64,175,0.22),transparent_36%)]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07111f]/20 via-transparent to-[#07111f]/70" />

                {/* Login Form Component */}
                <LoginForm className="relative z-10 w-full max-w-md" user={user} setUser={setUser} />
                
              </div>
            )
          } 
        />

        {/* PROTECTED ROUTE: ADMIN DASHBOARD */}
        <Route element={<ProtectedRoute user={user} allowedRoles={['ADMIN']} />}>
          <Route path="/admin/*" element={<AdminDashboard className="bg-black" user={user} setUser={setUser} />} />
        </Route>

        {/* PROTECTED ROUTE: OPERATOR DASHBOARD */}
        <Route element={<ProtectedRoute user={user} allowedRoles={['OPERATOR', 'ADMIN']} />}>
          <Route path="/operator/*" element={<OperatorDashboard className="bg-yellow" user={user} setUser={setUser} />} />
        </Route>

        {/* FALLBACK / DEFAULT REDIRECT */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={user ? (user.role === 'ADMIN' ? '/admin' : '/operator') : '/login'} 
              replace 
            />
          } 
        />

      </Routes>
    </BrowserRouter>
  )
}