import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiEdit2, FiSave, FiPlus, FiTrash2, FiGithub,
  FiLinkedin, FiGlobe, FiShare2, FiCheck, FiExternalLink,
  FiCamera, FiImage, FiX
} from 'react-icons/fi';
import { studentAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
const MAX_SIZE_MB = 2;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      reject(new Error(`Image must be under ${MAX_SIZE_MB}MB`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ── Image Upload Button ─────────────────────────────────────────────────────── */
function ImageUpload({ value, onChange, className = '', label = 'Upload Image', small = false }) {
  const inputRef = useRef();
  const [err, setErr] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErr('');
    try {
      const b64 = await fileToBase64(file);
      onChange(b64);
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFile} />
      {value ? (
        <div className="relative group">
          <img src={value} alt="upload" className={`object-cover rounded-xl border border-white/10 ${small ? 'w-24 h-24' : 'w-full h-36'}`} />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
          >
            <FiX size={11} />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition text-xs text-white gap-1"
          >
            <FiCamera size={13} /> Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className={`flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-xl text-gray-500 hover:border-indigo-500/40 hover:text-indigo-400 transition ${small ? 'w-24 h-24 flex-col text-xs' : 'w-full h-20 text-sm'}`}
        >
          <FiImage size={small ? 18 : 16} />
          {!small && <span>{label}</span>}
          {small && <span className="text-center leading-tight">Add Photo</span>}
        </button>
      )}
      {err && <p className="text-xs text-red-400 mt-1">{err}</p>}
    </div>
  );
}

/* ── Editable List Section ────────────────────────────────────────────────────── */
function EditableList({ title, items, setItems, editMode, placeholder, linkLabel = 'Link', showImage = true }) {
  const add = () => setItems([...items, { title: '', description: '', link: '', image: '' }]);
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i, field, val) => setItems(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white">{title}</h2>
        {editMode && (
          <button
            onClick={add}
            className="text-xs text-indigo-400 flex items-center gap-1 border border-indigo-500/30 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition"
          >
            <FiPlus /> Add
          </button>
        )}
      </div>

      {items.length === 0 && !editMode && (
        <p className="text-sm text-gray-600">Nothing added yet.</p>
      )}

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className={editMode ? 'bg-white/[0.03] rounded-xl p-4 space-y-3 border border-white/[0.06]' : 'border-l-2 border-indigo-500/30 pl-4 py-1'}>
            {editMode ? (
              <>
                <div className="flex items-start gap-3">
                  {showImage && (
                    <ImageUpload
                      value={item.image || ''}
                      onChange={(v) => update(i, 'image', v)}
                      small
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={item.title || item.name || ''}
                        onChange={(e) => update(i, item.name !== undefined ? 'name' : 'title', e.target.value)}
                        placeholder={`${placeholder} title`}
                        className="flex-1 bg-dark-50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                      />
                      <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 p-2 flex-shrink-0 transition">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => update(i, 'description', e.target.value)}
                      placeholder="Description"
                      rows={2}
                      className="w-full bg-dark-50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition resize-none"
                    />
                    <input
                      value={item.link || item.credentialUrl || ''}
                      onChange={(e) => update(i, item.credentialUrl !== undefined ? 'credentialUrl' : 'link', e.target.value)}
                      placeholder={linkLabel + ' (optional)'}
                      type="url"
                      className="w-full bg-dark-50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex gap-4">
                {item.image && (
                  <img src={item.image} alt={item.title || item.name} className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-200">{item.title || item.name}</p>
                  {item.description && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>}
                  {(item.link || item.credentialUrl) && (
                    <a
                      href={item.link || item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1 transition"
                    >
                      <FiExternalLink size={10} /> View
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Portfolio Component ─────────────────────────────────────────────────── */
export default function Portfolio() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [portfolio, setPortfolio] = useState({
    headline: '', about: '', github: '', linkedin: '', website: '',
    avatar: '',
    projects: [], certifications: [], achievements: [],
  });

  useEffect(() => {
    studentAPI.getPortfolio()
      .then((res) => {
        const data = res.data || {};
        setPortfolio(prev => ({ ...prev, ...data }));
      })
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
    const uid = user?._id || user?.id;
    navigator.clipboard.writeText(`${window.location.origin}/portfolio/${uid}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';

  if (loading) return <LoadingSpinner text="Loading portfolio..." />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">My Portfolio</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="text-sm border border-white/10 text-gray-400 px-4 py-2 rounded-xl hover:bg-white/[0.04] hover:text-gray-200 flex items-center gap-2 transition"
          >
            {copied ? <><FiCheck className="text-emerald-400" /> Copied!</> : <><FiShare2 /> Share Link</>}
          </button>
          {editMode ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-glow-md disabled:opacity-60 transition"
            >
              <FiSave /> {saving ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="text-sm border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-500/10 transition"
            >
              <FiEdit2 /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Profile card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start gap-5 mb-5">
          {/* Avatar */}
          {editMode ? (
            <div className="flex-shrink-0">
              <ImageUpload
                value={portfolio.avatar || ''}
                onChange={(v) => setPortfolio(prev => ({ ...prev, avatar: v }))}
                small
                label="Photo"
              />
              <p className="text-xs text-gray-600 mt-1 text-center">Profile Photo</p>
            </div>
          ) : (
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-glow-sm overflow-hidden">
              {portfolio.avatar ? (
                <img src={portfolio.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            {editMode ? (
              <input
                value={portfolio.headline || ''}
                onChange={(e) => setPortfolio(prev => ({ ...prev, headline: e.target.value }))}
                placeholder="Your headline (e.g. Full Stack Developer | ML Enthusiast)"
                className="w-full mt-1.5 bg-dark-50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
              />
            ) : (
              <p className="text-gray-400 text-sm mt-0.5">{portfolio.headline || 'Add your headline...'}</p>
            )}
            <p className="text-xs text-indigo-400 mt-1">{user?.email}</p>
          </div>
        </div>

        {/* About */}
        {editMode ? (
          <textarea
            value={portfolio.about || ''}
            onChange={(e) => setPortfolio(prev => ({ ...prev, about: e.target.value }))}
            placeholder="Tell recruiters about yourself..."
            rows={3}
            className="w-full bg-dark-50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition resize-none"
          />
        ) : (
          <p className="text-sm text-gray-400 leading-relaxed">
            {portfolio.about || 'No bio added yet.'}
          </p>
        )}

        {/* Social Links */}
        <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-white/[0.06]">
          {editMode ? (
            <>
              {[
                { icon: FiGithub, key: 'github', placeholder: 'GitHub URL', color: 'text-gray-400' },
                { icon: FiLinkedin, key: 'linkedin', placeholder: 'LinkedIn URL', color: 'text-blue-400' },
                { icon: FiGlobe, key: 'website', placeholder: 'Website URL', color: 'text-emerald-400' },
              ].map(({ icon: Icon, key, placeholder, color }) => (
                <div key={key} className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Icon className={`${color} flex-shrink-0`} />
                  <input
                    value={portfolio[key] || ''}
                    onChange={(e) => setPortfolio(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    type="url"
                    className="flex-1 bg-dark-50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {portfolio.github && <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition"><FiGithub /> GitHub</a>}
              {portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-400 transition"><FiLinkedin /> LinkedIn</a>}
              {portfolio.website && <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition"><FiGlobe /> Website</a>}
              {!portfolio.github && !portfolio.linkedin && !portfolio.website && !editMode && (
                <p className="text-xs text-gray-600">No social links added yet.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Portfolio sections */}
      <EditableList
        title="Projects"
        items={portfolio.projects || []}
        setItems={(v) => setPortfolio(prev => ({ ...prev, projects: v }))}
        editMode={editMode}
        placeholder="Project"
        linkLabel="Project / Demo URL"
      />
      <EditableList
        title="Certifications"
        items={portfolio.certifications || []}
        setItems={(v) => setPortfolio(prev => ({ ...prev, certifications: v }))}
        editMode={editMode}
        placeholder="Certification"
        linkLabel="Credential / Verify URL"
      />
      <EditableList
        title="Achievements"
        items={portfolio.achievements || []}
        setItems={(v) => setPortfolio(prev => ({ ...prev, achievements: v }))}
        editMode={editMode}
        placeholder="Achievement"
        linkLabel="Related URL"
      />

      {/* Public link hint */}
      {!editMode && (
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-3 border border-indigo-500/10">
          <div>
            <p className="text-sm font-medium text-gray-300">Public Portfolio</p>
            <p className="text-xs text-gray-500 mt-0.5">Share this with recruiters — no login required.</p>
          </div>
          <button
            onClick={handleShare}
            className="text-sm border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-xl hover:bg-indigo-500/10 flex items-center gap-2 transition flex-shrink-0"
          >
            <FiShare2 /> {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}
