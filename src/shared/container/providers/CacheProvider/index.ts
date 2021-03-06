import { container } from 'tsyringe';

import RedisCacheProvider from './implementations/RedisCacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<RedisCacheProvider>(
  'CacheProvider',
  providers.redis,
);
