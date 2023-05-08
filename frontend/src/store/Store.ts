import axios from "axios";
import { create } from "zustand";

export interface ItemProps {
  id: number;
  item: string;
  location: string;
  price: number;
}

interface ICustomHookProps {
  items: ItemProps[];
  totalPages: number;
  currentPage: number;
  setTotalPages: (totalPages: number) => void;
  setCurrentPage: (currentPage: number) => void;
  setItems: (item: ItemProps[]) => void;
  getData: (page?: number, limit?: number) => Promise<void>;
}
interface IGetInventoryResponse {
  rows: ItemProps[];
  count: number;
}
interface ItemsDataProps {
  
  totalPages: number;
  currentPage: number;
}

export const useItemsData = create<ICustomHookProps>((set) => ({
  items: [],
  totalPages: 0,
  currentPage: 1,
  setTotalPages: (totalPages: number) => set({ totalPages }),
  setCurrentPage: (currentPage: number) => set({ currentPage }),
  setItems: (items: ItemProps[]) => set({ items }),
  getData: async (page = 1, limit = 20) => {
    try {
      const response = await axios.get<IGetInventoryResponse>(
        "http://localhost:3001/Inventory"
      );
      const { rows: items, count } = response.data;
      useItemsData.setState({
        items,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (error) {
      console.log(error);
    }
  },
}));

async function getData() {
  try {
    const response = await axios.get<ItemProps[]>(
      "http://localhost:3001/Inventory"
    );
    const items = response.data;
    useItemsData.setState({ items });
    console.log(items);
  } catch (error) {
    console.log(error);
  }
}
getData();
