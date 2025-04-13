
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { QueryProvider } from './providers/QueryProvider';
import Index from './pages/Index'; 
import AuthPage from './pages/AuthPage';
import EmployerAuthPage from './pages/EmployerAuthPage';
import AuthCallback from './pages/AuthCallback';
import JobsPage from './pages/JobsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import JobDetailsPage from './pages/JobDetails';
import PostJobPage from './pages/PostJobPage'; 
import PricingPage from './pages/PricingPage';
import EmployerDashboard from './components/dashboard/EmployerDashboard';
import JobSeekerDashboard from './components/dashboard/JobSeekerDashboard';
import ProfilePage from './pages/ProfilePage';
import SavedJobsPage from './pages/SavedJobsPage';
import AlertSettingsPage from './pages/AlertSettingsPage';
import ApplicationsPage from './pages/ApplicationsPage'; // Changed from NotFound to ApplicationsPage
import ApplicationDetails from './pages/ApplicationDetails';
import JobApplicationForm from './components/applications/JobApplicationForm';
import ViewApplicationPage from './pages/ViewApplicationPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import JobApplicationSuccess from './pages/JobApplicationSuccess';
import CompanyProfilePage from './pages/CompanyProfilePage';
import AccountUpgrade from './pages/AccountUpgrade';

function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider defaultTheme="light" storageKey="talenthub-theme">
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    {/* Landing Page */}
                    <Route path="/" element={<Index />} />
                    
                    {/* Auth Routes */}
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/employer/auth" element={<EmployerAuthPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Job Routes */}
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/search-results" element={<SearchResultsPage />} />
                    <Route path="/jobs/:id" element={<JobDetailsPage />} />
                    <Route path="/jobs/post" element={<PostJobPage />} />

                    {/* Application Routes */}
                    <Route path="/apply/:id" element={<JobApplicationForm />} />
                    <Route path="/applications/:id" element={<ViewApplicationPage />} />
                    <Route path="/applications/history" element={<ApplicationsPage />} />
                    <Route path="/application/:id" element={<ApplicationDetails />} />
                    <Route path="/application/success/:id" element={<JobApplicationSuccess />} />

                    {/* Pricing */}
                    <Route path="/pricing" element={<PricingPage />} />

                    {/* Dashboard Routes */}
                    <Route path="/dashboard/employer" element={<EmployerDashboard />} />
                    <Route path="/dashboard/job-seeker" element={<JobSeekerDashboard />} />

                    {/* Profile Routes */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/company/profile" element={<CompanyProfilePage />} />
                    <Route path="/profile/alerts" element={<AlertSettingsPage />} />
                    <Route path="/saved-jobs" element={<SavedJobsPage />} />
                    <Route path="/account/upgrade" element={<AccountUpgrade />} />
                  </Routes>
                </main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;
