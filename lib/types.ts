export const LEAD_STATUSES = ["new", "contacted", "signed"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  signed: "Signed",
};

export type Lead = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

/**
 * Minimal hand-written schema type for the Supabase client.
 *
 * Security note: `user_id` is deliberately absent from `Insert` and `Update`.
 * The application code is therefore unable to send a `user_id` at all - the
 * database fills it from `auth.uid()` (column default) and the RLS policies
 * reject anything else.
 */
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: {
          name: string;
          email?: string | null;
          phone?: string | null;
          status?: LeadStatus;
        };
        Update: {
          name?: string;
          email?: string | null;
          phone?: string | null;
          status?: LeadStatus;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: { lead_status: LeadStatus };
    CompositeTypes: Record<never, never>;
  };
};

/**
 * Result of a server action.
 *
 * A discriminated union rather than `{ error: string | null }`, so "it worked"
 * is something an action states explicitly instead of something a caller has
 * to infer from the absence of an error.
 */
export type ActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export const IDLE: ActionState = { status: "idle" };
