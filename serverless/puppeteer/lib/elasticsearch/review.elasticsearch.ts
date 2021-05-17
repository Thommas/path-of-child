/**
 * Path of child
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import { elasticSearchService } from '../service';

export function queryReviews(ideaId: string): Promise<any> {
  const query: any = {
    bool: {
      must: [
        {
          term: {
            ['type.keyword']: 'Review',
          },
        },
        {
          term: {
            ['ideaId.keyword']: ideaId,
          },
        },
      ],
    },
  };
  return elasticSearchService.search(query);
}
