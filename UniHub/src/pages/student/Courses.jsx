import { GraduationCap, BookOpen, Timer, Calculator, CheckSquare, Calendar, StickyNote, Clock } from 'lucide-react';




import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StudentQueries from './StudentQueries';
import Resources from './Resources';
import FeedbackForum from './FeedbackForum';
import axios from 'axios';




const StudentCourses = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [activeTab, setActiveTab] = useState('queries');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { studentId } = useParams();
    // const studentIdNum = parseInt(studentId, 10);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            console.log('Fetching courses for studentId:', studentId);
            try {
                const response = await axios.get(`http://localhost:8086/api/v1/student/${studentId}/courses`);
                console.log('Fetched courses response:', response);
                // Adjust the response data path if needed
                console.log('Courses array:', response.data);
                setCourses(response.data);
            } catch (err) {
                setError('Failed to load courses');
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [studentId]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'queries':
                return <StudentQueries courseId={selectedCourse} studentId={studentId} />;
            case 'resources':
                return <Resources courseId={selectedCourse} />;
            case 'feedback':
                return <FeedbackForum courseId={selectedCourse} studentId={studentId} />;
            case 'gpa-calculator':
                return <GPACalculator />;
            case 'todo-list':
                return <TodoList />;
            case 'study-schedule':
                return <StudySchedule />;
            case 'quick-notes':
                return <QuickNotes />;
            default:
                return null;
        }
    };

    // GPA Calculator Component
    const GPACalculator = () => {
        const [subjects, setSubjects] = useState([{ name: '', credits: '', grade: '' }]);
        const [gpa, setGPA] = useState(null);

        const gradePoints = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        };

        const addSubject = () => {
            setSubjects([...subjects, { name: '', credits: '', grade: '' }]);
        };

        const updateSubject = (index, field, value) => {
            const updated = subjects.map((subject, i) => 
                i === index ? { ...subject, [field]: value } : subject
            );
            setSubjects(updated);
        };

        const calculateGPA = () => {
            let totalCredits = 0;
            let totalPoints = 0;

            subjects.forEach(subject => {
                if (subject.credits && subject.grade) {
                    const credits = parseFloat(subject.credits);
                    const points = gradePoints[subject.grade] || 0;
                    totalCredits += credits;
                    totalPoints += credits * points;
                }
            });

            setGPA(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0);
        };

        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-[#132D46] mb-6">GPA Calculator</h3>
                {subjects.map((subject, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Subject name"
                            value={subject.name}
                            onChange={(e) => updateSubject(index, 'name', e.target.value)}
                            className="border-2 border-[#191E29]/20 rounded-lg px-3 py-2"
                        />
                        <input
                            type="number"
                            placeholder="Credits"
                            value={subject.credits}
                            onChange={(e) => updateSubject(index, 'credits', e.target.value)}
                            className="border-2 border-[#191E29]/20 rounded-lg px-3 py-2"
                        />
                        <select
                            value={subject.grade}
                            onChange={(e) => updateSubject(index, 'grade', e.target.value)}
                            className="border-2 border-[#191E29]/20 rounded-lg px-3 py-2"
                        >
                            <option value="">Select Grade</option>
                            {Object.keys(gradePoints).map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setSubjects(subjects.filter((_, i) => i !== index))}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={addSubject}
                        className="bg-[#2CC295] text-white px-6 py-2 rounded-lg hover:bg-[#2CC295]/90"
                    >
                        Add Subject
                    </button>
                    <button
                        onClick={calculateGPA}
                        className="bg-[#132D46] text-white px-6 py-2 rounded-lg hover:bg-[#132D46]/90"
                    >
                        Calculate GPA
                    </button>
                </div>
                {gpa !== null && (
                    <div className="mt-6 p-4 bg-[#2CC295]/10 rounded-lg">
                        <h4 className="text-xl font-bold text-[#132D46]">Your GPA: {gpa}</h4>
                    </div>
                )}
            </div>
        );
    };

    // Todo List Component
    const TodoList = () => {
        const [tasks, setTasks] = useState(() => {
            const savedTasks = localStorage.getItem('unihub-todo-tasks');
            return savedTasks ? JSON.parse(savedTasks) : [];
        });
        const [newTask, setNewTask] = useState('');

        // Save tasks to localStorage whenever tasks change
        React.useEffect(() => {
            localStorage.setItem('unihub-todo-tasks', JSON.stringify(tasks));
        }, [tasks]);

        const addTask = () => {
            if (newTask.trim()) {
                const newTaskItem = { id: Date.now(), text: newTask, completed: false };
                setTasks([...tasks, newTaskItem]);
                setNewTask('');
            }
        };

        const toggleTask = (id) => {
            setTasks(tasks.map(task => 
                task.id === id ? { ...task, completed: !task.completed } : task
            ));
        };

        const deleteTask = (id) => {
            setTasks(tasks.filter(task => task.id !== id));
        };

        const clearAllTasks = () => {
            if (window.confirm('Are you sure you want to clear all tasks?')) {
                setTasks([]);
            }
        };

        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-[#132D46] mb-6">To-Do List</h3>
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        className="flex-1 border-2 border-[#191E29]/20 rounded-lg px-4 py-2"
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    />
                    <button
                        onClick={addTask}
                        className="bg-[#2CC295] text-white px-6 py-2 rounded-lg hover:bg-[#2CC295]/90"
                    >
                        Add
                    </button>
                    {tasks.length > 0 && (
                        <button
                            onClick={clearAllTasks}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Clear All
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="w-5 h-5"
                            />
                            <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-[#132D46]'}`}>
                                {task.text}
                            </span>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No tasks yet. Add one above!</p>
                    )}
                    {tasks.length > 0 && (
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            Total: {tasks.length} tasks | Completed: {tasks.filter(t => t.completed).length}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Study Schedule Component
    const StudySchedule = () => {
        const [schedule, setSchedule] = useState(() => {
            const savedSchedule = localStorage.getItem('unihub-study-schedule');
            return savedSchedule ? JSON.parse(savedSchedule) : [];
        });
        const [newEvent, setNewEvent] = useState({ subject: '', time: '', duration: '' });

        // Save schedule to localStorage whenever schedule changes
        React.useEffect(() => {
            localStorage.setItem('unihub-study-schedule', JSON.stringify(schedule));
        }, [schedule]);

        const addEvent = () => {
            if (newEvent.subject && newEvent.time && newEvent.duration) {
                const newScheduleEvent = { ...newEvent, id: Date.now(), date: new Date().toDateString() };
                setSchedule([...schedule, newScheduleEvent]);
                setNewEvent({ subject: '', time: '', duration: '' });
            }
        };

        const deleteEvent = (id) => {
            setSchedule(schedule.filter(event => event.id !== id));
        };

        const clearSchedule = () => {
            if (window.confirm('Are you sure you want to clear all scheduled events?')) {
                setSchedule([]);
            }
        };

        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-[#132D46] mb-6">Study Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Subject"
                        value={newEvent.subject}
                        onChange={(e) => setNewEvent({...newEvent, subject: e.target.value})}
                        className="border-2 border-[#191E29]/20 rounded-lg px-3 py-2"
                    />
                    <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="border-2 border-[#191E29]/20 rounded-lg px-3 py-2"
                    />
                    <input
                        type="text"
                        placeholder="Duration (e.g., 2 hours)"
                        value={newEvent.duration}
                        onChange={(e) => setNewEvent({...newEvent, duration: e.target.value})}
                        className="border-2 border-[#191E29]/20 rounded-lg px-3 py-2"
                    />
                    <button
                        onClick={addEvent}
                        className="bg-[#2CC295] text-white px-4 py-2 rounded-lg hover:bg-[#2CC295]/90"
                    >
                        Add
                    </button>
                </div>
                {schedule.length > 0 && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={clearSchedule}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                        >
                            Clear All
                        </button>
                    </div>
                )}
                <div className="space-y-3">
                    {schedule.map(event => (
                        <div key={event.id} className="flex items-center justify-between p-4 bg-[#F8FFFE] rounded-lg border border-[#2CC295]/20">
                            <div>
                                <h4 className="font-bold text-[#132D46]">{event.subject}</h4>
                                <p className="text-[#696E79]">{event.time} - {event.duration}</p>
                                {event.date && <p className="text-xs text-gray-500">Added: {event.date}</p>}
                            </div>
                            <button
                                onClick={() => deleteEvent(event.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {schedule.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No study sessions scheduled yet.</p>
                    )}
                    {schedule.length > 0 && (
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            Total scheduled sessions: {schedule.length}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Quick Notes Component
    const QuickNotes = () => {
        const [notes, setNotes] = useState(() => {
            const savedNotes = localStorage.getItem('unihub-quick-notes');
            return savedNotes ? JSON.parse(savedNotes) : [];
        });
        const [newNote, setNewNote] = useState('');

        // Save notes to localStorage whenever notes change
        React.useEffect(() => {
            localStorage.setItem('unihub-quick-notes', JSON.stringify(notes));
        }, [notes]);

        const addNote = () => {
            if (newNote.trim()) {
                const newNoteItem = { 
                    id: Date.now(), 
                    text: newNote, 
                    timestamp: new Date().toLocaleString(),
                    date: new Date().toDateString()
                };
                setNotes([newNoteItem, ...notes]); // Add new notes at the top
                setNewNote('');
            }
        };

        const deleteNote = (id) => {
            setNotes(notes.filter(note => note.id !== id));
        };

        const clearAllNotes = () => {
            if (window.confirm('Are you sure you want to delete all notes?')) {
                setNotes([]);
            }
        };

        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-[#132D46] mb-6">Quick Notes</h3>
                <div className="mb-6">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write your note here..."
                        className="w-full h-24 border-2 border-[#191E29]/20 rounded-lg px-4 py-2 resize-none"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={addNote}
                            className="bg-[#2CC295] text-white px-6 py-2 rounded-lg hover:bg-[#2CC295]/90"
                        >
                            Add Note
                        </button>
                        {notes.length > 0 && (
                            <button
                                onClick={clearAllNotes}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
                <div className="space-y-3">
                    {notes.map(note => (
                        <div key={note.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm text-gray-500">{note.timestamp}</span>
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-[#132D46] whitespace-pre-wrap">{note.text}</p>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No notes yet. Add one above!</p>
                    )}
                    {notes.length > 0 && (
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            Total notes: {notes.length}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FFFE] via-[#FFFFFF] to-[#F0FFF4] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#132D46] to-[#191E29] rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2CC295]/10 to-transparent"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                        <div className="bg-[#2CC295] p-4 rounded-2xl shadow-lg">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">My Learning Hub</h1>
                            <p className="text-[#FFFFFF]/80 text-lg font-medium">Explore courses, connect with peers, and enhance your learning journey</p>
                        </div>
                    </div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#2CC295]/20 rounded-full blur-2xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#2CC295]/10 rounded-full blur-3xl"></div>
                </div>

                {/* Course Selection */}
                <div className="mb-8">
                    <label className="block text-lg font-semibold text-[#132D46] mb-2">Select a Course</label>
                    {loading ? (
                        <div className="text-[#2CC295] font-medium">Loading courses...</div>
                    ) : error ? (
                        <div className="text-red-500 font-medium">{error}</div>
                    ) : (
                        courses.length === 0 ? (
                            <div className="text-[#696E79] font-medium">No courses available.</div>
                        ) : (
                            <select
                                value={selectedCourse}
                                onChange={e => setSelectedCourse(e.target.value)}
                                className="w-full md:w-1/2 border-2 border-[#2CC295]/30 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200"
                            >
                                <option value="">-- Choose a course --</option>
                                {courses.map((course, idx) => {
                                    console.log('Course object:', course);
                                    return (
                                        <option key={course.courseId || course.id || idx} value={course.courseId || course.id}>
                                            {course.name || course.courseName || course.title || JSON.stringify(course)}
                                        </option>
                                    );
                                })}
                            </select>
                        )
                    )}
                </div>

                {/* Student Tools - Show at top when no course selected */}
                {!selectedCourse && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[#132D46] mb-6">Student Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                 onClick={() => window.open('https://pomofocus.io', '_blank')}>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl">
                                        <Timer className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#132D46] text-lg">Study Timer</h3>
                                        <p className="text-[#696E79] font-medium">Pomodoro Focus</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                 onClick={() => setActiveTab('gpa-calculator')}>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-[#132D46] to-[#191E29] p-3 rounded-xl">
                                        <Calculator className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#132D46] text-lg">GPA Calculator</h3>
                                        <p className="text-[#696E79] font-medium">Calculate GPA</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                 onClick={() => setActiveTab('todo-list')}>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-[#696E79] to-[#132D46] p-3 rounded-xl">
                                        <CheckSquare className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#132D46] text-lg">To-Do List</h3>
                                        <p className="text-[#696E79] font-medium">Manage Tasks</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Tools Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                 onClick={() => setActiveTab('study-schedule')}>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-[#2CC295] to-[#132D46] p-3 rounded-xl">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#132D46] text-lg">Study Planner</h3>
                                        <p className="text-[#696E79] font-medium">Plan Your Studies</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                 onClick={() => setActiveTab('quick-notes')}>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-[#191E29] to-[#2CC295] p-3 rounded-xl">
                                        <StickyNote className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#132D46] text-lg">Quick Notes</h3>
                                        <p className="text-[#696E79] font-medium">Jot Down Ideas</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tool Content Area */}
                        {(activeTab === 'gpa-calculator' || activeTab === 'todo-list' || activeTab === 'study-schedule' || activeTab === 'quick-notes') && (
                            <div className="mt-6 p-8 bg-gradient-to-br from-[#F8FFFE] to-[#F0FFF4] rounded-2xl border border-[#2CC295]/20 min-h-[500px] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2CC295]/10 to-transparent rounded-full blur-xl"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#132D46]/5 to-transparent rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    {renderTabContent()}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Show helpful message when no course is selected */}
                {!selectedCourse && (
                    <div className="text-center py-8">
                        <p className="text-[#696E79] text-lg">Select a course above to access course-specific features like queries, resources, and feedback forum.</p>
                    </div>
                )}

                {/* Show navigation and tabs only if a course is selected */}
                {selectedCourse && (
                    <>
                        <h2 className="text-2xl font-bold text-[#132D46] mb-6">Course Content</h2>
                        {/* Navigation Buttons */}
                        <div className="flex space-x-2 mb-6">
                            <button
                                className={`px-4 py-2 rounded-xl font-semibold text-sm border border-[#2CC295]/30 transition ${activeTab === 'queries' ? 'bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white shadow-lg' : 'bg-white text-[#2CC295] hover:bg-[#2CC295]/10'}`}
                                onClick={() => setActiveTab('queries')}
                            >Queries</button>
                            <button
                                className={`px-4 py-2 rounded-xl font-semibold text-sm border border-[#2CC295]/30 transition ${activeTab === 'resources' ? 'bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white shadow-lg' : 'bg-white text-[#2CC295] hover:bg-[#2CC295]/10'}`}
                                onClick={() => setActiveTab('resources')}
                            >Resources</button>
                            <button
                                className={`px-4 py-2 rounded-xl font-semibold text-sm border border-[#2CC295]/30 transition ${activeTab === 'feedback' ? 'bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white shadow-lg' : 'bg-white text-[#2CC295] hover:bg-[#2CC295]/10'}`}
                                onClick={() => setActiveTab('feedback')}
                            >Feedback Forum</button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-8 bg-gradient-to-br from-[#F8FFFE] to-[#F0FFF4] rounded-2xl border border-[#2CC295]/20 min-h-[500px] relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2CC295]/10 to-transparent rounded-full blur-xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#132D46]/5 to-transparent rounded-full blur-2xl"></div>
                            {/* Content wrapper */}
                            <div className="relative z-10">
                                {renderTabContent()}
                            </div>
                        </div>
                    </>
                )}

                {/* Student Tools - Show at bottom when course is selected */}
                {selectedCourse && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-[#132D46] mb-6">Student Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                 onClick={() => window.open('https://pomofocus.io', '_blank')}>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl">
                                        <Timer className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#132D46] text-lg">Study Timer</h3>
                                        <p className="text-[#696E79] font-medium">Pomodoro Focus</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                 onClick={() => setActiveTab('gpa-calculator')}>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-[#132D46] to-[#191E29] p-3 rounded-xl">
                                        <Calculator className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#132D46] text-lg">GPA Calculator</h3>
                                        <p className="text-[#696E79] font-medium">Calculate GPA</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                 onClick={() => setActiveTab('todo-list')}>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-[#696E79] to-[#132D46] p-3 rounded-xl">
                                        <CheckSquare className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#132D46] text-lg">To-Do List</h3>
                                        <p className="text-[#696E79] font-medium">Manage Tasks</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Tools Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                 onClick={() => setActiveTab('study-schedule')}>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-[#2CC295] to-[#132D46] p-3 rounded-xl">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#132D46] text-lg">Study Planner</h3>
                                        <p className="text-[#696E79] font-medium">Plan Your Studies</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/5 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                 onClick={() => setActiveTab('quick-notes')}>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-[#191E29] to-[#2CC295] p-3 rounded-xl">
                                        <StickyNote className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#132D46] text-lg">Quick Notes</h3>
                                        <p className="text-[#696E79] font-medium">Jot Down Ideas</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tool Content Area */}
                        {(activeTab === 'gpa-calculator' || activeTab === 'todo-list' || activeTab === 'study-schedule' || activeTab === 'quick-notes') && (
                            <div className="mt-6 p-8 bg-gradient-to-br from-[#F8FFFE] to-[#F0FFF4] rounded-2xl border border-[#2CC295]/20 min-h-[500px] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2CC295]/10 to-transparent rounded-full blur-xl"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#132D46]/5 to-transparent rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    {renderTabContent()}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Show course-related tools only when course is NOT selected */}
                {!selectedCourse && (
                    <div className="text-center py-8">
                        <p className="text-[#696E79] text-lg">Select a course above to access course-specific features like queries, resources, and feedback forum.</p>
                    </div>
                )}
            </div>

            {/* Floating action elements for visual appeal */}
            <div className="fixed top-20 right-10 w-4 h-4 bg-[#2CC295]/30 rounded-full animate-pulse"></div>
            <div className="fixed bottom-32 left-10 w-6 h-6 bg-[#132D46]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
    );
};

export default StudentCourses;
