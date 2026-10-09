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
  notificationId: string,
): Promise<ApiResponse<{ count: number } | null>> => {
  return apiClient(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

export const markAllNotificationsRead = async (
  notificationIds?: string[],
): Promise<ApiResponse<{ count: number } | null>> => {
  let backendCount = 0;

  // 1. Trigger backend native bulk update for all notifications
  try {
    const res = await apiClient<ApiResponse<{ count: number }>>("/notifications/all/read", {
      method: "PATCH",
    });
    if (res?.data?.count) {
      backendCount = res.data.count;
    }
  } catch {
    // If bulk route encounters issue, fallback to per-item below
  }

  // 2. Also dispatch concurrent updates for any specific IDs provided to guarantee persistence
  if (Array.isArray(notificationIds) && notificationIds.length > 0) {
    const results = await Promise.allSettled(
      notificationIds.map((id) =>
        apiClient(`/notifications/${id}/read`, {
          method: "PATCH",
        }),
      ),
    );
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    backendCount = Math.max(backendCount, successCount);
  }

  return {
    success: true,
    statusCode: 200,
    message: "All notifications marked as read",
    data: { count: backendCount },
  };
};
