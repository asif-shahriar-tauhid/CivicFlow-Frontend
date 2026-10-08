export interface RoutingRuleCategory {
  id: string;
  name: string;
}

export interface RoutingRuleDepartment {
  id: string;
  name: string;
  isActive: boolean;
  isArchived: boolean;
}

export interface CategoryRoutingRule {
  id: string;
  categoryId: string;
  departmentId: string;
  location?: string | null;
  priority: number;
  isActive: boolean;
  isArchived: boolean;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category: RoutingRuleCategory;
  department: RoutingRuleDepartment;
}

export interface CreateRoutingRulePayload {
  categoryId: string;
  departmentId: string;
  location?: string;
  priority?: number;
}

export interface UpdateRoutingRulePayload {
  categoryId?: string;
  departmentId?: string;
  location?: string | null;
  priority?: number;
  isActive?: boolean;
}

export interface RoutingRuleQueryParams {
  includeArchived?: boolean;
}
