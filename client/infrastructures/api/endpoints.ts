export const endpointUser = {
  register: "/user",
  login: "/user/login",
  users: "/user",
  user: (id: string) => `/user/${id}`,
};


export const endpointCategorie = {
  categories: "/category",
  category: (id: string) => `/category/${id}`,
};


export const endpointWorkflow = {
  workflows: "/workflow",
  allWorkflows: "/workflow/all",
  workflow: (id: string) => `/workflow/${id}`,
};


export const endpointProduit = {
  produits: "/product",
  Excel: "/excel/produits",
  produit: (id: string) => `/product/${id}`,
  byWorkflow: (workflowId: string) =>
    `/product/workflow/${workflowId}`,
};


export const endpointVente = {
  ventes: "/sale",
  vente: (id: string) => `/sale/${id}`,
  byWorkflow: (workflowId: string) =>
    `/sale/workflow/${workflowId}`,
};


export const endpointEmployee = {
  employees: "/employee",
  employee: (id: string) => `/employee/${id}`,
  byWorkflow: (workflowId: string) =>
    `/employee/workflow/${workflowId}`,
};


export const endpointPerfoData = {
  perfoData: "/perfoEmp",
  perfo: (id: string) => `/perfoEmp/${id}`,
  byWorkflow: (workflowId: string) =>
    `/perfoEmp/workflow/${workflowId}`,
};
