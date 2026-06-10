import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/sections/create', name: 'SectionCreate', component: () => import('../views/SectionCreate.vue') },
  { path: '/sections/:id', name: 'SectionDetail', component: () => import('../views/SectionDetail.vue') },
  { path: '/posts', name: 'PostList', component: () => import('../views/PostList.vue') },
  { path: '/posts/create', name: 'PostCreate', component: () => import('../views/PostCreate.vue') },
  { path: '/posts/:id', name: 'PostDetail', component: () => import('../views/PostDetail.vue') },
  { path: '/posts/:id/edit', name: 'PostEdit', component: () => import('../views/PostEdit.vue') },
  { path: '/users/:id', name: 'UserProfile', component: () => import('../views/UserProfile.vue') },
  { path: '/users/:id/edit', name: 'UserEdit', component: () => import('../views/UserEdit.vue') },
  { path: '/notifications', name: 'Notifications', component: () => import('../views/Notifications.vue') },
  { path: '/search', name: 'Search', component: () => import('../views/SearchResults.vue') },
  { path: '/admin', name: 'AdminPanel', component: () => import('../views/AdminPanel.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
