import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { CollectionResponse } from './collection.response';

export const ApiOkCollectionResponse = <Collection extends Type<unknown>>(
  collection: Collection,
  options: ApiResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(CollectionResponse, collection),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(CollectionResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(collection) },
              },
            },
          },
        ],
      },
      ...options,
    }),
  );
