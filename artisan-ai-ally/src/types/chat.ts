export interface ChatRoom {
  _id: string;
  roomId: string;
  artisanId: string;
  customerName: string;
  customerEmail: string;
  productId?: string;
  productName?: string;
  isActive: boolean;
  messageCount: number;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  roomId: string;
  senderType: 'artisan' | 'customer';
  senderName: string;
  senderEmail: string;
  messageText: string;
  messageType: 'text' | 'image' | 'product_link';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageData {
  roomId: string;
  message: string;
  messageType?: 'text' | 'image' | 'product_link';
  senderName?: string;
  senderEmail?: string;
}

export interface JoinRoomData {
  roomId: string;
  customerName: string;
  customerEmail: string;
  productId?: string;
}
