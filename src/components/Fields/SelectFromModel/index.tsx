import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

export interface SelectFromModelProps<T extends string = string>
  extends Omit<SelectProps<T>, 'options'> {
  model: Models.All;
  initialValue?: SelectProps<T>['defaultValue'];
}

function SelectFromModel<T extends string = string>(props: SelectFromModelProps<T>) {
  const { initialValue, model: namespace } = props;

  const { select } = useModel(namespace) as any;

  useEffect(() => {
    async function init() {
      await select.fetch();
    }

    init();

    let intervalForSelect: any;

    if (!select.fetched || !select.loading) {
      intervalForSelect = setInterval(() => {
        select.fetch(true);
      }, 60000);
    }

    return () => {
      if (intervalForSelect) {
        clearInterval(intervalForSelect);
      }
    };
  }, []);

  function buildOptions() {
    const placeholder = {
      label: 'All',
      value: '',
    };

    const newOptions = [placeholder, ...select.items];

    return newOptions;
  }

  function buildPlaceholder() {
    if (select.loading) {
      return 'Loading';
    }

    return undefined;
  }

  return (
    <Select
      {...props}
      loading={select.loading}
      defaultValue={initialValue}
      placeholder={buildPlaceholder()}
      options={buildOptions()}
    />
  );
}

export default SelectFromModel;
