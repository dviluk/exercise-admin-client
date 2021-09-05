import { PageContainer } from '@ant-design/pro-layout';
import api from '@/services/api';
import CrudTable from '@/components/CrudTable';

// type Model = API.Difficulties.Model;
// type FormInputs = API.Difficulties.FormInput;
// type TableParams = API.Difficulties.TableParams;
// type CollectionParams = API.Difficulties.CollectionParams;

export default () => {
  return (
    <PageContainer>
      <CrudTable crud={api.difficulties} />
    </PageContainer>
  );
};
