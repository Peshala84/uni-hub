import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Upload, X, Calendar, Clock, FileText, Link, Image, Eye, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState(new Set());

  // Default date: today, default time: 02:00:00
  const getDefaultDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };
  // Returns current time in HH:mm format for input type="time"
  const getDefaultTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    date: getDefaultDate(),
    time: getDefaultTime(),
    attachments: [],
    type: 'student' // default value
  });
  const [attachmentInput, setAttachmentInput] = useState('');
  const [attachmentType, setAttachmentType] = useState('file');

  // Fetch announcements on component mount
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
      } else {
        throw new Error('Failed to fetch announcements');
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
      setAnnouncements([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedAnnouncements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  }, [error, success]);

  const handleAddAttachment = useCallback(() => {
    if (!attachmentInput.trim()) return;

    const newAttachment = {
      type: attachmentType,
      value: attachmentInput.trim()
    };

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment]
    }));
    setAttachmentInput('');
  }, [attachmentInput, attachmentType]);

  const handleRemoveAttachment = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  }, []);

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
    setAttachmentType('file');
  };

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!formData.topic.trim()) {
      setError('Topic is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.date) {
      setError('Date is required');
      return;
    }
    if (!formData.time) {
      setError('Time is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Prepare attachments as comma-separated string
      const attachmentsString = formData.attachments
        .map(att => att.value)
        .join(',');

      // Ensure time is in HH:mm:ss format
      let formattedTime = formData.time.trim();
      if (/^\d{2}:\d{2}$/.test(formattedTime)) {
        formattedTime += ':00';
      }
      const requestData = {
        topic: formData.topic.trim(),
        description: formData.description.trim(),
        attachments: attachmentsString || null,
        date: formData.date.trim(),
        time: formattedTime,
        type: formData.type.trim()
      };

      console.log('Submitting announcement:', requestData);

      const response = await fetch('http://localhost:8086/api/v1/admin/create_announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      if (response.ok) {
        setSuccess('Announcement created successfully!');
        resetForm();
        // Close the form after a brief delay
        setTimeout(() => {
          setShowAddForm(false);
          setSuccess('');
          // Refresh the announcements list
          fetchAnnouncements();
        }, 2000);
      } else {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || 'Failed to create announcement';
        } catch (parseError) {
          errorMessage = responseText || 'Failed to create announcement';
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError(err.message || 'An error occurred while creating the announcement');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // Handle Update
  const handleUpdateClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    
    // Parse attachments back to array format
    let attachmentsArray = [];
    if (announcement.attachments) {
      attachmentsArray = announcement.attachments.split(',').map(att => ({
        type: 'file', // Default type since we don't store type info
        value: att.trim()
      }));
    }

    // Format time to HH:mm for input
    let formattedTime = announcement.time || getDefaultTime();
    if (formattedTime.includes(':') && formattedTime.split(':').length === 3) {
      formattedTime = formattedTime.substring(0, 5); // Remove seconds
    }

    setFormData({
      topic: announcement.topic || '',
      description: announcement.description || '',
      date: announcement.date || getDefaultDate(),
      time: formattedTime,
      attachments: attachmentsArray,
      type: announcement.type || 'student'
    });
    setShowUpdateForm(true);
  };

  const handleUpdateSubmit = useCallback(async () => {
    // Validation
    if (!formData.topic.trim()) {
      setError('Topic is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.date) {
      setError('Date is required');
      return;
    }
    if (!formData.time) {
      setError('Time is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Prepare attachments as comma-separated string
      const attachmentsString = formData.attachments
        .map(att => att.value)
        .join(',');

      // Ensure time is in HH:mm:ss format
      let formattedTime = formData.time.trim();
      if (/^\d{2}:\d{2}$/.test(formattedTime)) {
        formattedTime += ':00';
      }

      const requestData = {
        announcement_id: selectedAnnouncement.announcement_id || selectedAnnouncement.id,
        topic: formData.topic.trim(),
        description: formData.description.trim(),
        attachments: attachmentsString || null,
        date: formData.date.trim(),
        time: formattedTime,
        type: formData.type.trim(),
        created_at: selectedAnnouncement.created_at
      };

      console.log('Updating announcement:', requestData);

      const response = await fetch('http://localhost:8086/api/v1/admin/update_announcement', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      if (response.ok) {
        setSuccess('Announcement updated successfully!');
        resetForm();
        // Close the form after a brief delay
        setTimeout(() => {
          setShowUpdateForm(false);
          setSelectedAnnouncement(null);
          setSuccess('');
          // Refresh the announcements list
          fetchAnnouncements();
        }, 2000);
      } else {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || 'Failed to update announcement';
        } catch (parseError) {
          errorMessage = responseText || 'Failed to update announcement';
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error updating announcement:', err);
      setError(err.message || 'An error occurred while updating the announcement');
    } finally {
      setLoading(false);
    }
  }, [formData, selectedAnnouncement]);

  // Handle Delete
  const handleDeleteClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const requestData = {
        announcement_id: selectedAnnouncement.announcement_id || selectedAnnouncement.id
      };

      console.log('Deleting announcement:', requestData);

      const response = await fetch('http://localhost:8086/api/v1/admin/delete_announcement', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      if (response.ok) {
        setSuccess('Announcement deleted successfully!');
        // Close the confirmation after a brief delay
        setTimeout(() => {
          setShowDeleteConfirm(false);
          setSelectedAnnouncement(null);
          setSuccess('');
          // Refresh the announcements list
          fetchAnnouncements();
        }, 2000);
      } else {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || 'Failed to delete announcement';
        } catch (parseError) {
          errorMessage = responseText || 'Failed to delete announcement';
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError(err.message || 'An error occurred while deleting the announcement');
    } finally {
      setLoading(false);
    }
  }, [selectedAnnouncement]);

  const getAttachmentIcon = (type) => {
    switch (type) {
      case 'link': return <Link size={14} />;
      case 'image': return <Image size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getAttachmentDisplay = (attachment) => {
    if (attachment.type === 'link') {
      return attachment.value;
    }
    return attachment.value.split('/').pop() || attachment.value;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const parseAttachments = (attachmentsString) => {
    if (!attachmentsString) return [];
    return attachmentsString.split(',').map(att => att.trim()).filter(att => att);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Announcements Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#01C38D] text-white rounded-lg hover:bg-opacity-80 transition-colors"
        >
          <Plus size={16} />
          <span>Add Announcement</span>
        </button>
      </div>

      {/* Global Success Message */}
      {success && !showAddForm && !showUpdateForm && !showDeleteConfirm && (
        <div className="mb-4 p-3 bg-green-900 border border-green-600 rounded-lg">
          <p className="text-green-200 text-sm">{success}</p>
        </div>
      )}

      {/* Global Error Message */}
      {error && !showAddForm && !showUpdateForm && !showDeleteConfirm && (
        <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Announcements List */}
      <div className="bg-[#132D46] rounded-xl border border-[#191E29] overflow-hidden">
        <div className="p-6 border-b border-[#191E29]">
          <h3 className="text-xl font-bold text-white">All Announcements</h3>
        </div>

        <div className="p-6">
          {fetchLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#01C38D]"></div>
              <span className="ml-3 text-white">Loading announcements...</span>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[#696E79] mb-4">
                <FileText size={48} className="mx-auto mb-4" />
                <p>No announcements found</p>
                <p className="text-sm mt-2">Click "Add Announcement" to create your first announcement</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement, index) => {
                const isExpanded = expandedAnnouncements.has(announcement.id || index);
                const attachments = parseAttachments(announcement.attachments);
                
                return (
                  <div key={announcement.id || index} className="bg-[#191E29] border border-[#2A3441] rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">{announcement.topic}</h4>
                          <div className="flex items-center space-x-4 text-sm text-[#696E79] mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{announcement.date ? formatDate(announcement.date) : 'No date'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{announcement.time || 'No time'}</span>
                            </div>
                          </div>
                          
                          {/* Description - truncated or full based on expansion */}
                          <div className="text-[#B0B7C3] mb-3">
                            {isExpanded ? (
                              <p className="whitespace-pre-wrap">{announcement.description}</p>
                            ) : (
                              <p className="line-clamp-2">
                                {announcement.description?.length > 150 
                                  ? `${announcement.description.substring(0, 150)}...`
                                  : announcement.description
                                }
                              </p>
                            )}
                          </div>

                          {/* Attachments */}
                          {attachments.length > 0 && (
                            <div className="mb-3">
                              <span className="text-sm text-[#696E79] mb-2 block">Attachments:</span>
                              <div className="flex flex-wrap gap-2">
                                {attachments.map((attachment, attIndex) => (
                                  <div key={attIndex} className="flex items-center space-x-2 bg-[#132D46] border border-[#2A3441] rounded px-3 py-1">
                                    <FileText size={12} />
                                    <span className="text-xs text-white">{attachment}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {/* Update Button */}
                          <button
                            onClick={() => handleUpdateClick(announcement)}
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                            title="Update announcement"
                          >
                            <Edit size={20} />
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteClick(announcement)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                            title="Delete announcement"
                          >
                            <Trash2 size={20} />
                          </button>
                          
                          {/* Expand/Collapse Button */}
                          <button
                            onClick={() => toggleExpanded(announcement.id || index)}
                            className="text-[#696E79] hover:text-white transition-colors"
                            title={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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

      {/* Add Announcement Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#132D46] rounded-xl border border-[#191E29] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#191E29] flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Add New Announcement</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                  setError('');
                  setSuccess('');
                }}
                className="text-[#696E79] hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-900 border border-green-600 rounded-lg">
                  <p className="text-green-200 text-sm">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900 border border-red-600 rounded-lg">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-white mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#191E29] border border-[#2A3441] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] transition-colors"
                  placeholder="Enter announcement topic"
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#191E29] border border-[#2A3441] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] transition-colors resize-vertical"
                  placeholder="Enter detailed description of the announcement"
                  disabled={loading}
                />
              </div>

              {/* Date, Time, and Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-white mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#191E29] border border-[#2A3441] rounded-lg text-white focus:outline-none focus:border-[#01C38D] transition-colors"
                      disabled={loading}
                    />
                    <Calendar className="absolute right-3 top-3 h-5 w-5 text-[#696E79] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-white mb-2">
                    Time *
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#191E29] border border-[#2A3441] rounded-lg text-white focus:outline-none focus:border-[#01C38D] transition-colors"
                      disabled={loading}
                    />
                    <Clock className="absolute right-3 top-3 h-5 w-5 text-[#696E79] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Announcement Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#191E29] border border-[#2A3441] rounded-lg text-white focus:outline-none focus:border-[#01C38D] transition-colors"
                    disabled={loading}
                  >
                    <option value="student">For Students</option>
                    <option value="teacher">For Teachers</option>
                  </select>
                </div>
              </div>

              {/* Attachments Section */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Attachments (Optional)
                </label>
                
                {/* Add Attachment */}
                <div className="bg-[#191E29] border border-[#2A3441] rounded-lg p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      value={attachmentType}
                      onChange={(e) => setAttachmentType(e.target.value)}
                      className="px-3 py-2 bg-[#132D46] border border-[#2A3441] rounded-lg text-white focus:outline-none focus:border-[#01C38D] transition-colors"
                      disabled={loading}
                    >
                      <option value="file">File/PDF</option>
                      <option value="image">Image</option>
                      <option value="link">Link</option>
                    </select>
                    
                    <input
                      type="text"
                      value={attachmentInput}
                      onChange={(e) => setAttachmentInput(e.target.value)}
                      placeholder={
                        attachmentType === 'link' 
                          ? 'https://example.com' 
                          : attachmentType === 'image'
                          ? 'image.jpg or https://example.com/image.png'
                          : 'document.pdf'
                      }
                      className="flex-1 px-3 py-2 bg-[#132D46] border border-[#2A3441] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] transition-colors"
                      disabled={loading}
                    />
                    
                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      disabled={!attachmentInput.trim() || loading}
                      className="px-4 py-2 bg-[#01C38D] text-white rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Attachments List */}
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between bg-[#191E29] border border-[#2A3441] rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          {getAttachmentIcon(attachment.type)}
                          <span className="text-white text-sm">
                            {getAttachmentDisplay(attachment)}
                          </span>
                          <span className="text-[#696E79] text-xs">
                            ({attachment.type})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          disabled={loading}
                          className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                    setError('');
                    setSuccess('');
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-[#2A3441] text-white rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-[#01C38D] text-white rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Create Announcement</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Announcement Modal */}
      {showUpdateForm && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#132D46] rounded-xl border border-[#191E29] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#191E29] flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Update Announcement</h3>
              <button
                onClick={() => {
                  setShowUpdateForm(false);
                  setSelectedAnnouncement(null);
                  resetForm();
                  setError('');
                  setSuccess('');
                }}
                className="text-[#696E79] hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-900 border border-green-600 rounded-lg">
                  <p className="text-green-200 text-sm">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900 border border-red-600 rounded-lg">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Topic */}
              <div>
                <label htmlFor="update-topic" className="block text-sm font-medium text-white mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  id="update-topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#191E29] border border-[#2A3441] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] transition-colors"
                  placeholder="Enter announcement topic"
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="update-description" className="block text-sm font-medium text-white mb-2">
                  Description *
                </label>
                <textarea
                  id="update-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#191E29] border border-[#2A3441] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] transition-colors resize-vertical"
                  placeholder="Enter detailed description of the announcement"
                  disabled={loading}
                />
              </div>

              {/* Date, Time, and Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="update-date" className="block text-sm font-medium text-white mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="update-date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#191E29] border border-[#2A3441] rounded-lg text-white focus:outline-none focus:border-[#01C38D] transition-colors"
                      disabled={loading}
                    />
                    <Calendar className="absolute right-3 top-3 h-5 w-5 text-[#696E79] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="update-time" className="block text-sm font-medium text-white mb-2">
                    Time *
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="update-time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#191E29] border border-[#2A3441] rounded-lg text-white focus:outline-none focus:border-[#01C38D] transition-colors"
                      disabled={loading}
                    />
                    <Clock className="absolute right-3 top-3 h-5 w-5 text-[#696E79] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Announcement Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#191E29] border border-[#2A3441] rounded-lg text-white focus:outline-none focus:border-[#01C38D] transition-colors"
                    disabled={loading}
                  >
                    <option value="student">For Students</option>
                    <option value="teacher">For Teachers</option>
                  </select>
                </div>
              </div>

              {/* Attachments Section */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Attachments (Optional)
                </label>
                
                {/* Add Attachment */}
                <div className="bg-[#191E29] border border-[#2A3441] rounded-lg p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      value={attachmentType}
                      onChange={(e) => setAttachmentType(e.target.value)}
                      className="px-3 py-2 bg-[#132D46] border border-[#2A3441] rounded-lg text-white focus:outline-none focus:border-[#01C38D] transition-colors"
                      disabled={loading}
                    >
                      <option value="file">File/PDF</option>
                      <option value="image">Image</option>
                      <option value="link">Link</option>
                    </select>
                    
                    <input
                      type="text"
                      value={attachmentInput}
                      onChange={(e) => setAttachmentInput(e.target.value)}
                      placeholder={
                        attachmentType === 'link' 
                          ? 'https://example.com' 
                          : attachmentType === 'image'
                          ? 'image.jpg or https://example.com/image.png'
                          : 'document.pdf'
                      }
                      className="flex-1 px-3 py-2 bg-[#132D46] border border-[#2A3441] rounded-lg text-white placeholder-[#696E79] focus:outline-none focus:border-[#01C38D] transition-colors"
                      disabled={loading}
                    />
                    
                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      disabled={!attachmentInput.trim() || loading}
                      className="px-4 py-2 bg-[#01C38D] text-white rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Attachments List */}
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between bg-[#191E29] border border-[#2A3441] rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          {getAttachmentIcon(attachment.type)}
                          <span className="text-white text-sm">
                            {getAttachmentDisplay(attachment)}
                          </span>
                          <span className="text-[#696E79] text-xs">
                            ({attachment.type})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          disabled={loading}
                          className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateForm(false);
                    setSelectedAnnouncement(null);
                    resetForm();
                    setError('');
                    setSuccess('');
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-[#2A3441] text-white rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateSubmit}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Edit size={16} />
                      <span>Update Announcement</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#132D46] rounded-xl border border-[#191E29] w-full max-w-md">
            <div className="p-6 border-b border-[#191E29]">
              <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-900 border border-green-600 rounded-lg">
                  <p className="text-green-200 text-sm">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900 border border-red-600 rounded-lg">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <Trash2 size={48} className="mx-auto" />
                </div>
                <p className="text-white mb-2">Are you sure you want to delete this announcement?</p>
                <p className="text-[#696E79] text-sm mb-4">
                  <strong>"{selectedAnnouncement.topic}"</strong>
                </p>
                <p className="text-red-400 text-xs">
                  This action cannot be undone.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedAnnouncement(null);
                    setError('');
                    setSuccess('');
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-[#2A3441] text-white rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManager;

// import React, { useState, useCallback, useEffect } from 'react';
// import { Plus, X, Calendar, Clock, FileText, Link, Image, Edit, Trash2, ChevronDown, ChevronUp, Search, Menu, Bell, User } from 'lucide-react';

// const AnnouncementsManager = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showUpdateForm, setShowUpdateForm] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
//   const [expandedAnnouncements, setExpandedAnnouncements] = useState(new Set());
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   // Default values
//   const getDefaultDate = () => new Date().toISOString().slice(0, 10);
//   const getDefaultTime = () => {
//     const now = new Date();
//     return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
//   };

//   const [formData, setFormData] = useState({
//     topic: '', description: '', date: getDefaultDate(), time: getDefaultTime(), attachments: [], type: 'student'
//   });
//   const [attachmentInput, setAttachmentInput] = useState('');
//   const [attachmentType, setAttachmentType] = useState('file');

//   // Timer for current time
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     fetchAnnouncements();
//     return () => clearInterval(timer);
//   }, []);

//   const fetchAnnouncements = async () => {
//     try {
//       setFetchLoading(true);
//       setError('');
//       const response = await fetch('http://localhost:8086/api/v1/admin/view_announcements');
//       if (response.ok) {
//         const data = await response.json();
//         setAnnouncements(Array.isArray(data) ? data : []);
//       } else throw new Error('Failed to fetch announcements');
//     } catch (err) {
//       console.error('Error fetching announcements:', err);
//       setError('Failed to load announcements');
//       setAnnouncements([]);
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const toggleExpanded = (id) => {
//     setExpandedAnnouncements(prev => {
//       const newSet = new Set(prev);
//       newSet.has(id) ? newSet.delete(id) : newSet.add(id);
//       return newSet;
//     });
//   };

//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (error) setError('');
//     if (success) setSuccess('');
//   }, [error, success]);

//   const handleAddAttachment = useCallback(() => {
//     if (!attachmentInput.trim()) return;
//     setFormData(prev => ({
//       ...prev,
//       attachments: [...prev.attachments, { type: attachmentType, value: attachmentInput.trim() }]
//     }));
//     setAttachmentInput('');
//   }, [attachmentInput, attachmentType]);

//   const handleRemoveAttachment = useCallback((index) => {
//     setFormData(prev => ({
//       ...prev,
//       attachments: prev.attachments.filter((_, i) => i !== index)
//     }));
//   }, []);

//   const resetForm = () => {
//     setFormData({ topic: '', description: '', date: getDefaultDate(), time: getDefaultTime(), attachments: [], type: 'student' });
//     setAttachmentInput('');
//     setAttachmentType('file');
//   };

//   const handleSubmit = useCallback(async (isUpdate = false) => {
//     if (!formData.topic.trim() || !formData.description.trim() || !formData.date || !formData.time) {
//       setError('All required fields must be filled');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       setSuccess('');

//       const attachmentsString = formData.attachments.map(att => att.value).join(',');
//       let formattedTime = formData.time.trim();
//       if (/^\d{2}:\d{2}$/.test(formattedTime)) formattedTime += ':00';

//       const requestData = {
//         ...(isUpdate && { 
//           announcement_id: selectedAnnouncement.announcement_id || selectedAnnouncement.id,
//           created_at: selectedAnnouncement.created_at 
//         }),
//         topic: formData.topic.trim(),
//         description: formData.description.trim(),
//         attachments: attachmentsString || null,
//         date: formData.date.trim(),
//         time: formattedTime,
//         type: formData.type.trim()
//       };

//       const url = isUpdate 
//         ? 'http://localhost:8086/api/v1/admin/update_announcement'
//         : 'http://localhost:8086/api/v1/admin/create_announcements';
      
//       const method = isUpdate ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestData)
//       });

//       if (response.ok) {
//         setSuccess(`Announcement ${isUpdate ? 'updated' : 'created'} successfully!`);
//         resetForm();
//         setTimeout(() => {
//           setShowAddForm(false);
//           setShowUpdateForm(false);
//           setSelectedAnnouncement(null);
//           setSuccess('');
//           fetchAnnouncements();
//         }, 2000);
//       } else {
//         const responseText = await response.text();
//         let errorMessage;
//         try {
//           const errorData = JSON.parse(responseText);
//           errorMessage = errorData.message || errorData.error || `Failed to ${isUpdate ? 'update' : 'create'} announcement`;
//         } catch {
//           errorMessage = responseText || `Failed to ${isUpdate ? 'update' : 'create'} announcement`;
//         }
//         throw new Error(errorMessage);
//       }
//     } catch (err) {
//       console.error(`Error ${isUpdate ? 'updating' : 'creating'} announcement:`, err);
//       setError(err.message || `An error occurred while ${isUpdate ? 'updating' : 'creating'} the announcement`);
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, selectedAnnouncement]);

//   const handleUpdateClick = (announcement) => {
//     setSelectedAnnouncement(announcement);
    
//     let attachmentsArray = [];
//     if (announcement.attachments) {
//       attachmentsArray = announcement.attachments.split(',').map(att => ({
//         type: 'file',
//         value: att.trim()
//       }));
//     }

//     let formattedTime = announcement.time || getDefaultTime();
//     if (formattedTime.includes(':') && formattedTime.split(':').length === 3) {
//       formattedTime = formattedTime.substring(0, 5);
//     }

//     setFormData({
//       topic: announcement.topic || '',
//       description: announcement.description || '',
//       date: announcement.date || getDefaultDate(),
//       time: formattedTime,
//       attachments: attachmentsArray,
//       type: announcement.type || 'student'
//     });
//     setShowUpdateForm(true);
//   };

//   const handleDeleteClick = (announcement) => {
//     setSelectedAnnouncement(announcement);
//     setShowDeleteConfirm(true);
//   };

//   const handleDeleteConfirm = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const response = await fetch('http://localhost:8086/api/v1/admin/delete_announcement', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           announcement_id: selectedAnnouncement.announcement_id || selectedAnnouncement.id
//         })
//       });

//       if (response.ok) {
//         setSuccess('Announcement deleted successfully!');
//         setTimeout(() => {
//           setShowDeleteConfirm(false);
//           setSelectedAnnouncement(null);
//           setSuccess('');
//           fetchAnnouncements();
//         }, 2000);
//       } else {
//         const responseText = await response.text();
//         let errorMessage;
//         try {
//           const errorData = JSON.parse(responseText);
//           errorMessage = errorData.message || errorData.error || 'Failed to delete announcement';
//         } catch {
//           errorMessage = responseText || 'Failed to delete announcement';
//         }
//         throw new Error(errorMessage);
//       }
//     } catch (err) {
//       console.error('Error deleting announcement:', err);
//       setError(err.message || 'An error occurred while deleting the announcement');
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedAnnouncement]);

//   const getAttachmentIcon = (type) => {
//     switch (type) {
//       case 'link': return <Link size={14} />;
//       case 'image': return <Image size={14} />;
//       default: return <FileText size={14} />;
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric', month: 'short', day: 'numeric'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const parseAttachments = (attachmentsString) => {
//     if (!attachmentsString) return [];
//     return attachmentsString.split(',').map(att => att.trim()).filter(att => att);
//   };

//   // Filter announcements based on search
//   const filteredAnnouncements = announcements.filter(announcement =>
//     announcement.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     announcement.description?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Render Form Component - FIXED VERSION
//   const FormModal = ({ isUpdate = false, show, onClose }) => {
//     if (!show) return null;

//     // Prevent modal from closing when clicking inside the form
//     const handleModalClick = (e) => {
//       e.stopPropagation();
//     };

//     // Only close when clicking the backdrop
//     const handleBackdropClick = (e) => {
//       if (e.target === e.currentTarget) {
//         onClose();
//       }
//     };

//     return (
//       <div 
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
//         onClick={handleBackdropClick}
//         style={{ pointerEvents: 'auto' }}
//       >
//         <div 
//           className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-emerald-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-emerald-500/10"
//           onClick={handleModalClick}
//           style={{ pointerEvents: 'auto' }}
//         >
//           <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-700 p-6 border-b border-emerald-500/20 rounded-t-3xl flex items-center justify-between z-10">
//             <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
//               {isUpdate ? 'Update' : 'Create'} Announcement
//             </h3>
//             <button 
//               onClick={onClose} 
//               className="p-2 hover:bg-white/10 rounded-full transition-colors"
//               type="button"
//             >
//               <X size={24} className="text-gray-300" />
//             </button>
//           </div>

//           <div className="p-6 space-y-6">
//             {(success || error) && (
//               <div className={`p-4 rounded-2xl border ${success ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-300' : 'bg-red-900/30 border-red-500/30 text-red-300'}`}>
//                 {success || error}
//               </div>
//             )}

//             <div className="grid gap-6">
//               <input
//                 name="topic"
//                 value={formData.topic}
//                 onChange={handleInputChange}
//                 placeholder="Announcement Topic *"
//                 className="w-full p-4 bg-slate-800/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all focus:outline-none"
//                 disabled={loading}
//                 autoComplete="off"
//                 style={{ pointerEvents: 'auto' }}
//               />

//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Description *"
//                 rows={4}
//                 className="w-full p-4 bg-slate-800/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none focus:outline-none"
//                 disabled={loading}
//                 autoComplete="off"
//                 style={{ pointerEvents: 'auto' }}
//               />

//               <div className="grid grid-cols-3 gap-4">
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   className="p-4 bg-slate-800/50 border border-gray-600 rounded-2xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all focus:outline-none"
//                   disabled={loading}
//                   style={{ pointerEvents: 'auto' }}
//                 />
//                 <input
//                   type="time"
//                   name="time"
//                   value={formData.time}
//                   onChange={handleInputChange}
//                   className="p-4 bg-slate-800/50 border border-gray-600 rounded-2xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all focus:outline-none"
//                   disabled={loading}
//                   style={{ pointerEvents: 'auto' }}
//                 />
//                 <select
//                   name="type"
//                   value={formData.type}
//                   onChange={handleInputChange}
//                   className="p-4 bg-slate-800/50 border border-gray-600 rounded-2xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all focus:outline-none"
//                   disabled={loading}
//                   style={{ pointerEvents: 'auto' }}
//                 >
//                   <option value="student">Students</option>
//                   <option value="teacher">Teachers</option>
//                 </select>
//               </div>

//               {/* Attachments */}
//               <div className="bg-slate-800/30 rounded-2xl p-4 border border-gray-600/30">
//                 <div className="flex gap-3 mb-4">
//                   <select
//                     value={attachmentType}
//                     onChange={(e) => setAttachmentType(e.target.value)}
//                     className="px-3 py-2 bg-slate-700/50 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
//                     style={{ pointerEvents: 'auto' }}
//                   >
//                     <option value="file">File</option>
//                     <option value="image">Image</option>
//                     <option value="link">Link</option>
//                   </select>
//                   <input
//                     value={attachmentInput}
//                     onChange={(e) => setAttachmentInput(e.target.value)}
//                     placeholder="Enter attachment..."
//                     className="flex-1 px-3 py-2 bg-slate-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:border-emerald-500"
//                     autoComplete="off"
//                     style={{ pointerEvents: 'auto' }}
//                   />
//                   <button
//                     onClick={handleAddAttachment}
//                     disabled={!attachmentInput.trim()}
//                     className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl text-white transition-colors"
//                     type="button"
//                     style={{ pointerEvents: 'auto' }}
//                   >
//                     <Plus size={16} />
//                   </button>
//                 </div>

//                 {formData.attachments.length > 0 && (
//                   <div className="space-y-2">
//                     {formData.attachments.map((attachment, index) => (
//                       <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded-xl p-3">
//                         <div className="flex items-center space-x-2">
//                           {getAttachmentIcon(attachment.type)}
//                           <span className="text-white text-sm">{attachment.value}</span>
//                           <span className="text-gray-400 text-xs">({attachment.type})</span>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveAttachment(index)}
//                           className="text-red-400 hover:text-red-300 transition-colors"
//                           type="button"
//                           style={{ pointerEvents: 'auto' }}
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 pt-4">
//               <button
//                 onClick={onClose}
//                 disabled={loading}
//                 className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl transition-colors disabled:opacity-50"
//                 type="button"
//                 style={{ pointerEvents: 'auto' }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleSubmit(isUpdate)}
//                 disabled={loading}
//                 className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-2xl transition-all disabled:opacity-50 flex items-center gap-2"
//                 type="button"
//                 style={{ pointerEvents: 'auto' }}
//               >
//                 {loading ? (
//                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 ) : (
//                   <>{isUpdate ? <Edit size={16} /> : <Plus size={16} />}</>
//                 )}
//                 {loading ? (isUpdate ? 'Updating...' : 'Creating...') : (isUpdate ? 'Update' : 'Create')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Top Actions Bar */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center space-x-6">
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
//               Announcements Manager
//             </h1>
//             <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-full border border-emerald-500/20">
//               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
//               <span className="text-sm font-mono text-emerald-400">
//                 {currentTime.toLocaleTimeString()}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search announcements..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2.5 bg-slate-800/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all w-64 focus:outline-none"
//               />
//             </div>

//             <button
//               onClick={() => setShowAddForm(true)}
//               className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
//             >
//               <Plus size={18} />
//               <span>Add New</span>
//             </button>
//           </div>
//         </div>

//         {/* Global Messages */}
//         {(success || error) && !showAddForm && !showUpdateForm && !showDeleteConfirm && (
//           <div className={`mb-6 p-4 rounded-2xl border ${success ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-300' : 'bg-red-900/30 border-red-500/30 text-red-300'}`}>
//             {success || error}
//           </div>
//         )}

//         {/* Announcements Grid */}
//         <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-gray-700/50 shadow-2xl shadow-black/20 backdrop-blur-sm">
//           <div className="p-6 border-b border-gray-700/50">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-bold text-white">All Announcements</h2>
//               <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
//                 {filteredAnnouncements.length} found
//               </span>
//             </div>
//           </div>

//           <div className="p-6">
//             {fetchLoading ? (
//               <div className="flex items-center justify-center py-20">
//                 <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
//                 <span className="ml-4 text-white text-lg">Loading announcements...</span>
//               </div>
//             ) : filteredAnnouncements.length === 0 ? (
//               <div className="text-center py-20">
//                 <FileText size={64} className="mx-auto mb-4 text-gray-600" />
//                 <h3 className="text-xl font-semibold text-gray-400 mb-2">No announcements found</h3>
//                 <p className="text-gray-500">
//                   {searchTerm ? 'Try adjusting your search terms' : 'Create your first announcement to get started'}
//                 </p>
//               </div>
//             ) : (
//               <div className="grid gap-4">
//                 {filteredAnnouncements.map((announcement, index) => {
//                   const isExpanded = expandedAnnouncements.has(announcement.id || index);
//                   const attachments = parseAttachments(announcement.attachments);
                  
//                   return (
//                     <div key={announcement.id || index} className="group bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-gray-600/50 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
//                       <div className="p-6">
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1 min-w-0">
//                             <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
//                               {announcement.topic}
//                             </h3>
                            
//                             <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
//                               <div className="flex items-center space-x-1">
//                                 <Calendar size={14} />
//                                 <span>{formatDate(announcement.date)}</span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <Clock size={14} />
//                                 <span>{announcement.time || 'No time'}</span>
//                               </div>
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 announcement.type === 'student' 
//                                   ? 'bg-blue-500/20 text-blue-400' 
//                                   : 'bg-purple-500/20 text-purple-400'
//                               }`}>
//                                 {announcement.type === 'student' ? 'Students' : 'Teachers'}
//                               </span>
//                             </div>
                            
//                             <div className="text-gray-300 mb-3">
//                               {isExpanded ? (
//                                 <p className="whitespace-pre-wrap">{announcement.description}</p>
//                               ) : (
//                                 <p className="line-clamp-2">
//                                   {announcement.description?.length > 150 
//                                     ? `${announcement.description.substring(0, 150)}...`
//                                     : announcement.description
//                                   }
//                                 </p>
//                               )}
//                             </div>

//                             {attachments.length > 0 && (
//                               <div className="flex flex-wrap gap-2 mb-3">
//                                 {attachments.map((attachment, attIndex) => (
//                                   <div key={attIndex} className="flex items-center space-x-1 bg-slate-700/50 border border-gray-600/50 rounded-lg px-3 py-1">
//                                     <FileText size={12} />
//                                     <span className="text-xs text-gray-300">{attachment}</span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>

//                           <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <button
//                               onClick={() => handleUpdateClick(announcement)}
//                               className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
//                               title="Update"
//                             >
//                               <Edit size={18} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteClick(announcement)}
//                               className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
//                               title="Delete"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                             <button
//                               onClick={() => toggleExpanded(announcement.id || index)}
//                               className="p-2 hover:bg-gray-500/20 text-gray-400 rounded-lg transition-colors"
//                               title={isExpanded ? "Collapse" : "Expand"}
//                             >
//                               {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <FormModal
//         show={showAddForm}
//         onClose={() => {
//           setShowAddForm(false);
//           resetForm();
//           setError('');
//           setSuccess('');
//         }}
//       />

//       <FormModal
//         isUpdate={true}
//         show={showUpdateForm}
//         onClose={() => {
//           setShowUpdateForm(false);
//           setSelectedAnnouncement(null);
//           resetForm();
//           setError('');
//           setSuccess('');
//         }}
//       />

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && selectedAnnouncement && (
//         <div 
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               setShowDeleteConfirm(false);
//               setSelectedAnnouncement(null);
//               setError('');
//               setSuccess('');
//             }
//           }}
//         >
//           <div 
//             className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-red-500/30 w-full max-w-md shadow-2xl shadow-red-500/10"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6 text-center">
//               <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Trash2 size={32} className="text-red-400" />
//               </div>
              
//               <h3 className="text-xl font-bold text-white mb-2">Delete Announcement</h3>
//               <p className="text-gray-400 mb-1">Are you sure you want to delete:</p>
//               <p className="text-white font-semibold mb-4">"{selectedAnnouncement.topic}"</p>
//               <p className="text-red-400 text-sm mb-6">This action cannot be undone.</p>

//               {(success || error) && (
//                 <div className={`mb-4 p-3 rounded-2xl border ${success ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-300' : 'bg-red-900/30 border-red-500/30 text-red-300'}`}>
//                   {success || error}
//                 </div>
//               )}

//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => {
//                     setShowDeleteConfirm(false);
//                     setSelectedAnnouncement(null);
//                     setError('');
//                     setSuccess('');
//                   }}
//                   disabled={loading}
//                   className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl transition-colors disabled:opacity-50"
//                   type="button"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteConfirm}
//                   disabled={loading}
//                   className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl transition-all disabled:opacity-50 flex items-center gap-2"
//                   type="button"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       <span>Deleting...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 size={16} />
//                       <span>Delete</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AnnouncementsManager;