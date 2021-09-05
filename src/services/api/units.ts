import { simpleCrud } from '@/utils/api';

export default simpleCrud<API.Units.Model, API.Units.CollectionParams, API.Units.FormInput>(
  'units',
);
