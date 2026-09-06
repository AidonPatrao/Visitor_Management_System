import React from 'react';
import AdminNavbar from './AdminNavbar';
import { DepartmentsData } from './DepartmentsData';
import { ProjectsData } from './ProjectsData'
import { EmployeesData } from './EmployeesData'
import {OperatorsData} from './OperatorsData'
import {VisitorConfigsData} from './VisitorConfigsData'

export const AdminDashboard = () => {
  return (
    // 1. Full-viewport canvas with background color
    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* 2. Top Navigation Bar */}
      <AdminNavbar />

      {/* 3. Centered main container with padding below the navbar */}
      <main className="mx-auto mt-5 max-w-7xl px-4 py-8">
        {/* Outer container only handles vertical spacing */}
        <div className="flex flex-col gap-y-6">

          {/* Card 1: Departments */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <DepartmentsData />
          </div>

          {/* Card 2: Projects */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <ProjectsData />
          </div>

          {/* Card 3: Employees */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <EmployeesData />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <OperatorsData />
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <VisitorConfigsData />
          </div>


        </div>
      </main>

    </div>
  );
};

