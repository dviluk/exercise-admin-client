import { PageContainer } from '@ant-design/pro-layout';
import api from '@/services/api';
import CrudTable from '@/components/CrudTable';

// type Model = API.Tags.Model;
// type FormInputs = API.Tags.FormInput;
// type TableParams = API.Tags.TableParams;
// type CollectionParams = API.Tags.CollectionParams;

export default () => {
  return (
    <PageContainer>
      <CrudTable crud={api.tags} />
    </PageContainer>
  );
};
