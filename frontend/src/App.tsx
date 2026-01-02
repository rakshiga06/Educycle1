import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NGOLogin from "./pages/NGOLogin";
import StudentHome from "./pages/StudentHome";
import SearchBooks from "./pages/SearchBooks";
import BookDetails from "./pages/BookDetails";
import RequestBook from "./pages/RequestBook";
import RequestStatus from "./pages/RequestStatus";
import Chat from "./pages/Chat";
import Pickup from "./pages/Pickup";
import Feedback from "./pages/Feedback";
import Notes from "./pages/Notes";
import StudentImpact from "./pages/StudentImpact";
import DonateBook from "./pages/DonateBook";
import SafetyGuidelines from "./pages/SafetyGuidelines";
// NGO Pages
import NGODashboard from "./pages/NGODashboard";
import NGOProfile from "./pages/NGOProfile";
import NGOApprovalStatus from "./pages/NGOApprovalStatus";
import NGODistribution from "./pages/NGODistribution";
import NGOImpact from "./pages/NGOImpact";
import NGOSearchBooks from "./pages/NGOSearchBooks";
import NGOBookDetails from "./pages/NGOBookDetails";
import NGORequestBook from "./pages/NGORequestBook";
import NGORequestStatus from "./pages/NGORequestStatus";

import Distribution from "./pages/Distribution";
import CreateDistribution from "./pages/CreateDistribution";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Index />} />
          <Route path="/ngo-login" element={<NGOLogin />} />

          {/* Public / Shared */}
          <Route path="/distribution" element={<Distribution />} />

          {/* Student Routes */}
          <Route path="/student-home" element={<StudentHome />} />
          <Route path="/search-books" element={<SearchBooks />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/request-book/:id" element={<RequestBook />} />
          <Route path="/request-status" element={<RequestStatus />} />
          <Route path="/chat/:requestId" element={<Chat />} />
          <Route path="/pickup/:requestId" element={<Pickup />} />
          <Route path="/feedback/:requestId" element={<Feedback />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/student-impact" element={<StudentImpact />} />
          {/* <Route path="/student-profile" element={<StudentProfile />} /> */}
          <Route path="/donate-book" element={<DonateBook />} />
          <Route path="/safety" element={<SafetyGuidelines />} />

          {/* NGO Routes */}
          <Route path="/ngo-dashboard" element={<NGODashboard />} />
          <Route path="/ngo-profile" element={<NGOProfile />} />

          <Route path="/ngo-approval-status" element={<NGOApprovalStatus />} />
          <Route path="/create-distribution" element={<CreateDistribution />} />
          <Route path="/ngo-impact" element={<NGOImpact />} />

          {/* NGO Individual Book Request Flow */}
          <Route path="/ngo-find-books" element={<NGOSearchBooks />} />
          <Route path="/ngo-books/:id" element={<NGOBookDetails />} />
          <Route path="/ngo-request-book/:id" element={<NGORequestBook />} />
          <Route path="/ngo-my-requests" element={<NGORequestStatus />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
