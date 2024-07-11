import { Schema, model, models } from 'mongoose';
import { ObjectId } from 'mongodb';

const NotificationSchema = new Schema({
  id: {
    type: String
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  chatwithname: {
    type: String,
  },
  chatwithimage: {
    type: String,
  },
});

const Notification = models.Notification || model('Notification', NotificationSchema);

export default Notification;
