import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import BlogList from "./components/BlogList";
import BlogPost from "./components/BlogPost";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;
