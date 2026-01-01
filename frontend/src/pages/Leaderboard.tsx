import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Star, ArrowUp, Users, Loader2, MapPin } from 'lucide-react';
import { creditsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardEntry {
    uid: string;
    name: string;
    edu_credits: number;
    area: string;
    city: string;
}

const Leaderboard = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const data = await creditsApi.getLeaderboard();
            setEntries(data as LeaderboardEntry[]);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="h-6 w-6 text-yellow-500" />;
            case 1: return <Medal className="h-6 w-6 text-slate-400" />;
            case 2: return <Medal className="h-6 w-6 text-amber-600" />;
            default: return <span className="font-bold text-muted-foreground">{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Star className="h-4 w-4 fill-current" />
                            <span>EduCycle Excellence</span>
                        </div>
                        <h1 className="text-4xl font-display font-bold">EduCredit Leaderboard</h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Celebrating our top donors who are making education accessible for everyone.
                            Earn credits by sharing your books!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card variant="stat" className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                        <Trophy className="h-6 w-6 text-yellow-500" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">Top Contributor</p>
                                    <p className="text-xl font-bold">{entries[0]?.name || '---'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="stat" className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Star className="h-6 w-6 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">Global Credits</p>
                                    <p className="text-xl font-bold">
                                        {entries.reduce((acc, curr) => acc + curr.edu_credits, 0).toLocaleString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="stat" className="bg-gradient-to-br from-success/10 to-transparent border-success/20">
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-success" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Heroes</p>
                                    <p className="text-xl font-bold">{entries.length}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle>Top Donors</CardTitle>
                            <CardDescription>Rankings based on total EduCredits earned</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="py-12 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {entries.length === 0 ? (
                                        <p className="text-center py-8 text-muted-foreground">No donors found yet. Be the first!</p>
                                    ) : (
                                        entries.map((entry, index) => (
                                            <div
                                                key={entry.uid}
                                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${entry.uid === user?.uid
                                                        ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20'
                                                        : 'bg-card border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="w-8 flex justify-center">
                                                    {getRankIcon(index)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold truncate">{entry.name}</p>
                                                        {entry.uid === user?.uid && (
                                                            <Badge variant="secondary" className="text-[10px] h-4">YOU</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        <span className="truncate">{entry.area}, {entry.city}</span>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1 text-primary font-bold">
                                                        <span>{entry.edu_credits}</span>
                                                        <Star className="h-3 w-3 fill-current" />
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Credits</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Leaderboard;
