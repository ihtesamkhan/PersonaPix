
export interface UserRole {
  id: string;
  label: string;
}

export interface AppState {
  name: string;
  roles: UserRole[];
  userImage: string | null;
  generatedImage: string | null;
  isProcessing: boolean;
  statusMessage: string;
  error: string | null;
}
