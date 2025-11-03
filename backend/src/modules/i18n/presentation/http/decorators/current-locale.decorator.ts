import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentLocale = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<{ locale?: string }>();
    return req.locale || 'en';
  },
);
