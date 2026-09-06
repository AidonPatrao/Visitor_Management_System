import React from 'react'
import { UserRoundSearch } from 'lucide-react'
import axios from 'axios'

const AdminNavbar = ({ setUser }) => {

  const handleLogout = async () => {
    try {
      await axios.post(
        'https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/auth/logout',
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // 1. Clear local user state
      if (setUser) setUser(null);
      localStorage.clear();
      sessionStorage.clear();

      // 2. Hard redirect to login page (clears all React state in memory)
      window.location.href = '/login';
    }
  };

  return (
   <>
    <nav className='w-auto p-5 bg-white border-b border-b-slate-300 '>
       {/* <label className='flex  bg-slate-200 h-12 rounded-xl w-9/12'>
        <UserRoundSearch size={24}  className='mt-3 ml-2 mb-3 text-slate-600'/>
         <input id='all-search' name='allSearch' type="text" placeholder='Search Departments,Employees,Projects' className='pl-3 bg-slate-100 m-3 placeholder-slate-500 flex-1 font-spacegrotesk rounded-lg' />
       </label> */}
       <button 
         type="button"
         onClick={handleLogout}
         className='bg-red-300 p-3 ml-auto rounded-2xl w-56 text-slate-600 hover:text-red-300 hover:bg-slate-600 font-spacegrotesk cursor-pointer'
       >
         Log-Out
       </button>
    </nav>
   </>
  )
}

export default AdminNavbar