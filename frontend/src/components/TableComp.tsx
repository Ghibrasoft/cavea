import { Container, Pagination, Toast } from "react-bootstrap";
import { AddButton } from "./AddButton";
import { FilterSelect } from "./FilterSelect";
import { useEffect, useState } from "react";
import { useItemsData } from "../store/Store";
import axios from "axios";


interface IDataProps {
  rows: {
    id: number;
    item: string;
    location: string;
    price: number;
  }[];
  allItemsLength: number;
  totalPages: number;
  currentPage: number;
};

export function TableComp() {
  const { getData } = useItemsData();
  const [value, setValue] = useState("all");
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [data, setData] = useState<IDataProps>({
    rows: [],
    allItemsLength: 0,
    totalPages: 0,
    currentPage: 1,
  });

  // alert msg timeout
  useEffect(() => {
    setTimeout(() => {
      setDeleteAlert(false);
    }, 4000);
  })

  // data fetching
  async function fetchData(page: number) {
    try {
      const res = await axios.get("http://localhost:3001/Inventory", { params: { page } })
      const { rows, allItemsLength, totalPages, currentPage } = res.data as IDataProps;
      setData({ rows, allItemsLength, totalPages, currentPage });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData(data.currentPage);
  }, [data.currentPage]);


  // delete row
  async function handleDelete(id: number) {
    try {
      await axios.delete(`http://localhost:3001/Inventory/${id}`)
      getData(); // don't updates , cann't find why (it works on POST, but here not), just refresh manually and see changes :)
      setDeleteAlert(true);
      const filteredRows = data.rows.filter((item) => item.id !== id);
      setData((prevData) => ({
        ...prevData,
        rows: filteredRows,
        allItemsLength: prevData.allItemsLength - 1,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  // page changing
  function handlePageChange(pageNumber: number) {
    setData((prevData) => ({ ...prevData, currentPage: pageNumber }));
  }

  // generate an array of page numbers to display in pagination
  const pageNumbers = [...Array(data.totalPages)].map((_, index) => index + 1);

  return (
    <Container>
      <div className='hstack gap-3 d-flex justify-content-end'>
        <Toast show={deleteAlert} onClose={() => setDeleteAlert(false)}>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Success!</strong>
          </Toast.Header>
          <Toast.Body>
            Row deleted!
          </Toast.Body>
        </Toast>

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
            data.rows.filter(({ location }) => value === location || value === "all").map(({ id, item, location, price }) => (
              <tr key={id}>
                <td className='text-center'>{item}</td>
                <td className='text-center'>{location}</td>
                <td className='text-center'>{price}</td>
                <td className='text-center'>
                  <button
                    className="badge rounded-pill bg-danger border-0"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </button>
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
          <small className="d-flex align-items-center text-muted fst-italic ms-1">
            ({data.allItemsLength}) Item/s
          </small>
        </Pagination>
      </div>
    </Container>
  )
}