
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
        <Route path="/nquery" element={ <Layout /> }>
          <Route path="/nquery" element={ <Home /> } />
          <Route path="/nquery/search" element={ <SearchComponent /> } />
          <Route path="/nquery/explore" element={ <ExploreTags /> } />
          <Route path="/nquery/tag/:tag" element={ <ExploreAccounts /> } />
          <Route path="/nquery/notifications" element={ <Notifications /> } />
          <Route path="/nquery/messages" element={ <MessageHome /> } >
            <Route path="/nquery/messages/:targetId" element={ <ChatComponent /> } />
          </Route>
          <Route path="/nquery/communities" element={ <Communities /> } >
            <Route path="/nquery/communities/:id/chat" element={ <CommunityChat /> } />
          </Route>
          <Route path="/nquery/community/:id" element={ <CommunityFeed /> } />
          <Route path="/nquery/me/profile" element={ <MyProfile /> } />
          <Route path="/nquery/:name/profile" element={<UserProfile />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
