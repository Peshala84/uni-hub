import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Eye, ChevronLeft, Calendar, BookOpen, ExternalLink, Maximize2, AlertCircle, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

// API configuration
const API_BASE_URL = 'http://localhost:8086/api/v1';

const Passpaper = () => {
    const [currentView, setCurrentView] = useState('years'); // 'years', 'papers', 'viewer'
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [pdfError, setPdfError] = useState(false);
    const [passPapers, setPassPapers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Gemini chat states
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatMessagesRef = useRef(null);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Fetch pass papers from API
    useEffect(() => {
        fetchPassPapers();
    }, []);

    const fetchPassPapers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/student/pass-papers`);
            setPassPapers(response.data);
        } catch (err) {
            console.error('Error fetching pass papers:', err);
            setError('Failed to load pass papers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Get available years from the data
    const availableYears = Object.keys(passPapers).map(year => parseInt(year)).sort((a, b) => a - b);

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setCurrentView('papers');
    };

    const handlePaperView = async (paper) => {
        setSelectedPaper(paper);
        setPdfError(false); // Reset error state
        setCurrentView('viewer');

        // If the paper has blob data or needs to be fetched as blob
        if (paper.attachmentId || paper.blobUrl) {
            await fetchPaperBlob(paper);
        }
    };

    const fetchPaperBlob = async (paper) => {
        try {
            setLoading(true);
            let response;

            // If it's an attachment ID, fetch the blob
            if (paper.attachmentId) {
                response = await axios.get(`${API_BASE_URL}/student/pass-papers/${paper.attachmentId}/download`, {
                    responseType: 'blob'
                });
            } else if (paper.blobUrl) {
                response = await axios.get(paper.blobUrl, {
                    responseType: 'blob'
                });
            }

            if (response && response.data) {
                // Create blob URL for PDF viewing
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);

                // Update the selected paper with the blob URL
                setSelectedPaper(prev => ({
                    ...prev,
                    pdfBlobUrl: blobUrl
                }));
            }
        } catch (error) {
            console.error('Error fetching PDF blob:', error);
            setPdfError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (paper) => {
        try {
            let downloadUrl = paper.link || paper.attachment || paper.pdfBlobUrl;

            // If we need to fetch blob data for download
            if (paper.attachmentId && !downloadUrl) {
                const response = await axios.get(`${API_BASE_URL}/student/pass-papers/${paper.attachmentId}/download`, {
                    responseType: 'blob'
                });

                if (response.data) {
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    downloadUrl = URL.createObjectURL(blob);
                }
            }

            if (downloadUrl) {
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `PassPaper_${paper.year}_${paper.paperId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up blob URL if it was created temporarily
                if (downloadUrl.startsWith('blob:')) {
                    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
                }
            } else {
                alert('No download link available for this paper.');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading the PDF file.');
        }
    };

    // Cleanup blob URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (selectedPaper?.pdfBlobUrl) {
                URL.revokeObjectURL(selectedPaper.pdfBlobUrl);
            }
        };
    }, [selectedPaper?.pdfBlobUrl]);

    const goBack = () => {
        // Clean up blob URL when going back
        if (selectedPaper?.pdfBlobUrl) {
            URL.revokeObjectURL(selectedPaper.pdfBlobUrl);
        }

        if (currentView === 'papers') {
            setCurrentView('years');
            setSelectedYear(null);
        } else if (currentView === 'viewer') {
            setCurrentView('papers');
            setSelectedPaper(null);
            // Clear chat messages when leaving viewer
            setChatMessages([]);
            setChatInput('');
        }
    };

    // Gemini chat functionality
    const sendMessageToGemini = async () => {
        if (!chatInput.trim()) return;

        const userMessage = chatInput.trim();
        setChatInput('');
        setChatLoading(true);

        // Add user message to chat
        const newUserMessage = {
            id: Date.now(),
            type: 'user',
            content: userMessage,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, newUserMessage]);

        try {
            const response = await axios.post(`http://localhost:8086/api/v1/gemini/ask`,
                userMessage,  // Send as request body (string)
                {
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    timeout: 30000 // 30 second timeout
                }
            );

            let responseContent = '';

            // Handle different response formats
            if (typeof response.data === 'string') {
                responseContent = response.data;
            } else if (response.data && typeof response.data === 'object') {
                responseContent = response.data.response ||
                    response.data.answer ||
                    response.data.text ||
                    response.data.message ||
                    JSON.stringify(response.data);
            } else {
                responseContent = 'Sorry, I received an unexpected response format.';
            }

            // Add Gemini response to chat
            const geminiMessage = {
                id: Date.now() + 1,
                type: 'gemini',
                content: responseContent,
                timestamp: new Date()
            };

            setChatMessages(prev => [...prev, geminiMessage]);
        } catch (error) {
            console.error('Error sending message to Gemini:', error);

            let errorContent = 'Sorry, I encountered an error while processing your request. Please try again.';

            if (error.code === 'ECONNABORTED') {
                errorContent = 'Request timed out. Please try again with a shorter message.';
            } else if (error.response?.status === 404) {
                errorContent = 'Gemini service is not available. Please check if the server is running.';
            } else if (error.response?.status >= 500) {
                errorContent = 'Server error occurred. Please try again later.';
            } else if (!navigator.onLine) {
                errorContent = 'No internet connection. Please check your network.';
            }

            // Add error message to chat
            const errorMessage = {
                id: Date.now() + 1,
                type: 'error',
                content: errorContent,
                timestamp: new Date()
            };

            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleChatKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageToGemini();
        }
    };

    const renderYearSelection = () => {
        if (loading) {
            return (
                <div className="rounded-xl bg-[#F5F7FA] border border-[#E5E7EB] p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="w-8 h-8 text-[#2CC295]" />
                        <h2 className="text-2xl font-extrabold text-[#191E29] tracking-tight">Pass Papers</h2>
                    </div>
                    <div className="py-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CC295] mx-auto mb-4"></div>
                        <p className="text-[#696E79]">Loading pass papers...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="rounded-xl bg-[#F5F7FA] border border-[#E5E7EB] p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="w-8 h-8 text-[#2CC295]" />
                        <h2 className="text-2xl font-extrabold text-[#191E29] tracking-tight">Pass Papers</h2>
                    </div>
                    <div className="py-12 text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-red-800">Error Loading Pass Papers</h3>
                        <p className="mb-4 text-red-600">{error}</p>
                        <button
                            onClick={fetchPassPapers}
                            className="bg-[#2CC295] text-white px-6 py-2 rounded-lg hover:bg-[#191E29] transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        if (availableYears.length === 0) {
            return (
                <div className="rounded-xl bg-[#F5F7FA] border border-[#E5E7EB] p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="w-8 h-8 text-[#2CC295]" />
                        <h2 className="text-2xl font-extrabold text-[#191E29] tracking-tight">Pass Papers</h2>
                    </div>
                    <div className="py-12 text-center">
                        <FileText className="w-16 h-16 text-[#696E79] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-[#696E79] mb-2">No Pass Papers Available</h3>
                        <p className="text-[#696E79]">Pass papers will be available once they are uploaded.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="rounded-xl bg-[#F5F7FA] border border-[#E5E7EB] p-6">
                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-8 h-8 text-[#2CC295]" />
                    <h2 className="text-2xl font-extrabold text-[#191E29] tracking-tight">Pass Papers</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {availableYears.map((year) => (
                        <div
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-[#2CC295] group"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#2CC295] to-[#191E29] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl font-bold text-white">{year}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#191E29] group-hover:text-[#2CC295] transition-colors">Year {year}</h3>
                                    <p className="text-[#696E79] text-sm mt-1">
                                        {passPapers[year]?.length || 0} Past Papers Available
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderPapersList = () => (
        <div className="rounded-xl bg-[#F5F7FA] border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-[#696E79] hover:text-[#191E29] transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Years
                </button>
                <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-[#2CC295]" />
                    <h2 className="text-2xl font-extrabold text-[#191E29] tracking-tight">
                        Year {selectedYear} Past Papers
                    </h2>
                </div>
            </div>

            <div className="space-y-4">
                {passPapers[selectedYear]?.map((paper) => (
                    <div
                        key={paper.paperId}
                        className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-5 h-5 text-[#2CC295]" />
                                    <h3 className="text-lg font-semibold text-[#191E29]">
                                        Pass Paper #{paper.paperId} - Year {paper.year}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-[#696E79]">
                                    <span className="flex items-center gap-1">
                                        <strong>Paper ID:</strong> {paper.paperId}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <strong>Year:</strong> {paper.year}
                                    </span>
                                    {(paper.link || paper.attachment) && (
                                        <span className="flex items-center gap-1">
                                            <strong>Link Available:</strong> Yes
                                        </span>
                                    )}
                                    {(paper.attachment || paper.attachmentId) && (
                                        <span className="flex items-center gap-1">
                                            <strong>Attachment Available:</strong> Yes
                                        </span>
                                    )}
                                    {paper.blobUrl && (
                                        <span className="flex items-center gap-1">
                                            <strong>Blob Data:</strong> Available
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {(paper.link || paper.attachment || paper.attachmentId || paper.blobUrl) && (
                                    <button
                                        onClick={() => handlePaperView(paper)}
                                        className="flex items-center gap-2 bg-[#191E29] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#2CC295] transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                )}
                                {(paper.link || paper.attachment || paper.attachmentId || paper.blobUrl) && (
                                    <button
                                        onClick={() => handleDownload(paper)}
                                        className="flex items-center gap-2 bg-[#2CC295] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#191E29] transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {(!passPapers[selectedYear] || passPapers[selectedYear].length === 0) && (
                    <div className="py-12 text-center">
                        <FileText className="w-16 h-16 text-[#696E79] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-[#696E79] mb-2">No Papers Available</h3>
                        <p className="text-[#696E79]">No pass papers are available for Year {selectedYear} yet.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderPaperViewer = () => {
        const fileUrl = selectedPaper?.pdfBlobUrl || selectedPaper?.link || selectedPaper?.attachment;

        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-white">
                {/* Header Bar */}
                <div className="bg-[#F5F7FA] border-b border-[#E5E7EB] p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goBack}
                            className="flex items-center gap-2 text-[#696E79] hover:text-[#191E29] transition-colors font-medium"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back to Papers
                        </button>
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-[#2CC295]" />
                            <h2 className="text-lg font-bold text-[#191E29] truncate max-w-md">
                                Pass Paper #{selectedPaper?.paperId} - Year {selectedPaper?.year}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col text-right text-sm text-[#696E79]">
                            <span><strong>Paper ID:</strong> {selectedPaper?.paperId}</span>
                            <span><strong>Year:</strong> {selectedPaper?.year}</span>
                        </div>
                        <div className="flex gap-2">
                            {fileUrl && (
                                <button
                                    onClick={() => window.open(fileUrl, '_blank')}
                                    className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    New Tab
                                </button>
                            )}
                            {(fileUrl || selectedPaper?.attachmentId) && (
                                <button
                                    onClick={() => handleDownload(selectedPaper)}
                                    className="flex items-center gap-2 bg-[#2CC295] text-white px-4 py-2 rounded-lg hover:bg-[#191E29] transition-colors font-medium"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content - Split Layout */}
                <div className="flex flex-1 bg-gray-100">
                    {/* PDF Viewer - 75% width */}
                    <div className="w-3/4 bg-gray-100 border-r border-[#E5E7EB]">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="max-w-md p-8 mx-4 text-center bg-white shadow-lg rounded-xl">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CC295] mx-auto mb-4"></div>
                                    <h3 className="mb-2 text-lg font-semibold text-[#191E29]">Loading PDF...</h3>
                                    <p className="text-[#696E79]">Please wait while we load the PDF file.</p>
                                </div>
                            </div>
                        ) : !fileUrl && !selectedPaper?.attachmentId ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="max-w-md p-8 mx-4 text-center bg-white shadow-lg rounded-xl">
                                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
                                        <AlertCircle className="w-8 h-8 text-yellow-500" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-yellow-800">No File Available</h3>
                                    <p className="text-yellow-600">
                                        No file link or attachment is available for this pass paper.
                                    </p>
                                </div>
                            </div>
                        ) : !pdfError ? (
                            <div className="w-full h-full">
                                <iframe
                                    id="pdf-iframe"
                                    src={fileUrl + '#toolbar=1&navpanes=1&scrollbar=1'}
                                    width="100%"
                                    height="100%"
                                    title={`Pass Paper #${selectedPaper?.paperId}`}
                                    className="w-full h-full border-0"
                                    onError={() => setPdfError(true)}
                                    onLoad={() => setPdfError(false)}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="max-w-md p-8 mx-4 text-center bg-white shadow-lg rounded-xl">
                                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                                        <FileText className="w-8 h-8 text-red-500" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-red-800">PDF Loading Error</h3>
                                    <p className="mb-4 text-red-600">
                                        Unable to display PDF in browser. This might be due to browser restrictions or CORS policies.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => window.open(fileUrl, '_blank')}
                                            className="flex items-center justify-center gap-2 px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Open in New Tab
                                        </button>
                                        <button
                                            onClick={() => handleDownload(selectedPaper)}
                                            className="flex items-center justify-center gap-2 bg-[#2CC295] text-white px-4 py-2 rounded-lg hover:bg-[#191E29] transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Gemini Chat - 25% width */}
                    <div className="flex flex-col w-1/4 bg-white">
                        {/* Chat Header */}
                        {/* <div className="bg-[#2CC295] text-white p-4 border-b">
                            <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5" />
                                <h3 className="font-semibold">Chat with Gemini</h3>
                            </div>
                            <p className="mt-1 text-xs opacity-90">Ask questions about the paper</p>
                        </div> */}

                        {/* Chat Messages */}
                        <div ref={chatMessagesRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                            {chatMessages.length === 0 ? (
                                <div className="text-center text-[#696E79] py-8">
                                    <Bot className="w-12 h-12 mx-auto mb-3 text-[#2CC295]" />
                                    <p className="text-sm">Start a conversation with Gemini!</p>
                                    <p className="mt-1 text-xs">Ask questions about the past paper.</p>
                                </div>
                            ) : (
                                chatMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.type !== 'user' && (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'error' ? 'bg-red-100' : 'bg-[#2CC295]'
                                                }`}>
                                                {message.type === 'error' ? (
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                ) : (
                                                    <Bot className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[85%] p-3 rounded-lg text-sm ${message.type === 'user'
                                                    ? 'bg-[#2CC295] text-white rounded-br-sm'
                                                    : message.type === 'error'
                                                        ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm'
                                                        : 'bg-gray-100 text-[#191E29] rounded-bl-sm'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                            <div className={`text-xs mt-1 opacity-70 ${message.type === 'user' ? 'text-right' : 'text-left'
                                                }`}>
                                                {message.timestamp.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                        {message.type === 'user' && (
                                            <div className="w-8 h-8 bg-[#191E29] rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            {chatLoading && (
                                <div className="flex justify-start gap-2">
                                    <div className="w-8 h-8 bg-[#2CC295] rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="p-3 bg-gray-100 rounded-lg rounded-bl-sm">
                                        <div className="flex space-x-1">
                                            <div key="dot-1" className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div key="dot-2" className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div key="dot-3" className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="border-t border-[#E5E7EB] p-4">
                            <div className="flex gap-2">
                                <textarea
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyPress={handleChatKeyPress}
                                    placeholder="Ask Gemini about the paper..."
                                    className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2CC295] focus:border-transparent"
                                    rows="2"
                                    disabled={chatLoading}
                                />
                                <button
                                    onClick={sendMessageToGemini}
                                    disabled={!chatInput.trim() || chatLoading}
                                    className="px-4 py-2 bg-[#2CC295] text-white rounded-lg hover:bg-[#191E29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-[#696E79] mt-2">Press Enter to send, Shift+Enter for new line</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={currentView === 'viewer' ? '' : 'p-4 mx-auto max-w-7xl'}>
            {currentView === 'years' && renderYearSelection()}
            {currentView === 'papers' && renderPapersList()}
            {currentView === 'viewer' && renderPaperViewer()}
        </div>
    );
};

export default Passpaper;