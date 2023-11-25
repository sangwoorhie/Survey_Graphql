import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);

    return new NotFoundException('해당 엔티티가 존재하지 않습니다.');
  }
}
