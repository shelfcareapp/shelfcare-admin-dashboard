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

export interface SelectableUser {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  entranceInfo: string;
  postalCode: string;
}

export type SelectedServices = Record<
  string,
  { parent: string; price: number; quantity: number; name: string }
>;

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  services: SelectedServices;
  totalPrice: number;
  status: string;
  paymentEnabled: boolean;
  pickupTime?: string;
  deliveryTime?: string;
}
