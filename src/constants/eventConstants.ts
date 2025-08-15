export const EVENT_STATUSES = ["open", "completed", "cancelled"] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];
