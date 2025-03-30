
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import AccountUpgrade from "./pages/AccountUpgrade";
import JobSeekerDashboard from "@/components/dashboard/JobSeekerDashboard";
import EmployerDashboard from "@/components/dashboard/EmployerDashboard";
import JobSearch from "@/components/jobs/JobSearch";
import ProfileForm from "@/components/profile/ProfileForm";
import JobPostFormWrapper from "@/components/jobs/JobPostFormWrapper";
import JobDetails from "@/pages/JobDetails";
import ApplicationDetails from "@/pages/ApplicationDetails";
import NotificationsPage from "@/pages/NotificationsPage";

const queryClient = new QueryClient();

// Route guard for authenticated routes
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { authState } = useAuth();
  const { isAuthenticated, isLoading, user } = authState;
  
  if (isLoading) {
    // You might want to show a loading spinner here
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/jobs" element={<JobSearch />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/account/upgrade" element={<AccountUpgrade />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  
                  {/* Protected Job Seeker Routes */}
                  <Route 
                    path="/dashboard/job-seeker" 
                    element={
                      <ProtectedRoute requiredRole="job_seeker">
                        <JobSeekerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/onboarding/profile" 
                    element={
                      <ProtectedRoute requiredRole="job_seeker">
                        <ProfileForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute requiredRole="job_seeker">
                        <ProfileForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/applications/:id" 
                    element={
                      <ProtectedRoute requiredRole="job_seeker">
                        <ApplicationDetails />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Protected Employer Routes */}
                  <Route 
                    path="/dashboard/employer" 
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <EmployerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/jobs/post" 
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <JobPostFormWrapper />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch-all for not found routes */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
