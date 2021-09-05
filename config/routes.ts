export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin/difficulties',
        name: 'difficulties',
        icon: 'smile',
        component: './admin/difficulties/index',
      },
      {
        path: '/admin/equipment',
        name: 'equipment',
        icon: 'smile',
        component: './admin/equipment/index',
      },
      {
        path: '/admin/goals',
        name: 'goals',
        icon: 'smile',
        component: './admin/goals/index',
      },
      {
        path: '/admin/muscles',
        name: 'muscles',
        icon: 'smile',
        component: './admin/muscles/index',
      },
      {
        path: '/admin/tags',
        name: 'tags',
        icon: 'smile',
        component: './admin/tags/index',
      },
      {
        path: '/admin/exercises',
        name: 'exercises',
        icon: 'smile',
        component: './admin/exercises/index',
      },
      {
        path: '/admin/exercise-groups',
        name: 'exercise-groups',
        icon: 'smile',
        component: './admin/exercise-groups/index',
      },
      {
        path: '/admin/plans',
        name: 'plans',
        icon: 'smile',
        component: './admin/plans/index',
      },
      {
        path: '/admin/units',
        name: 'units',
        icon: 'smile',
        component: './admin/units/index',
      },
      {
        path: '/admin/users',
        name: 'users',
        icon: 'smile',
        component: './admin/users/index',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
