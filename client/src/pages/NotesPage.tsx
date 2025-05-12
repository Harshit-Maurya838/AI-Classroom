import React, { useState } from 'react';
import { Calendar, Edit, Trash, Plus, BookOpen, RefreshCw } from 'lucide-react';
import { mockNotes } from '../utils/mockData';
import { Note } from '../types';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  
  const handleEditNote = (note: Note) => {
    setActiveNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };
  
  const handleSaveNote = () => {
    if (!activeNote) return;
    
    const updatedNotes = notes.map(note => 
      note.id === activeNote.id 
        ? { ...note, title: editTitle, content: editContent }
        : note
    );
    
    setNotes(updatedNotes);
    setIsEditing(false);
  };
  
  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (activeNote?.id === noteId) {
      setActiveNote(null);
      setIsEditing(false);
    }
  };
  
  const handleAddNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: 'Start typing your note here...',
      createdAt: new Date(),
      revisionDates: [
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ],
    };
    
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
  };
  
  const formatRevisionDate = (date: Date) => {
    const today = new Date();
    const revisionDate = new Date(date);
    
    // Calculate difference in days
    const diffTime = Math.abs(revisionDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return revisionDate.toLocaleDateString();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Notes & Revision
          </h1>
          
          <button 
            onClick={handleAddNote}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="font-medium text-gray-700">Your Notes</h2>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {notes.length > 0 ? (
                  notes.map(note => (
                    <div
                      key={note.id}
                      className={`p-4 cursor-pointer transition-colors duration-200 ${
                        activeNote?.id === note.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveNote(note)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-800 line-clamp-1">{note.title}</h3>
                        <div className="flex space-x-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditNote(note);
                            }}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note.id);
                            }}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{note.content}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No notes yet</p>
                    <button
                      onClick={handleAddNote}
                      className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Create your first note
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Note Content / Editor */}
          <div className="md:col-span-2">
            {activeNote ? (
              <div className="bg-white rounded-lg shadow-sm h-full">
                {isEditing ? (
                  <div className="p-6 h-full flex flex-col">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xl font-semibold text-gray-800 mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Note title"
                    />
                    
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 w-full p-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Start typing your note here..."
                    ></textarea>
                    
                    <div className="flex justify-end mt-4 space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{activeNote.title}</h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditNote(activeNote)}
                          className="p-1 text-gray-500 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(activeNote.id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      <p className="text-gray-700">{activeNote.content}</p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <RefreshCw className="h-4 w-4 mr-1 text-blue-500" />
                        Revision Schedule
                      </h3>
                      
                      <div className="space-y-2">
                        {activeNote.revisionDates.map((date, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-blue-700 text-sm">{formatRevisionDate(date)}</span>
                            </div>
                            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
                              Revise Now
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-blue-400" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Note Selected</h3>
                  <p className="text-gray-600 mb-4">
                    Select a note from the list or create a new one to get started.
                  </p>
                  <button
                    onClick={handleAddNote}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;