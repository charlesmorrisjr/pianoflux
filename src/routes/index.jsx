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
