import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JobModel {
  @Field()
  name: string;

  @Field()
  description: string;
}
