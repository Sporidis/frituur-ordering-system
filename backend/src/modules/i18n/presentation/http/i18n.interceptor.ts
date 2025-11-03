import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DEFAULT_LOCALE } from '../../domain/constants';

declare module 'http' {
  interface IncomingMessage {
    locale?: string;
  }
}

@Injectable()
export class I18nInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { locale?: string }>();
    const queryLocale = (req as any)?.query?.lang as string | undefined;
    const headerLocale = (req as any)?.headers?.['accept-language'] as
      | string
      | undefined;
    const locale = (queryLocale || headerLocale || DEFAULT_LOCALE)
      .split(',')[0]
      .trim();
    (req as any).locale = locale;
    return next.handle();
  }
}
