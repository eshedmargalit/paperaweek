import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login/Login';
import ReviewWizard from './components/ReviewWizard';
import DraftPage from './components/DraftPage';
import MenuBar from './components/MenuBar';
import PublicProfile from './components/PublicProfile';
import NotFound from './components/NotFound/NotFound';

import './App.scss';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { fetchUser } from './actions';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const { currentTheme } = useAppSelector((state) => state.theme);

  // by passing [dispatch] as the second argument of useEffect, we replicate the behavior
  // of componentDidMount + componentDidUnmount, but not componentDidUpdate
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="App" data-color-theme={currentTheme}>
        <MenuBar />
        <Routes>
          <Route path="/profiles/:userId/:reviewIdToOpen?" element={<PublicProfile />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/form" element={<ReviewWizard />} />
          <Route path="/drafts" element={<DraftPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
