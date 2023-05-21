import axios from "axios";
import { create } from "zustand";

export interface ItemProps {
  id: string;
  item: string;
  location: string;
  price: number;
}

interface IEditedRow {
  item: string;
  location: string;
  price: number;
}

interface IFormData {
  [k: string]: FormDataEntryValue;
}

interface ICustomHookProps {
  totalPages: number;
  currentPage: number;
  allItemsLength: number;
  rows: ItemProps[];
  setTotalPages: (totalPages: number) => void;
  setCurrentPage: (currentPage: number) => void;
  fetchData: (page?: number, limit?: number) => Promise<void>;
  addItem: (data: IFormData) => Promise<void>;
  updateRow: (
    id: string,
    rows: ItemProps[],
    editedRow: IEditedRow
  ) => Promise<void>;
  deleteRow: (id: string, rows: ItemProps[]) => Promise<void>;
}

export const useItemsData = create<ICustomHookProps>((set) => ({
  rows: [],
  currentPage: 1,
  totalPages: 0,
  allItemsLength: 0,
  setTotalPages: (totalPages: number) => set({ totalPages }),
  setCurrentPage: (currentPage: number) => set({ currentPage }),
  fetchData: async (page = 1, limit = 20) => {
    try {
      const res = await axios.get("http://localhost:3001/Inventory", {
        params: { page, limit },
      });
      set(res.data);
    } catch (error) {
      console.log(error);
    }
  },
  addItem: async (data: IFormData) => {
    const { item, location, price } = data;
    try {
      await axios.post("http://localhost:3001/Inventory", {
        item,
        location,
        price,
      });
    } catch (error) {
      console.log(error);
    }
  },
  updateRow: async (id: string, rows: ItemProps[], editedRow: IEditedRow) => {
    try {
      // finding row to update
      const rowToUpdate = rows.find((row) => row.id === id);
      if (!rowToUpdate) {
        throw new Error(`Couldn't find a row with ID : ${id}`);
      }

      // making request to the server
      const updatedData = await axios.put(
        `http://localhost:3001/Inventory/${id}`,
        {
          item: editedRow.item,
          location: editedRow.location,
          price: editedRow.price,
        }
      );

      // check if row ID matches, a new obj is created with updated data, otherwise, the existing row object is used
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, ...updatedData.data } : row
      );

      // update rows array in the store object with the new array of updated employee data
      set({ rows: updatedRows });
    } catch (error) {
      console.log(error);
    }
  },
  deleteRow: async (id: string, rows: ItemProps[]) => {
    try {
      await axios.delete(`http://localhost:3001/Inventory/${id}`);
      const filteredRows = rows.filter((row) => row.id !== id);
      set({ rows: filteredRows });
    } catch (error) {
      console.log(error);
    }
  },
}));
