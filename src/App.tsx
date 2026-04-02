import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
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
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider><MusicPlayerProvider><TooltipProvider><Sonner />
      <BrowserRouter><AppLayout>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/horoscope" element={<HoroscopePage />} />
          <Route path="/classifieds" element={<ClassifiedsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout></BrowserRouter>
    </TooltipProvider></MusicPlayerProvider></ThemeProvider>
  </QueryClientProvider>
);
export default App;
