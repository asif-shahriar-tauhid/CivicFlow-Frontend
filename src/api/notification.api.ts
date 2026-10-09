import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/dashboard.types";
import type {
  Notification,
  NotificationQueryParams,
  NotificationUnreadCount,
} from "@/types/notification.types";

export const getNotifications = async (
  params?: NotificationQueryParams,
): Promise<ApiResponse<Notification[]>> => {
  return apiClient("/notifications", {
    method: "GET",
    query: params as Record<string, string | number | undefined>,
  });
};

export const getUnreadNotificationCount = async (): Promise<
  ApiResponse<NotificationUnreadCount>
> => {
  return apiClient("/notifications/unread-count", {
    method: "GET",
  });
};

export const markNotificationRead = async (
  notificationId: string = "all",
): Promise<ApiResponse<{ count: number } | null>> => {
  return apiClient(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

export const markAllNotificationsRead = async (): Promise<
  ApiResponse<{ count: number } | null>
> => {
  return apiClient("/notifications/all/read", {
    method: "PATCH",
  });
};

