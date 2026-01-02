import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, MapPin, Users, MessageCircle, AlertTriangle, Phone, CheckCircle, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SafetyGuidelines = () => {
    const { role } = useAuth();
    const userType = role || 'student';

    const guidelines = [
        {
            icon: MapPin,
            title: "Meet in Public Places",
            description: "Always arrange book pickups in safe, public locations like schools, libraries, coffee shops, or shopping malls. Avoid private residences or secluded areas.",
            color: "text-blue-500",
            bgColor: "bg-blue-50"
        },
        {
            icon: Users,
            title: "Bring a Friend",
            description: "It's always safer to bring a friend or family member along for the handover. There is safety in numbers.",
            color: "text-purple-500",
            bgColor: "bg-purple-50"
        },
        {
            icon: MessageCircle,
            title: "Keep Chat in App",
            description: "Use the EduCycle in-app chat for all coordination. Avoid sharing personal phone numbers or social media handles until you trust the other person.",
            color: "text-green-500",
            bgColor: "bg-green-50"
        },
        {
            icon: Eye,
            title: "Check Profiles",
            description: "Review the other user's profile and ratings before agreeing to meet. Verified NGOs will have a verification badge.",
            color: "text-orange-500",
            bgColor: "bg-orange-50"
        },
        {
            icon: Shield,
            title: "Secure Handover PIN",
            description: "Always use the 4-digit Handover PIN to confirm the transaction. Do not hand over the book until the recipient can prove they have the correct PIN.",
            color: "text-indigo-500",
            bgColor: "bg-indigo-50"
        },
        {
            icon: AlertTriangle,
            title: "Trust Your Instincts",
            description: "If you feel uncomfortable at any point, cancel the meeting. Your safety is more important than a book transaction.",
            color: "text-red-500",
            bgColor: "bg-red-50"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header userType={role} />

            <main className="flex-1 container py-12 max-w-5xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <Shield className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Community Safety Guidelines</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        EduCycle is built on trust, but safety comes first. Please follow these guidelines to ensure a secure and positive experience for everyone.
                    </p>
                </div>

                {/* Guidelines Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {guidelines.map((guide, index) => (
                        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className={`w-12 h-12 rounded-xl ${guide.bgColor} flex items-center justify-center mb-4`}>
                                    <guide.icon className={`h-6 w-6 ${guide.color}`} />
                                </div>
                                <CardTitle className="text-xl font-bold">{guide.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 leading-relaxed">
                                    {guide.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Emergency Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6 text-warning" />
                            Reporting & Emergencies
                        </h2>
                        <p className="text-slate-600 mb-4">
                            If you encounter any suspicious behavior, harassment, or unsafe situations, please report it to us immediately via the feedback form or email support.
                        </p>
                        <p className="font-medium text-slate-900">
                            In case of immediate danger, always contact local authorities.
                        </p>
                    </div>
                    <div className="flex-shrink-0 bg-rose-50 p-6 rounded-xl border border-rose-100 text-center min-w-[200px]">
                        <div className="mx-auto w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                            <Phone className="h-6 w-6 text-rose-600" />
                        </div>
                        <p className="text-sm font-bold text-rose-900 uppercase tracking-wide mb-1">Emergency</p>
                        <p className="text-3xl font-black text-rose-600">112</p>
                    </div>
                </div>

                {/* Commitment */}
                <div className="mt-12 text-center text-sm text-slate-500">
                    <p>By using EduCycle, you agree to adhere to these safety standards.</p>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SafetyGuidelines;
