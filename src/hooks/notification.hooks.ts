import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/notification.api";
import type { ApiResponse } from "@/types/dashboard.types";
import type {
  Notification,
  NotificationQueryParams,
  NotificationUnreadCount,
} from "@/types/notification.types";

export const useGetNotifications = (
  params?: NotificationQueryParams,
  enabled = true,
  userId?: string | null,
) => {
  return useQuery({
    queryKey: ["notifications", "list", userId ?? "current", params],
    queryFn: () => getNotifications(params),
    enabled: Boolean(
      enabled && (userId !== undefined ? Boolean(userId) : true),
    ),
    staleTime: 15 * 1000,
  });
};

export const useGetUnreadNotificationCount = (
  enabled = true,
  userId?: string | null,
) => {
  return useQuery({
    queryKey: ["notifications", "unread-count", userId ?? "current"],
    queryFn: getUnreadNotificationCount,
    enabled: Boolean(
      enabled && (userId !== undefined ? Boolean(userId) : true),
    ),
    refetchInterval: 30 * 1000,
    staleTime: 15 * 1000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId?: string) =>
      markNotificationRead(notificationId || "all"),
    onMutate: async (notificationId = "all") => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      if (notificationId === "all") {
        queryClient.setQueriesData<ApiResponse<NotificationUnreadCount>>(
          { queryKey: ["notifications", "unread-count"] },
          (old) => (old ? { ...old, data: { count: 0 } } : { success: true, statusCode: 200, message: "OK", data: { count: 0 } }),
        );
        queryClient.setQueriesData<ApiResponse<Notification[]>>(
          { queryKey: ["notifications", "list"] },
          (old) => {
            if (!old?.data || !Array.isArray(old.data)) return old;
            const now = new Date().toISOString();
            return {
              ...old,
              data: old.data.map((n) => ({
                ...n,
                readAt: n.readAt || now,
              })),
            };
          },
        );
      } else {
        queryClient.setQueriesData<ApiResponse<NotificationUnreadCount>>(
          { queryKey: ["notifications", "unread-count"] },
          (old) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: { count: Math.max(0, old.data.count - 1) },
            };
          },
        );
        queryClient.setQueriesData<ApiResponse<Notification[]>>(
          { queryKey: ["notifications", "list"] },
          (old) => {
            if (!old?.data || !Array.isArray(old.data)) return old;
            const now = new Date().toISOString();
            return {
              ...old,
              data: old.data.map((n) =>
                n.id === notificationId ? { ...n, readAt: n.readAt || now } : n,
              ),
            };
          },
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids?: string[]) => markAllNotificationsRead(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      queryClient.setQueriesData<ApiResponse<NotificationUnreadCount>>(
        { queryKey: ["notifications", "unread-count"] },
        (old) => (old ? { ...old, data: { count: 0 } } : { success: true, statusCode: 200, message: "OK", data: { count: 0 } }),
      );
      queryClient.setQueriesData<ApiResponse<Notification[]>>(
        { queryKey: ["notifications", "list"] },
        (old) => {
          if (!old?.data || !Array.isArray(old.data)) return old;
          const now = new Date().toISOString();
          const targetIds = ids && ids.length > 0 ? new Set(ids) : null;
          return {
            ...old,
            data: old.data.map((n) => ({
              ...n,
              readAt: !targetIds || targetIds.has(n.id) ? (n.readAt || now) : n.readAt,
            })),
          };
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
