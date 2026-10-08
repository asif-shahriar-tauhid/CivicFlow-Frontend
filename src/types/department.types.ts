export interface DepartmentCount {
  routingRules?: number;
  serviceRequests?: number;
  staff?: number;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  isArchived?: boolean;
  archivedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: DepartmentCount;
}

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
}

export interface UpdateDepartmentPayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface DepartmentQueryParams {
  includeArchived?: boolean;
}
