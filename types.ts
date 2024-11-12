import { Timestamp } from 'firebase/firestore';

export interface Message {
  content: string;
  time: string;
  sender: string;
  isRead: boolean;
  isAdmin: boolean;
  imageUrls: string[];
  options?: { label: string; value: string }[];
  type?: string;
  id?: string;
  timestamp?: Timestamp;
  orderId?: string;
}
export type Chat = {
  unreadCount: number;
  id: string;
  userId: string;
  messages: Message[];
  welcomeMessageSent?: boolean;
  createdAt: never;
  name: string;
  email: string;
  isAutoReply?: boolean;
  timestamp?: Timestamp;
};

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  entranceInfo: string;
  postalCode: string;
}

export interface SelectableUser {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  entranceInfo: string;
  postalCode: string;
}

export type ServiceSubOptions = {
  subOptionKey: string;
  key?: string;
  price: number;
  name?: string;
};

export type SelectedServices = {
  id: string;
  parent: string;
  price: number;
  quantity: number;
  name: string;
  discount?: number;
  additionalInfo?: string;
  subOptions?: ServiceSubOptions[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  address: string;
  entranceInfo: string;
  phone: string;
  postalCode: string;
};
export type DateTimeOption = {
  date: string;
  time: string;
};

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  services: SelectedServices[];
  totalPrice: number;
  status: 'pending_customer_input' | 'confirmed' | 'completed';
  createdAt: Date;
  paymentEnabled: boolean;
  pickupTime?: DateTimeOption;
  deliveryTime?: DateTimeOption;
  paymentStatus?: string;
  deliveryFee?: number;
  additionalInfo?: string;
}
