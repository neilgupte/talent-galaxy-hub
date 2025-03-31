import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import PostJobPage from './pages/PostJobPage';
import PricingPage from './pages/PricingPage';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import ProfilePage from './pages/ProfilePage';
import SavedJobsPage from './pages/SavedJobsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationDetails from './pages/ApplicationDetails';
import JobApplicationForm from './components/applications/JobApplicationForm';
import ViewApplicationPage from './pages/ViewApplicationPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider defaultTheme="light" storageKey="talenthub-theme">
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Landing Page */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Auth Routes */}
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* Job Routes */}
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/jobs/:id" element={<JobDetailsPage />} />
                  <Route path="/jobs/post" element={<PostJobPage />} />

                  {/* Application Routes */}
                  <Route path="/apply/:id" element={<JobApplicationForm />} />
                  <Route path="/applications/:id" element={<ViewApplicationPage />} />
                  <Route path="/applications/history" element={<ApplicationsPage />} />
                  <Route path="/application/:id" element={<ApplicationDetails />} />

                  {/* Pricing */}
                  <Route path="/pricing" element={<PricingPage />} />

                  {/* Dashboard Routes */}
                  <Route path="/dashboard/employer" element={<EmployerDashboard />} />
                  <Route path="/dashboard/job-seeker" element={<JobSeekerDashboard />} />

                  {/* Profile Routes */}
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/saved-jobs" element={<SavedJobsPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
