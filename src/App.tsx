import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import FeedPage from "./pages/FeedPage";
import GroupsPage from "./pages/GroupsPage";
import MusicPage from "./pages/MusicPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import AdminPage from "./pages/AdminPage";
import VideosPage from "./pages/VideosPage";
import TrackerPage from "./pages/TrackerPage";
import HoroscopePage from "./pages/HoroscopePage";
import ClassifiedsPage from "./pages/ClassifiedsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
    <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
    <Route path="/" element={<ProtectedRoute><AppLayout><FeedPage /></AppLayout></ProtectedRoute>} />
    <Route path="/groups" element={<ProtectedRoute><AppLayout><GroupsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/music" element={<ProtectedRoute><AppLayout><MusicPage /></AppLayout></ProtectedRoute>} />
    <Route path="/messages" element={<ProtectedRoute><AppLayout><MessagesPage /></AppLayout></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
    <Route path="/friends" element={<ProtectedRoute><AppLayout><FriendsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/videos" element={<ProtectedRoute><AppLayout><VideosPage /></AppLayout></ProtectedRoute>} />
    <Route path="/tracker" element={<ProtectedRoute><AppLayout><TrackerPage /></AppLayout></ProtectedRoute>} />
    <Route path="/horoscope" element={<ProtectedRoute><AppLayout><HoroscopePage /></AppLayout></ProtectedRoute>} />
    <Route path="/classifieds" element={<ProtectedRoute><AppLayout><ClassifiedsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/admin" element={<AdminRoute><AppLayout><AdminPage /></AppLayout></AdminRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <MusicPlayerProvider>
          <TooltipProvider>
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </MusicPlayerProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
