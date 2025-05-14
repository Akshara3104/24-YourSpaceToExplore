
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
import Chat from "./Components/Chat";
import CommunityChat from "./Components/CommunityChat";
import AllCommunities from "./Components/AllCommunities";
import Posts from "./Components/Posts";
import Followers from "./Components/Followers";
import Following from "./Components/Following";
import Register from "./Components/Register";
import Start from "./Components/Start";
import ChatComponent from "./Components/ChatComponent";
import MyProfile from "./Components/MyProfile";
import UserProfile from "./Components/UserProfile";
import SearchComponent from "./Components/SearchComponent";
import ExploreTags from "./Components/ExploreTags";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Start /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/nquery" element={ <Layout /> }>
          <Route path="/nquery/home" element={ <Home /> } />
          <Route path="/nquery/search" element={ <SearchComponent /> } />
          <Route path="/nquery/explore" element={ <ExploreTags /> } />
          <Route path="/nquery/me" element={ <MyProfile /> } />
          <Route path="/nquery/messages" element={ <MessageHome /> } >
            <Route path="/nquery/messages/:targetId" element={ <ChatComponent /> } />
          </Route>
          <Route path="/nquery/communities" element={ <Communities /> } >
            <Route path="/nquery/communities/:id/chat" element={ <CommunityChat /> } />
          </Route>
          <Route path="/nquery/allcommunities" element={ <AllCommunities /> } />
          <Route path="/nquery/me/profile" element={ <MyProfile /> } />
          <Route path="/nquery/me/posts" element={ <Posts /> } />
          <Route path="/nquery/:name/profile" element={<UserProfile />} /> 
          <Route path="/nquery/me/followers" element={ <Followers /> } />
          <Route path="/nquery/me/following" element={ <Following /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
