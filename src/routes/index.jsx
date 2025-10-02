import Layout from "@/shared/components/Layout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Practice from "@/pages/Practice";

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Landing />},
      { path: 'login', element: <Login />},
      { path: 'signup', element: <Signup />},
      { path: 'practice', element: <Practice />},
    ]
  }
]
