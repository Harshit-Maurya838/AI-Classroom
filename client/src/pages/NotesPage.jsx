import React, { useState } from 'react';
import { Calendar, Edit, Trash, Plus, BookOpen, RefreshCw } from 'lucide-react';
import { mockNotes } from '../utils/mockData';
import  Card, { CardContent } from '../components/ui/Card';
import  Badge  from '../components/ui/Badge';
import  Input  from '../components/ui/Input';
import  Button  from '../components/ui/Button';
import  Textarea  from '../components/ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/Dialog';

export default function Notes() {
  const [notes, setNotes] = useState(mockNotes);
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (note) => {
    setSelectedNote(note);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleSave = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === selectedNote.id ? selectedNote : note
      )
    );
    setSelectedNote(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          My Notes
        </h1>
        <Button size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <Input
        placeholder="Search notes..."
        value={search}
        onChange={handleSearchChange}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <Card key={note.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{note.title}</h2>
                  <p className="text-sm text-gray-500">{note.content}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(note)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Note</DialogTitle>
                      </DialogHeader>
                      <Input
                        value={selectedNote?.title || ''}
                        onChange={(e) =>
                          setSelectedNote({
                            ...selectedNote,
                            title: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        value={selectedNote?.content || ''}
                        onChange={(e) =>
                          setSelectedNote({
                            ...selectedNote,
                            content: e.target.value,
                          })
                        }
                      />
                      <Button onClick={handleSave}>Save</Button>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {note.date}
                </span>
                <Badge>{note.tag}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="fixed bottom-4 right-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Title"
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Content"
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, content: e.target.value })
              }
            />
            <Button
              onClick={() => {
                const newNote = {
                  id: Date.now(),
                  title: selectedNote?.title || '',
                  content: selectedNote?.content || '',
                  date: new Date().toLocaleDateString(),
                  tag: 'new',
                };
                setNotes([...notes, newNote]);
                setSelectedNote(null);
              }}
            >
              Add
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
