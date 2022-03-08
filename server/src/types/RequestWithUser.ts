import { Request } from 'express';
import User from './UserTypes';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;