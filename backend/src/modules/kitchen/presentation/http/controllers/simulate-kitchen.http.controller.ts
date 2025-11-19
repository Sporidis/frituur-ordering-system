import { Controller, Post, UseGuards } from '@nestjs/common';
import { SimulateKitchenEndpoint } from '@modules/kitchen/presentation/http/endpoints/simulate-kitchen.endpoint';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';
import { JwtAuthGuard } from '@modules/auth/infrastructure/http/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/infrastructure/http/roles.guard';
import { Roles } from '@modules/auth/infrastructure/http/roles.decorator';
import { UserRole } from '@modules/users/domain/user-role.enum';

@Controller('kitchen')
export class SimulateKitchenHttpController {
  constructor(private readonly endpoint: SimulateKitchenEndpoint) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('simulate')
  handle(@CurrentLocale() locale: string) {
    return this.endpoint.handle({ locale });
  }
}
