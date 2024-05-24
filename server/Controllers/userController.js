import User from '../Models/userModel.js';
import factory from '../Utils/handlerFactory.js';

export const getAllUsers = factory.getAll(User, 'users');
