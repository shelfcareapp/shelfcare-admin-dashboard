export interface Message {
  sender: string;
  content: string;
  time: string;
  imageUrls?: string[];
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
