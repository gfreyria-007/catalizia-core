
import React, { useState, useEffect } from 'react';
import { UserRecord, listenToUsers, approveUser, banUser } from '../services/userService';
import { Language } from '../types';

interface AdminDashboardProps {
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'banned'>('all');

  useEffect(() => {
    const unsubscribe = listenToUsers((data) => {
      setUsers(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(u => filter === 'all' || u.status === filter);

  const t = {
    es: {
      title: "Panel de Administración",
      pending: "Pendientes",
      approved: "Aprobados",
      banned: "Baneados",
      all: "Todos",
      name: "Nombre",
      email: "Email",
      status: "Estado",
      reason: "Motivo",
      actions: "Acciones",
      approve: "Aprobar",
      ban: "Banear",
      noUsers: "No hay usuarios en esta categoría.",
      manualAdd: "Agregar Usuario Manualmente",
      stats: "Estadísticas de Acceso"
    },
    en: {
      title: "Admin Dashboard",
      pending: "Pending",
      approved: "Approved",
      banned: "Banned",
      all: "All",
      name: "Name",
      email: "Email",
      status: "Status",
      reason: "Reason",
      actions: "Actions",
      approve: "Approve",
      ban: "Ban",
      noUsers: "No users in this category.",
      manualAdd: "Add User Manually",
      stats: "Access Statistics"
    }
  }[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-1">ScholarSeek User Management System</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(['all', 'pending', 'approved', 'banned'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === f ? 'bg-white text-academic-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t[f as keyof typeof t] as string}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t.name}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t.email}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t.status}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t.reason}</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full mr-3 border border-gray-200" src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="" />
                      <div className="text-sm font-bold text-gray-900">{user.displayName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      user.status === 'approved' ? 'bg-green-100 text-green-700' :
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-700 animate-pulse' :
                      user.status === 'banned' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {t[user.status as keyof typeof t] as string || user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {user.reason || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center gap-2">
                       {user.status !== 'approved' && (
                         <button 
                            onClick={() => approveUser(user.uid)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-[10px] font-bold hover:bg-green-700 transition-colors"
                         >
                           {t.approve}
                         </button>
                       )}
                       {user.status !== 'banned' && (
                         <button 
                            onClick={() => banUser(user.uid)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-[10px] font-bold hover:bg-red-700 transition-colors"
                         >
                           {t.ban}
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">
                    {t.noUsers}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
