import { PageContainer } from '@ant-design/pro-layout';
import CrudTable from '@/components/CrudTable';
import api from '@/services/api';

// type Model = API.Muscles.Model;
// type FormInputs = API.Muscles.FormInput;
// type TableParams = API.Muscles.TableParams;
// type CollectionParams = API.Muscles.CollectionParams;

export default () => {
  return (
    <PageContainer>
      <CrudTable crud={api.muscles} />
    </PageContainer>
  );
};
