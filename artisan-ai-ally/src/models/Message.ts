import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
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

const MessageSchema: Schema = new Schema({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  senderType: {
    type: String,
    enum: ['artisan', 'customer'],
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderEmail: {
    type: String,
    required: true
  },
  messageText: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'product_link'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
MessageSchema.index({ roomId: 1, createdAt: -1 });
MessageSchema.index({ roomId: 1, senderEmail: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
