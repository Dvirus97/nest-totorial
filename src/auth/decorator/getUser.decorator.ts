import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string[] | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (data && data.length) {
      const newUser: any = {};
      data.forEach((key) => {
        newUser[key] = req.user[key];
      });
      return newUser;
    }
    return req.user;
  },
);
