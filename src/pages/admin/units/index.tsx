import { PageContainer } from '@ant-design/pro-layout';
import api from '@/services/api';
import CrudTable from '@/components/CrudTable';

// type Model = API.Units.Model;
// type FormInputs = API.Units.FormInput;
// type TableParams = API.Units.TableParams;
// type CollectionParams = API.Units.CollectionParams;

export default () => {
  return (
    <PageContainer>
      <CrudTable crud={api.units} />
    </PageContainer>
  );
};
