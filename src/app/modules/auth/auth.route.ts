import express from 'express';
// import auth from '../../middlewares/auth';
// import { USER_ROLE } from './../user/user.constant';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlware/validateRequest';
import { AuthValidation } from './auth.validation';
import auth from '../../middlware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;