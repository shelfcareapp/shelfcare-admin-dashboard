export interface Message {
  sender: string;
  content: string;
  time: string;
  imageUrls?: string[];
  isAdmin: boolean;
  id?: string;
  isRead?: boolean;
}

export type Chat = {
  id: string;
  userId: string;
  messages: any[];
  welcomeMessageSent?: boolean;
  createdAt: any;
  name: string;
  email: string;
  isAutoReply?: boolean;
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
  price: number;
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

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  services: SelectedServices[];
  totalPrice: number;
  status: string;
  paymentEnabled: boolean;
  pickupTime?: string;
  deliveryTime?: string;
}
