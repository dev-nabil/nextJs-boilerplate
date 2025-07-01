const routes = {
  public: {
    home: "/",
  },
  user: {
    profile: (id: string) => `/user/${id}`,
  },
  admin: {
    dashboard: "/admin/dashboard",
    products: {
      list: "/admin/products",
      create: "/admin/products/create",
      edit: (id: string) => `/admin/products/edit/${id}`,
    },
    categories: {
      list: "/admin/categories",
      create: "/admin/categories/create",
      edit: (id: string) => `/admin/categories/edit/${id}`,
    },
    faq: {
      list: "/admin/faq",
      create: "/admin/faq/create",
      edit: (id: string) => `/admin/faq/edit/${id}`,
    },
    orders: {
      list: "/admin/orders",
      details: (id: string) => `/admin/orders/${id}`,
    },
    users: {
      list: "/admin/users",
      details: (id: string) => `/admin/users/${id}`,
    },
    settings: "/admin/settings",
  },
};

export default routes;
