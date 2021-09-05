import { simpleCrud } from '@/utils/api';

export default simpleCrud<API.Muscles.Model, API.Muscles.CollectionParams, API.Muscles.FormInput>(
  'muscles',
);
