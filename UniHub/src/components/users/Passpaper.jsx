import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, ChevronLeft, Calendar, BookOpen, ExternalLink, Maximize2, AlertCircle } from 'lucide-react';
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

    const handlePaperView = (paper) => {
        setSelectedPaper(paper);
        setPdfError(false); // Reset error state
        setCurrentView('viewer');
    };

    const handleDownload = (paper) => {
        // Use the link or attachment field from the backend
        const downloadUrl = paper.link || paper.attachment;
        if (downloadUrl) {
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `PassPaper_${paper.year}_${paper.paperId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('No download link available for this paper.');
        }
    };

    const goBack = () => {
        if (currentView === 'papers') {
            setCurrentView('years');
            setSelectedYear(null);
        } else if (currentView === 'viewer') {
            setCurrentView('papers');
            setSelectedPaper(null);
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
                                    {paper.link && (
                                        <span className="flex items-center gap-1">
                                            <strong>Link Available:</strong> Yes
                                        </span>
                                    )}
                                    {paper.attachment && (
                                        <span className="flex items-center gap-1">
                                            <strong>Attachment Available:</strong> Yes
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {(paper.link || paper.attachment) && (
                                    <button
                                        onClick={() => handlePaperView(paper)}
                                        className="flex items-center gap-2 bg-[#191E29] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#2CC295] transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                )}
                                {(paper.link || paper.attachment) && (
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
        const fileUrl = selectedPaper?.link || selectedPaper?.attachment;

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
                            {fileUrl && (
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

                {/* PDF Viewer - Full Height */}
                <div className="flex-1 bg-gray-100">
                    {!fileUrl ? (
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
                        <iframe
                            id="pdf-iframe"
                            src={fileUrl}
                            width="100%"
                            height="100%"
                            title={`Pass Paper #${selectedPaper?.paperId}`}
                            className="w-full h-full border-0"
                            onError={() => setPdfError(true)}
                            onLoad={() => setPdfError(false)}
                        />
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