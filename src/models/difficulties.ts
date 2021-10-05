import api from '@/services/api';
import { denormalizeCollection, normalizeCollection } from '@/utils/models';
import { useCallback, useState } from 'react';

type Model = API.Difficulties.Model;
type ModelById = Record<string, Model>;

type Select = API.Difficulties.Select;
type SelectById = Record<string, Select>;

type FormInput = API.Difficulties.FormInput;

type CollectionParams = API.Difficulties.CollectionParams;

type FetchAllParams = {
  params?: CollectionParams;
  force?: boolean;
};

type CallbackOptions = { onError?: (e: Error) => void };

type Pagination = {
  currentPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
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
  all: {
    items: Model[];
    byId: ModelById;
    /**
     * Si se esta online la paginación no importa
     */
    pagination: Pagination;
    ids: string[];
    loading: boolean;
    fetched: boolean;
    fetch: (options?: FetchAllParams) => Promise<void>;
  };
  destroy: (id: string, options: CallbackOptions) => Promise<void>;
  destroying: boolean;
  update: (id: string, data: FormInput, options: CallbackOptions) => Promise<void>;
  updating: boolean;
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
    from: 0,
    to: 0,
  });

  const [destroying, setDestroying] = useState(false);
  const [updating, setUpdating] = useState(false);

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

          const { data } = req;
          setSelectItems(normalizeCollection(data, 'value', force ? [] : allItems.ids));
        }
      } catch (e) {
        //
      } finally {
        setSelectLoading(false);
      }
    },
    [selectFetched, selectLoading],
  );

  const fetchAll = useCallback(async (options?: FetchAllParams) => {
    const force = options?.force;

    if ((!force && allFetched) || allLoading) {
      return;
    }

    setAllLoading(true);

    try {
      const req = await api.difficulties.all(options?.params);

      if (req.success) {
        const { data, meta } = req;
        setAllItems(normalizeCollection(data, 'id', force ? [] : allItems.ids));
        setPagination({
          currentPage: meta.current_page,
          total: meta.total,
          perPage: meta.per_page,
          from: meta.from,
          to: meta.to,
        });

        setAllFetched(true);
      }
    } catch (e) {
      //
    } finally {
      setAllLoading(false);
    }
  }, []);

  const removeItem = useCallback(
    (id: string) => {
      const newItems = { ...allItems };

      if (newItems.byId[id]) {
        delete newItems.byId[id];
      }

      for (let i = 0; i <= newItems.ids.length; i += 1) {
        const val = newItems.ids[i];
        if (id === val) {
          newItems.ids.splice(i, 1);
          return;
        }
      }

      setAllItems(newItems);
    },
    [allItems],
  );

  const updateItem = useCallback((id: string, data: FormInput) => {
    const newItems = { ...allItems };

    if (newItems[id]) {
      newItems[id] = {
        ...newItems[id],
        ...data,
      };

      setAllItems(newItems);
    }
  }, []);

  const update = useCallback(async (id: string, data: FormInput, options?: CallbackOptions) => {
    setUpdating(true);
    try {
      const res = await api.difficulties.update(id, data);

      if (res.success) {
        updateItem(id, data);
      }
    } catch (e: any) {
      if (options?.onError) {
        options.onError(e);
      }
    } finally {
      setUpdating(false);
    }
  }, []);

  const destroy = useCallback(async (id: string, options?: CallbackOptions) => {
    setDestroying(true);
    try {
      const res = await api.difficulties.destroy(id);

      if (res) {
        removeItem(id);
      }
    } catch (e: any) {
      if (options?.onError) {
        options.onError(e);
      }
    } finally {
      setDestroying(false);
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
    all: {
      ...allItems,
      items: denormalizeCollection(allItems),
      fetch: fetchAll,
      loading: allLoading,
      fetched: allFetched,
      pagination,
    },
    destroy,
    destroying,
    update,
    updating,
  };
};
