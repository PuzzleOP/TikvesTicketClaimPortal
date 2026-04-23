export interface LocalizedText {
  id?: string;
  en: string;
  mk?: string | null;
}

export interface AuthUserProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  organization?: string | null;
  phone?: number | null;
  image?: string | null;
  status: string;
  type: string;
  tenant: string;
  authorities: string[];
  data?: {
    company?: string | null;
    country?: string | null;
    position?: string | null;
  } | null;
}

export interface AttendanceEvent {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  status: string;
  timeStart?: string | null;
  timeEnd?: string | null;
  image?: string;
}

export interface AttendanceTicket {
  id: string;
  eventId: string;
  userId?: string | null;
  code: string;
  hash: string;
  status: 'ACTIVE' | 'VERIFIED' | 'CANCELLED' | string;
  timeStart?: string | null;
  timeEnd?: string | null;
  version: number;
  timeCreated?: string | null;
  timeModified?: string | null;
  assignmentSummary?: string | null;
  isVip?: boolean;
  dayIndices?: number[];
  event: AttendanceEvent;
}

export interface AttendancesResponse {
  data: AttendanceTicket[];
}

export interface SendEventTicketsEmailResponse {
  email: string;
  eventId: string;
  sent: number;
}

export interface TicketGroup {
  eventId: string;
  eventName: string;
  eventStart?: string | null;
  eventEnd?: string | null;
  tickets: AttendanceTicket[];
}
