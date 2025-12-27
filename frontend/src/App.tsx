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
import NGODashboard from "./pages/NGODashboard";
import BulkRequest from "./pages/BulkRequest";
import NGOApprovalStatus from "./pages/NGOApprovalStatus";
import NGOCollection from "./pages/NGOCollection";
import NGODistribution from "./pages/NGODistribution";
import NGOImpact from "./pages/NGOImpact";

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
          <Route path="/donate-book" element={<DonateBook />} />
          
          {/* NGO Routes */}
          <Route path="/ngo-dashboard" element={<NGODashboard />} />
          <Route path="/bulk-request" element={<BulkRequest />} />
          <Route path="/ngo-approval-status" element={<NGOApprovalStatus />} />
          <Route path="/ngo-collection" element={<NGOCollection />} />
          <Route path="/ngo-distribution" element={<NGODistribution />} />
          <Route path="/ngo-impact" element={<NGOImpact />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
