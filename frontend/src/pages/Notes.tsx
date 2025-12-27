import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, FileText, File } from 'lucide-react';
import { mockNotes, subjectOptions, classOptions } from '@/data/mockData';

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    const matchesClass = !selectedClass || note.class === selectedClass;
    
    return matchesSearch && matchesSubject && matchesClass;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" userName="Alex" />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Notes & PDFs</h1>
          <p className="text-muted-foreground">
            Free study materials shared by students and teachers
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Subject</label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedSubject ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedSubject('')}
              >
                All
              </Badge>
              {subjectOptions.slice(0, 4).map(subject => (
                <Badge
                  key={subject}
                  variant={selectedSubject === subject ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedSubject(selectedSubject === subject ? '' : subject)}
                >
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Class</label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedClass ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedClass('')}
              >
                All
              </Badge>
              {['9', '10', '11', '12'].map(cls => (
                <Badge
                  key={cls}
                  variant={selectedClass === cls ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedClass(selectedClass === cls ? '' : cls)}
                >
                  Class {cls}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <Card key={note.id} variant="elevated" className="group">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    note.type === 'PDF' ? 'bg-destructive/10' : 'bg-accent/10'
                  }`}>
                    {note.type === 'PDF' ? (
                      <File className="h-6 w-6 text-destructive" />
                    ) : (
                      <FileText className="h-6 w-6 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-sm line-clamp-2 mb-1">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>{note.subject}</span>
                      <span>•</span>
                      <span>Class {note.class}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {note.downloads.toLocaleString()} downloads
                      </span>
                      <Badge variant="muted" className="text-xs">
                        {note.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">No notes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Notes;
