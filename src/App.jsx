
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ContactPage from '@/pages/ContactPage';
import GalaxyBackground from '@/components/GalaxyBackground';

const App = () => {
  return (
    <Router>
      <GalaxyBackground />
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<HomePage />} /> {/* Fallback to HomePage */}
      </Routes>
    </Router>
  );
};

export default App;
