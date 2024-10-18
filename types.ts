export interface Message {
  sender: string;
  content: string;
  time: string;
  imageUrl?: string | null;
  isAdmin: boolean;
  id?: string;
  isRead?: boolean;
}

export interface User {
  id: string;
  chatName: string;
  email: string;
  name: string;
  messages: Message[];
}
