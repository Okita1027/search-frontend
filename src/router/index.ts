import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import IndexPage from "../pages/IndexPage.vue";
import PostDetailPage from "../pages/post/DetailPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import UserDetailPage from "../pages/UserDetailPage.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import AdminLoginPage from "../pages/admin/AdminLoginPage.vue";
import PostManagementPage from "../pages/admin/PostManagementPage.vue";
import PictureManagementPage from "../pages/admin/PictureManagementPage.vue";
import AudioManagementPage from "../pages/admin/AudioManagementPage.vue";
import VideoManagementPage from "../pages/admin/VideoManagementPage.vue";
import UserManagementPage from "../pages/admin/UserManagementPage.vue";
import CommentManagementPage from "../pages/admin/CommentManagementPage.vue";
import { authService } from "@/services";
import { message } from "ant-design-vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: IndexPage,
    meta: {
      title: "聚合搜索平台",
    },
  },
  {
    path: "/:category",
    component: IndexPage,
  },
  {
    path: "/post/detail",
    component: PostDetailPage,
    meta: {
      title: "文章详情",
    },
  },
  {
    path: "/login",
    component: LoginPage,
    meta: {
      title: "用户登录",
    },
  },
  {
    path: "/register",
    component: RegisterPage,
    meta: {
      title: "用户注册",
    },
  },
  {
    path: "/profile",
    component: ProfilePage,
    meta: {
      title: "个人中心",
      requiresAuth: true,
    },
  },
  {
    path: "/user/detail",
    component: UserDetailPage,
    meta: {
      title: "用户详情",
    },
  },
  // 管理员路由
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "login",
        component: AdminLoginPage,
        meta: {
          title: "管理员登录",
        },
      },
      {
        path: "posts",
        component: PostManagementPage,
        meta: {
          title: "文章管理",
          requiresAdmin: true,
        },
      },
      {
        path: "pictures",
        component: PictureManagementPage,
        meta: {
          title: "图片管理",
          requiresAdmin: true,
        },
      },
      {
        path: "audios",
        component: AudioManagementPage,
        meta: {
          title: "音频管理",
          requiresAdmin: true,
        },
      },
      {
        path: "videos",
        component: VideoManagementPage,
        meta: {
          title: "视频管理",
          requiresAdmin: true,
        },
      },
      {
        path: "users",
        component: UserManagementPage,
        meta: {
          title: "用户管理",
          requiresAdmin: true,
        },
      },
      {
        path: "comments",
        component: CommentManagementPage,
        meta: {
          title: "评论管理",
          requiresAdmin: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫，检查需要登录的路由
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || "聚合搜索平台";

  // 如果页面需要认证
  if (to.meta.requiresAuth) {
    // 检查用户是否已登录
    if (!authService.isLoggedIn()) {
      // 未登录，跳转到登录页面
      next({ 
        path: '/login',
        query: { redirect: to.fullPath }  // 保存要访问的路径
      });
    } else {
      // 已登录，正常访问
      next();
    }
  } else if (to.meta.requiresAdmin) {
    // 检查是否是管理员
    const tokenInfo = authService.getTokenInfo();
    if (!tokenInfo || !tokenInfo.loginId || parseInt(tokenInfo.loginId) >= 10) {
      message.error('权限不足');
      next('/admin/login');
    } else {
      next();
    }
  } else if (to.path === '/admin/login') {
    // 如果用户访问管理员登录页面，检查是否已经有管理员权限
    const tokenInfo = authService.getTokenInfo();
    if (tokenInfo && tokenInfo.loginId && parseInt(tokenInfo.loginId) < 10) {
      // 已有管理员权限，直接跳转到管理界面
      next('/admin/posts');
    } else {
      next();
    }
  } else {
    // 不需要认证的页面，直接访问
    next();
  }
});

export default router;
