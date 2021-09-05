import { PageContainer } from '@ant-design/pro-layout';
import api from '@/services/api';
import CrudTable from '@/components/CrudTable';

// type Model = API.Plans.Model;
// type FormInputs = API.Plans.FormInput;
// type TableParams = API.Plans.TableParams;
// type CollectionParams = API.Plans.CollectionParams;

export default () => {
  return (
    <PageContainer>
      <CrudTable crud={api.plans} />
    </PageContainer>
  );
};
