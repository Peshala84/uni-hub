import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, Clock, FileText, Edit, Trash2, ChevronDown, Users, GraduationCap, Sparkles } from 'lucide-react';

// Move components outside to prevent recreation
const Modal = ({ title, children, size = "2xl", onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className={`bg-gradient-to-b from-[#132D46] to-[#191E29] rounded-2xl border border-[#01C38D]/20 w-full max-w-${size} max-h-[90vh] overflow-y-auto shadow-2xl shadow-[#01C38D]/10`}>
      <div className="p-6 border-b border-[#01C38D]/20 flex items-center justify-between bg-gradient-to-r from-[#01C38D]/5 to-transparent">
        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-[#01C38D] bg-clip-text text-transparent flex items-center">
          <Sparkles className="mr-2 text-[#01C38D]" size={20} />
          {title}
        </h3>
        <button onClick={onClose} className="p-2 rounded-xl bg-[#191E29]/50 border border-[#01C38D]/20 hover:border-[#01C38D]/60 text-[#696E79] hover:text-white transition-all duration-300">
          <X size={20} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const FormField = ({ label, children, required = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-white">
      {label} {required && <span className="text-[#01C38D]">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input 
    {...props} 
    className={`w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#01C38D]/20 rounded-xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 ${className}`} 
  />
);

const Button = ({ variant = "primary", children, className = "", ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-[#01C38D] to-[#01C38D]/80 hover:from-[#01C38D]/90 hover:to-[#01C38D]/70 text-white shadow-lg shadow-[#01C38D]/20",
    secondary: "bg-[#2A3441] hover:bg-[#2A3441]/80 text-white",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/20"
  };
  return (
    <button 
      {...props} 
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState(new Set());
  const [attachmentInput, setAttachmentInput] = useState('');

  const getDefaultDate = () => new Date().toISOString().slice(0, 10);
  const getDefaultTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState({
    topic: '', 
    description: '', 
    date: getDefaultDate(), 
    time: getDefaultTime(), 
    attachments: [], 
    type: 'student'
  });

  useEffect(() => { 
    fetchAnnouncements(); 
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setFetchLoading(true);
      setError('');
      const response = await fetch('http://localhost:8086/api/v1/admin/view_announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(Array.isArray(data) ? data : []);
      } else throw new Error('Failed to fetch announcements');
    } catch (err) {
      setError('Failed to load announcements');
      setAnnouncements([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedAnnouncements(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const resetForm = () => {
    setFormData({ 
      topic: '', 
      description: '', 
      date: getDefaultDate(), 
      time: getDefaultTime(), 
      attachments: [], 
      type: 'student' 
    });
    setAttachmentInput('');
  };

  const closeModal = () => {
    setShowModal('');
    setSelectedAnnouncement(null);
    resetForm();
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.topic.trim()) { 
      setError('Topic is required'); 
      return false; 
    }
    if (!formData.description.trim()) { 
      setError('Description is required'); 
      return false; 
    }
    if (!formData.date) { 
      setError('Date is required'); 
      return false; 
    }
    if (!formData.time) { 
      setError('Time is required'); 
      return false; 
    }
    return true;
  };

  const handleSubmit = async (isUpdate = false) => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const attachmentsString = formData.attachments.join(',');
      let formattedTime = formData.time.trim();
      if (/^\d{2}:\d{2}$/.test(formattedTime)) formattedTime += ':00';

      const requestData = {
        topic: formData.topic.trim(),
        description: formData.description.trim(),
        attachments: attachmentsString || null,
        date: formData.date.trim(),
        time: formattedTime,
        type: formData.type.trim(),
        ...(isUpdate && { 
          announcement_id: selectedAnnouncement.announcement_id || selectedAnnouncement.id,
          created_at: selectedAnnouncement.created_at 
        })
      };

      const url = isUpdate 
        ? 'http://localhost:8086/api/v1/admin/update_announcement'
        : 'http://localhost:8086/api/v1/admin/create_announcements';
      
      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        setSuccess(`Announcement ${isUpdate ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          closeModal();
          fetchAnnouncements();
        }, 1500);
      } else {
        const responseText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || `Failed to ${isUpdate ? 'update' : 'create'} announcement`;
        } catch {
          errorMessage = responseText || `Failed to ${isUpdate ? 'update' : 'create'} announcement`;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      setError(err.message || `An error occurred while ${isUpdate ? 'updating' : 'creating'} the announcement`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:8086/api/v1/admin/delete_announcement', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcement_id: selectedAnnouncement.announcement_id || selectedAnnouncement.id })
      });

      if (response.ok) {
        setSuccess('Announcement deleted successfully!');
        setTimeout(() => {
          closeModal();
          fetchAnnouncements();
        }, 1500);
      } else {
        const responseText = await response.text();
        throw new Error(responseText || 'Failed to delete announcement');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    const attachmentsArray = announcement.attachments ? announcement.attachments.split(',').map(att => att.trim()).filter(att => att) : [];
    let formattedTime = announcement.time || getDefaultTime();
    if (formattedTime.includes(':') && formattedTime.split(':').length === 3) {
      formattedTime = formattedTime.substring(0, 5);
    }

    setFormData({
      topic: announcement.topic || '',
      description: announcement.description || '',
      date: announcement.date || getDefaultDate(),
      time: formattedTime,
      attachments: attachmentsArray,
      type: announcement.type || 'student'
    });
    setShowModal('update');
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const parseAttachments = (attachmentsString) => {
    if (!attachmentsString) return [];
    return attachmentsString.split(',').map(att => att.trim()).filter(att => att);
  };

  const handleAddAttachment = () => {
    if (!attachmentInput.trim()) return;
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, attachmentInput.trim()] }));
    setAttachmentInput('');
  };

  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#132D46]/90 to-[#191E29]/90 backdrop-blur-xl rounded-2xl border border-[#01C38D]/20 p-6 shadow-2xl shadow-[#01C38D]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#01C38D]/20 to-[#01C38D]/10 rounded-xl">
              <FileText className="text-[#01C38D]" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#01C38D] bg-clip-text text-transparent">
                Announcements Hub
              </h2>
              <p className="text-[#696E79]">Manage and broadcast important updates</p>
            </div>
          </div>
          <Button onClick={() => setShowModal('add')}>
            <Plus size={16} />
            <span>Create Announcement</span>
          </Button>
        </div>
      </div>

      {/* Global Messages */}
      {(success || error) && !showModal && (
        <div className={`p-4 rounded-xl border ${success ? 'bg-green-900/50 border-green-600/50 text-green-200' : 'bg-red-900/50 border-red-600/50 text-red-200'}`}>
          {success || error}
        </div>
      )}

      {/* Announcements Grid */}
      <div className="bg-gradient-to-br from-[#132D46]/90 to-[#191E29]/90 backdrop-blur-xl rounded-2xl border border-[#01C38D]/20 overflow-hidden shadow-2xl shadow-[#01C38D]/10">
        <div className="p-6 border-b border-[#01C38D]/20 bg-gradient-to-r from-[#01C38D]/5 to-transparent">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Sparkles className="mr-2 text-[#01C38D]" size={20} />
              All Announcements
            </h3>
            <div className="text-sm text-[#696E79]">{announcements.length} total</div>
          </div>
        </div>

        <div className="p-6">
          {fetchLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#01C38D]"></div>
              <span className="ml-3 text-white">Loading announcements...</span>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-[#01C38D]/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText size={32} className="text-[#01C38D]" />
              </div>
              <p className="text-[#696E79] mb-2">No announcements yet</p>
              <p className="text-sm text-[#696E79]/70">Create your first announcement to get started</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {announcements.map((announcement, index) => {
                const isExpanded = expandedAnnouncements.has(announcement.id || index);
                const attachments = parseAttachments(announcement.attachments);
                
                return (
                  <div key={announcement.id || index} className="group bg-gradient-to-r from-[#191E29]/70 to-[#132D46]/50 border border-[#01C38D]/10 rounded-xl overflow-hidden hover:border-[#01C38D]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#01C38D]/10">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-white group-hover:text-[#01C38D] transition-colors">{announcement.topic}</h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${announcement.type === 'student' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                              {announcement.type === 'student' ? <GraduationCap size={12} className="inline mr-1" /> : <Users size={12} className="inline mr-1" />}
                              {announcement.type === 'student' ? 'Students' : 'Teachers'}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-[#696E79] mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{formatDate(announcement.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{announcement.time || '--:--'}</span>
                            </div>
                          </div>
                          
                          <div className="text-[#B0B7C3] mb-3">
                            <p className={isExpanded ? "whitespace-pre-wrap" : "line-clamp-2"}>
                              {isExpanded ? announcement.description : 
                                (announcement.description?.length > 120 ? 
                                  `${announcement.description.substring(0, 120)}...` : 
                                  announcement.description)
                              }
                            </p>
                          </div>

                          {attachments.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-2">
                                {attachments.map((attachment, attIndex) => (
                                  <div key={attIndex} className="flex items-center space-x-1 bg-[#01C38D]/10 border border-[#01C38D]/20 rounded-lg px-2 py-1">
                                    <FileText size={12} className="text-[#01C38D]" />
                                    <span className="text-xs text-white">{attachment}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleUpdateClick(announcement)} className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-colors" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => { setSelectedAnnouncement(announcement); setShowModal('delete'); }} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                          <button onClick={() => toggleExpanded(announcement.id || index)} className="p-2 rounded-lg bg-[#01C38D]/20 hover:bg-[#01C38D]/30 text-[#01C38D] transition-colors" title={isExpanded ? "Collapse" : "Expand"}>
                            <ChevronDown size={16} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Update Modal */}
      {(showModal === 'add' || showModal === 'update') && (
        <Modal title={showModal === 'add' ? 'Create New Announcement' : 'Update Announcement'} onClose={closeModal}>
          <div className="space-y-6">
            {(success || error) && (
              <div className={`p-3 rounded-xl ${success ? 'bg-green-900/50 border border-green-600/50 text-green-200' : 'bg-red-900/50 border border-red-600/50 text-red-200'}`}>
                {success || error}
              </div>
            )}

            <FormField label="Topic" required>
              <Input 
                name="topic" 
                value={formData.topic} 
                onChange={(e) => setFormData(prev => ({...prev, topic: e.target.value}))}
                placeholder="Enter announcement topic" 
                disabled={loading} 
              />
            </FormField>

            <FormField label="Description" required>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                rows={4} 
                placeholder="Enter detailed description" 
                disabled={loading}
                className="w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#01C38D]/20 rounded-xl text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] focus:shadow-lg focus:shadow-[#01C38D]/20 transition-all duration-300 resize-vertical" 
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField label="Date" required>
                <Input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                  disabled={loading} 
                />
              </FormField>
              <FormField label="Time" required>
                <Input 
                  type="time" 
                  name="time" 
                  value={formData.time} 
                  onChange={(e) => setFormData(prev => ({...prev, time: e.target.value}))}
                  disabled={loading} 
                />
              </FormField>
              <FormField label="Target Audience" required>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={(e) => setFormData(prev => ({...prev, type: e.target.value}))}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-[#191E29]/70 backdrop-blur-sm border border-[#01C38D]/20 rounded-xl text-white focus:outline-none focus:border-[#01C38D] transition-all duration-300"
                >
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                </select>
              </FormField>
            </div>

            <FormField label="Attachments">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Input 
                    value={attachmentInput} 
                    onChange={(e) => setAttachmentInput(e.target.value)} 
                    placeholder="Enter file name or URL" 
                    disabled={loading} 
                    className="flex-1" 
                  />
                  <Button onClick={handleAddAttachment} disabled={!attachmentInput.trim() || loading} className="shrink-0">
                    <Plus size={16} />
                  </Button>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between bg-[#191E29]/50 border border-[#01C38D]/20 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <FileText size={14} className="text-[#01C38D]" />
                          <span className="text-white text-sm">{attachment}</span>
                        </div>
                        <button onClick={() => handleRemoveAttachment(index)} disabled={loading} className="text-red-400 hover:text-red-300 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormField>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={closeModal} disabled={loading}>Cancel</Button>
              <Button onClick={() => handleSubmit(showModal === 'update')} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{showModal === 'update' ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    {showModal === 'update' ? <Edit size={16} /> : <Plus size={16} />}
                    <span>{showModal === 'update' ? 'Update' : 'Create'} Announcement</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showModal === 'delete' && selectedAnnouncement && (
        <Modal title="Confirm Deletion" size="md" onClose={closeModal}>
          <div className="space-y-6">
            {(success || error) && (
              <div className={`p-3 rounded-xl ${success ? 'bg-green-900/50 border border-green-600/50 text-green-200' : 'bg-red-900/50 border border-red-600/50 text-red-200'}`}>
                {success || error}
              </div>
            )}

            <div className="text-center">
              <div className="p-4 bg-red-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <p className="text-white mb-2">Are you sure you want to delete this announcement?</p>
              <p className="text-[#696E79] text-sm mb-4">
                <strong>"{selectedAnnouncement.topic}"</strong>
              </p>
              <p className="text-red-400 text-xs">This action cannot be undone.</p>
            </div>

            <div className="flex justify-center space-x-3">
              <Button variant="secondary" onClick={closeModal} disabled={loading}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AnnouncementsManager;