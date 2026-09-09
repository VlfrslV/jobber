import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './users.service';
import { resolve } from 'path';
import { CreateUserInput } from '../dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { TokenPayload } from '../../auth/token-payload.interface';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], {
    name: 'users',
  })
  async getUsers(@CurrentUser() { userId }: TokenPayload) {
    console.log('user ID', userId);
    return this.usersService.getUsers();
  }
}
