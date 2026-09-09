import React, { useState } from 'react';
import { FiUsers, FiPlus, FiX } from 'react-icons/fi';

export default function Collaborations() {
  const [showModal, setShowModal] = useState(false);
  const types = [
    { title: 'Mentorship Program', desc: 'Mentor students or academicians on industry standards.' },
    { title: 'Research Partnership', desc: 'Collaborate with institutions on cutting-edge research.' },
    { title: 'Guest Lecture', desc: 'Deliver a guest lecture on your domain expertise.' }
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Collaborations</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary-dark transition">
          <FiPlus /> Post Collaboration
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {types.map((t, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-3">
              <FiUsers size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{t.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{t.desc}</p>
            <button className="text-sm text-primary font-medium hover:underline">Explore →</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">New Collaboration</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">API integration coming soon.</p>
            <button onClick={() => setShowModal(false)} className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
