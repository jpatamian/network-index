export interface NotificationItem {
  id: number;
  message: string;
  notification_type: string;
  created_at: string;
  read_at: string | null;
  post_id: number;
  comment_id: number;
  post_title: string | null;
  actor: {
    id: number | null;
    name: string;
  };
}
