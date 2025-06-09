
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Home from './Components/Home'
import Login from './Components/Login'
import Layout from './Components/Layout'
import MessageHome from "./Components/MessageHome";
import Communities from "./Components/Communities";
import CommunityChat from "./Components/CommunityChat";
import Register from "./Components/Register";
import Start from "./Components/Start";
import ChatComponent from "./Components/ChatComponent";
import MyProfile from "./Components/MyProfile";
import UserProfile from "./Components/UserProfile";
import SearchComponent from "./Components/SearchComponent";
import ExploreTags from "./Components/ExploreTags";
import ExploreAccounts from "./Components/ExploreAccounts";
import CommunityFeed from "./Components/CommunityFeed";
import Notifications from "./Components/Notifications";
import { ContextProvider } from "./Components/GlobalContext";


function App() {

  return (
    <ContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Start /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/24" element={ <Layout /> }>
          <Route path="/24" element={ <Home /> } />
          <Route path="/24/search" element={ <SearchComponent /> } />
          <Route path="/24/explore" element={ <ExploreTags /> } />
          <Route path="/24/tag/:tag" element={ <ExploreAccounts /> } />
          <Route path="/24/notifications" element={ <Notifications /> } />
          <Route path="/24/messages" element={ <MessageHome /> } >
            <Route path="/24/messages/:targetId" element={ <ChatComponent /> } />
          </Route>
          <Route path="/24/communities" element={ <Communities /> } >
            <Route path="/24/communities/:id/chat" element={ <CommunityChat /> } />
          </Route>
          <Route path="/24/community/:id" element={ <CommunityFeed /> } />
          <Route path="/24/me/profile" element={ <MyProfile /> } />
          <Route path="/24/:name/profile" element={<UserProfile />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
