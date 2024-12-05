import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from '../auth.constants';
import { RoutePolicies } from '../enum/route-policies.enum';
import { Person } from 'src/persons/entities/person.entity';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePolicyRequired = this.reflector.get<RoutePolicies | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );

    // We do not need permissions for this route since none has been configured
    if (!routePolicyRequired) {
      return true;
    }

    // We need the tokenPayload coming from AuthTokenGuard to continue
    const request = context.switchToHttp().getRequest();
    const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY];

    if (!tokenPayload) {
      throw new UnauthorizedException(
        `Route requires permission ${routePolicyRequired}. Unresolved user`,
      );
    }

    const { person }: { person: Person } = tokenPayload;

    if (!person.routePolicies.includes(routePolicyRequired)) {
      throw new UnauthorizedException(
        `User has no permission ${routePolicyRequired}`,
      );
    }

    console.log(person);

    return true;
  }
}
