import React, { useEffect, useState } from 'react';
import {
  FiEdit2, FiSave, FiPlus, FiTrash2, FiGithub,
  FiLinkedin, FiGlobe, FiShare2, FiCheck
} from 'react-icons/fi';
import { studentAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

function EditableList({ title, items, setItems, editMode, placeholder }) {
  const add = () => setItems([...items, { title: '', description: '', link: '' }]);
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i, field, val) => setItems(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        {editMode && (
          <button onClick={add} className="text-xs text-primary flex items-center gap-1 border border-primary px-3 py-1 rounded-lg hover:bg-indigo-50 transition">
            <FiPlus /> Add
          </button>
        )}
      </div>
      {items.length === 0 && !editMode && <p className="text-sm text-gray-400">Nothing added yet.</p>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className={`${editMode ? 'bg-gray-50 rounded-xl p-4 space-y-2' : 'border-l-4 border-indigo-200 pl-4 py-1'}`}>
            {editMode ? (
              <>
                <div className="flex items-center gap-2">
                  <input value={item.title || ''} onChange={(e) => update(i, 'title', e.target.value)}
                    placeholder={`${placeholder} title`}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
                  <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-2"><FiTrash2 /></button>
                </div>
                <textarea value={item.description || ''} onChange={(e) => update(i, 'description', e.target.value)}
                  placeholder="Description" rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
                <input value={item.link || ''} onChange={(e) => update(i, 'link', e.target.value)}
                  placeholder="Link (optional)" type="url"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{item.link}</a>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [portfolio, setPortfolio] = useState({
    headline: '', about: '', github: '', linkedin: '', website: '',
    projects: [], certifications: [], achievements: [],
  });

  useEffect(() => {
    studentAPI.getPortfolio()
      .then((res) => setPortfolio({ ...portfolio, ...(res.data || {}) }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await studentAPI.updatePortfolio(portfolio);
      setEditMode(false);
    } catch {}
    finally { setSaving(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/portfolio/${user?._id || user?.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';

  if (loading) return <LoadingSpinner text="Loading portfolio..." />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">My Portfolio</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition">
            {copied ? <><FiCheck className="text-green-500" /> Copied!</> : <><FiShare2 /> Share</>}
          </button>
          {editMode ? (
            <button onClick={handleSave} disabled={saving}
              className="text-sm bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark disabled:opacity-60 transition">
              <FiSave /> {saving ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button onClick={() => setEditMode(true)}
              className="text-sm border border-primary text-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-50 transition">
              <FiEdit2 /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            {editMode ? (
              <input value={portfolio.headline || ''} onChange={(e) => setPortfolio({ ...portfolio, headline: e.target.value })}
                placeholder="Your headline (e.g. Full Stack Developer | ML Enthusiast)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary mt-1" />
            ) : (
              <p className="text-gray-500 text-sm">{portfolio.headline || 'Add a headline...'}</p>
            )}
          </div>
        </div>

        {editMode ? (
          <textarea value={portfolio.about || ''} onChange={(e) => setPortfolio({ ...portfolio, about: e.target.value })}
            placeholder="About me..." rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed">{portfolio.about || 'No bio added yet.'}</p>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3 mt-4">
          {editMode ? (
            <>
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <FiGithub className="text-gray-500 flex-shrink-0" />
                <input value={portfolio.github || ''} onChange={(e) => setPortfolio({ ...portfolio, github: e.target.value })}
                  placeholder="GitHub URL" type="url"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <FiLinkedin className="text-blue-600 flex-shrink-0" />
                <input value={portfolio.linkedin || ''} onChange={(e) => setPortfolio({ ...portfolio, linkedin: e.target.value })}
                  placeholder="LinkedIn URL" type="url"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <FiGlobe className="text-green-600 flex-shrink-0" />
                <input value={portfolio.website || ''} onChange={(e) => setPortfolio({ ...portfolio, website: e.target.value })}
                  placeholder="Website URL" type="url"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </>
          ) : (
            <>
              {portfolio.github && <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition"><FiGithub /> GitHub</a>}
              {portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition"><FiLinkedin /> LinkedIn</a>}
              {portfolio.website && <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 transition"><FiGlobe /> Website</a>}
            </>
          )}
        </div>
      </div>

      <EditableList title="Projects" items={portfolio.projects || []} setItems={(v) => setPortfolio({ ...portfolio, projects: v })} editMode={editMode} placeholder="Project" />
      <EditableList title="Certifications" items={portfolio.certifications || []} setItems={(v) => setPortfolio({ ...portfolio, certifications: v })} editMode={editMode} placeholder="Certification" />
      <EditableList title="Achievements" items={portfolio.achievements || []} setItems={(v) => setPortfolio({ ...portfolio, achievements: v })} editMode={editMode} placeholder="Achievement" />
    </div>
  );
}
