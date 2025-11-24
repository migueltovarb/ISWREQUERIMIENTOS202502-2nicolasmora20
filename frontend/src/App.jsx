import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import RecoverPasswordPage from './pages/public/RecoverPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import ConfirmEmailPage from './pages/public/ConfirmEmailPage';

// Private Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import CertificatesPage from './pages/volunteer/CertificatesPage';
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import CreateActivityPage from './pages/coordinator/CreateActivityPage';
import EditActivityPage from './pages/coordinator/EditActivityPage';
import AttendancePage from './pages/coordinator/AttendancePage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Common Pages (Authenticated)
import ProfilePage from './pages/common/ProfilePage';
import EditProfilePage from './pages/common/EditProfilePage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Public Routes */}
                        <Route index element={<LandingPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="recover-password" element={<RecoverPasswordPage />} />
                        <Route path="reset-password/:uid/:token" element={<ResetPasswordPage />} />
                        <Route path="confirm-email/:uid/:token" element={<ConfirmEmailPage />} />

                        {/* Common Authenticated Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['volunteer', 'coordinator', 'admin']} />}>
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="profile/edit" element={<EditProfilePage />} />
                        </Route>

                        {/* Volunteer Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['volunteer']} />}>
                            <Route path="volunteer" element={<VolunteerDashboard />} />
                            <Route path="certificates" element={<CertificatesPage />} />
                        </Route>

                        {/* Coordinator Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['coordinator']} />}>
                            <Route path="coordinator" element={<CoordinatorDashboard />} />
                            <Route path="coordinator/create-activity" element={<CreateActivityPage />} />
                            <Route path="coordinator/edit-activity/:id" element={<EditActivityPage />} />
                            <Route path="coordinator/attendance/:id" element={<AttendancePage />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="admin" element={<AdminDashboard />} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
