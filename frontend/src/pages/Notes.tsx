import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, FileText, File, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import { subjectOptions, classOptions } from '@/data/mockData';
import { notesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';

const Notes = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  // Upload state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadClass, setUploadClass] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [selectedSubject, selectedClass]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedSubject) filters.subject = selectedSubject;
      if (selectedClass) filters.class_level = selectedClass;

      const data = await notesApi.list(filters);
      setNotes(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching notes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadSubject || !uploadClass || !uploadFile) {
      toast({
        title: "Missing fields",
        description: "Please fill all fields and select a file",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadLoading(true);
      const noteData = {
        title: uploadTitle,
        subject: uploadSubject,
        class_level: uploadClass,
        type: uploadFile.type === 'application/pdf' ? 'PDF' : 'Notes',
        downloads: 0
      };

      await notesApi.upload(noteData, uploadFile);

      toast({
        title: "Success",
        description: "Notes uploaded successfully!",
      });

      setIsUploadOpen(false);
      // Reset form
      setUploadTitle('');
      setUploadSubject('');
      setUploadClass('');
      setUploadFile(null);

      // Refresh list
      fetchNotes();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
        await notesApi.delete(noteId);
        toast({ title: "Note deleted", description: "The note has been removed." });
        fetchNotes();
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    const matchesClass = !selectedClass || note.class_level === selectedClass;

    return matchesSearch && matchesSubject && matchesClass;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" />

      <main className="flex-1 container py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Notes & PDFs</h1>
            <p className="text-muted-foreground">
              Free study materials shared by students and teachers
            </p>
          </div>

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Notes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Study Material</DialogTitle>
                <DialogDescription>
                  Share your notes or PDFs to help fellow students.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input
                    placeholder="e.g. Class 10 Math Formula Sheet"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Subject</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={uploadSubject}
                      onChange={(e) => setUploadSubject(e.target.value)}
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Class</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={uploadClass}
                      onChange={(e) => setUploadClass(e.target.value)}
                      required
                    >
                      <option value="">Select Class</option>
                      {classOptions.map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">File (PDF or Image)</label>
                  <Input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={uploadLoading}>
                  {uploadLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  {uploadLoading ? "Uploading..." : "Start Upload"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6 mb-8 p-4 bg-muted/30 rounded-xl">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Filter by Subject</label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedSubject ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setSelectedSubject('')}
              >
                All Subjects
              </Badge>
              {subjectOptions.slice(0, 6).map(subject => (
                <Badge
                  key={subject}
                  variant={selectedSubject === subject ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1"
                  onClick={() => setSelectedSubject(selectedSubject === subject ? '' : subject)}
                >
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Filter by Class</label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedClass ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setSelectedClass('')}
              >
                All Classes
              </Badge>
              {classOptions.map(cls => (
                <Badge
                  key={cls}
                  variant={selectedClass === cls ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1"
                  onClick={() => setSelectedClass(selectedClass === cls ? '' : cls)}
                >
                  Class {cls}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <Card key={note.id} variant="elevated" className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
                <div className={`h-1.5 w-full ${note.type === 'PDF' ? 'bg-destructive/40' : 'bg-accent/40'}`} />
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${note.type === 'PDF' ? 'bg-destructive/5' : 'bg-accent/5'
                      }`}>
                      {note.type === 'PDF' ? (
                        <File className="h-7 w-7 text-destructive" />
                      ) : (
                        <FileText className="h-7 w-7 text-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {note.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
                        <span className="bg-muted px-2 py-0.5 rounded">{note.subject}</span>
                        <span>•</span>
                        <span>Class {note.class_level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">Downloads</span>
                      <span className="text-sm font-bold">{note.downloads || 0}</span>
                    </div>
                    <div className="flex gap-2">
                       {user && note.owner_uid === user.uid && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="gap-2 shadow-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                if (confirm('Are you sure you want to delete this note?')) {
                                    handleDelete(note.id);
                                }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                       )}
                       <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="block !w-auto">
                        <Button size="sm" className="gap-2 shadow-sm">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                       </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredNotes.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">No notes found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              We couldn't find any notes matching your search or filters.
            </p>
            <Button variant="link" className="mt-2" onClick={() => { setSearchQuery(''); setSelectedSubject(''); setSelectedClass('') }}>
              Clear all filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Notes;
