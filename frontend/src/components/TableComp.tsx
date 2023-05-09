import { Container, Pagination } from "react-bootstrap";
import { AddButton } from "./AddButton";
import { FilterSelect } from "./FilterSelect";
import { useEffect, useState } from "react";
import { useItemsData } from "../store/Store";
import axios from "axios";
import { AiFillDelete } from 'react-icons/ai'
import '../styles/table.css';

export function TableComp() {
  const { getData } = useItemsData();
  const [value, setValue] = useState("all");
  const [data, setData] = useState({
    rows: [],
    allItemsLength: 0,
    totalPages: 0,
    currentPage: 1,
  });

  async function fetchData(page: number) {
    try {
      const res = await axios.get("http://localhost:3001/Inventory", { params: { page } })
      const { rows, allItemsLength, totalPages, currentPage } = res.data;
      setData({ rows, allItemsLength, totalPages, currentPage });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData(data.currentPage);
  }, [data.currentPage]);

  async function handleDelete(id: number) {
    try {
      await axios.delete(`http://localhost:3001/Inventory/${id}`)
      getData();
    } catch (error) {
      console.log(error);
    }
  }

  function handlePageChange(pageNumber: number) {
    setData((prevData) => ({ ...prevData, currentPage: pageNumber }));
  }

  // Generate an array of page numbers to display in pagination
  const pageNumbers = [...Array(data.totalPages)].map((_, index) => index + 1);

  return (
    <Container>
      <div className='hstack gap-3 d-flex justify-content-end'>
        <AddButton />
        <FilterSelect setValue={setValue} />
      </div>

      <table className="table table-striped table-borderless">
        <thead className="table-success">
          <tr>
            <th scope="col" className='text-center'>ნივთის სახელი</th>
            <th scope="col" className='text-center'>ადგილმდებარეობა</th>
            <th scope="col" className='text-center'>ფასი (₾)</th>
            <th scope="col" className='text-center'>ოპერაციები</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data.rows) &&
            data.rows.map(({ id, item, location, price }) => (
              <tr key={id}>
                <td className='text-center'>{item}</td>
                <td className='text-center'>{location}</td>
                <td className='text-center'>{price}</td>
                <td className='text-center'>
                  <AiFillDelete
                    cursor="pointer"
                    className='del-icon'
                    onClick={() => handleDelete(id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-end align-items-center">
        <Pagination>
          <Pagination.Prev
            onClick={() =>
              handlePageChange(Math.max(data.currentPage - 1, 1))
            }
          />
          {pageNumbers.map((pageNumber) => (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === data.currentPage}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              handlePageChange(Math.min(data.currentPage + 1, data.totalPages))
            }
          />
          <small className="d-flex align-items-center text-muted fst-italic ms-1">({data.allItemsLength}) Total</small>
        </Pagination>
      </div>
    </Container>
  )
}