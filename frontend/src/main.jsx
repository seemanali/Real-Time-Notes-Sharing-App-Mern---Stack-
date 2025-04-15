import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import OpenFolder from './components/OpenFolder.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';

import store from './store/store.js';
import { Provider } from "react-redux"
import PublicAsset from './components/PublicAssests.jsx';
import PublicFolderDetail from './components/PublicFolderDetails.jsx';
import PublicNoteDetail from './components/PublicNoteDetail.jsx';
import CollaborativeEditor from './components/CollabEditor.jsx';
import RoomConnectionForm from './components/RoomConnectForm.jsx';
import CreateRoom from './components/CreateRoom.jsx';
import UserProfile from './components/UserProfile.jsx';



const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "folder/:id",
        element: <OpenFolder />
      },
      {
        path: "public-assests",
        element: <PublicAsset />
      }, {
        path: "public-folders/:id",
        element: <PublicFolderDetail />
      },
      {
        path: "public-notes/:id",
        element: <PublicNoteDetail />
      },
      {
        path: "shared-with-me",
        element: <PublicAsset />
      },
      {
        path: "shared-with-me/folder/:id",
        element: <PublicFolderDetail />
      },
      {
        path: "collab",
        element: <CollaborativeEditor />
      },
      {
        path: "/form",
        element: <RoomConnectionForm />,
      },
      {
        path: "/createroom",
        element: <CreateRoom />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },

    ]
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <>please navigate with links and buttons
      <br />
      <Link to={"/"}>Home</Link>
    </>
  }
])

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>

  </>
)
