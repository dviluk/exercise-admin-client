import api from '@/services/api';
import { denormalizeCollection, normalizeCollection } from '@/utils/models';
import { useCallback, useState } from 'react';

type Model = API.Difficulties.Model;
type ModelById = Record<string, Model>;

type Select = API.Difficulties.Select;
type SelectById = Record<string, Select>;

type CollectionParams = API.Difficulties.CollectionParams;

type FetchAllParams = {
  params?: CollectionParams;
  force?: boolean;
};

type Pagination = {
  currentPage: number;
  perPage: number;
  total: number;
};

export type DifficultiesModel = {
  select: {
    items: Select[];
    byId: SelectById;
    ids: string[];
    loading: boolean;
    fetched: boolean;
    fetch: () => Promise<void>;
  };
  all?: {
    items: Model[];
    byId: ModelById;
    pagination: Pagination;
    ids: string[];
    loading: boolean;
    fetched: boolean;
    fetch: () => Promise<void>;
  };
};

type NormalizeCollection<T> = {
  ids: string[];
  byId: T;
};

export default (): DifficultiesModel => {
  const [selectItems, setSelectItems] = useState<NormalizeCollection<SelectById>>({
    ids: [],
    byId: {},
  });
  const [selectFetched, setSelectFetched] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);

  const [allItems, setAllItems] = useState<NormalizeCollection<ModelById>>({ ids: [], byId: {} });
  const [allFetched, setAllFetched] = useState(false);
  const [allLoading, setAllLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    perPage: 15,
    total: 0,
  });

  const fetchSelect = useCallback(
    async (force: boolean = false) => {
      if ((!force && selectFetched) || selectLoading) {
        return;
      }

      setSelectLoading(true);

      try {
        const req = await api.difficulties.select();

        if (req.success === true) {
          setSelectFetched(true);

          const { data, meta } = req;
          setSelectItems(normalizeCollection(data, 'value'));
          setPagination({
            currentPage: meta.current_page,
            total: meta.total,
            perPage: meta.per_page,
          });
        }
      } catch (e) {
        //
      } finally {
        setSelectLoading(false);
      }
    },
    [selectFetched, selectLoading],
  );

  const fetchAll = useCallback(async (options: FetchAllParams) => {
    const { force, params } = options;

    if ((!force && allFetched) || allLoading) {
      return;
    }

    setAllLoading(true);

    try {
      const req = await api.difficulties.all(params);

      if (req.success) {
        setAllItems(normalizeCollection(req.data, 'id'));
        setAllFetched(true);
      }
    } catch (e) {
    } finally {
      setAllLoading(false);
    }
  }, []);

  return {
    select: {
      loading: selectLoading,
      fetched: selectFetched,
      fetch: fetchSelect,
      ...selectItems,
      items: denormalizeCollection(selectItems),
    },
  };
};
