import { Container, Pagination, Toast } from "react-bootstrap";
import { AddButton } from "./AddButton";
import { FilterSelect } from "./FilterSelect";
import { useEffect, useState } from "react";
import { useItemsData } from "../store/Store";

type EditedRowTypes = {
  item: string;
  location: string;
  price: number;
}

export function TableComp() {
  const { fetchData, updateRow, deleteRow, setCurrentPage, rows, currentPage, totalPages, allItemsLength } = useItemsData();
  const [value, setValue] = useState("all");
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const [editedRow, setEditedRow] = useState<EditedRowTypes>({
    item: "",
    location: "",
    price: 0,
  });
  // generate an array of page numbers to display in pagination
  const pageNumbers = [...Array(totalPages)].map((_, index) => index + 1);

  // alert msg
  useEffect(() => {
    setTimeout(() => {
      setDeleteAlert(false);
    }, 3000);
  }, [deleteAlert]);

  // edit row
  function updateRowField(id: string) {
    updateRow(id, rows, editedRow)
      .then(() => {
        fetchData(currentPage, 20);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  // delete row
  async function handleDelete(id: string) {
    deleteRow(id, rows)
      .then(() => {
        setDeleteAlert(true);
        fetchData(currentPage, 20);
      })
  }

  // page changing
  function handlePageChange(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  // data fetching
  useEffect(() => {
    fetchData(currentPage, 20);
  }, [currentPage, fetchData])

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
          {
            rows.filter(({ location }) => value === location || value === "all").map(({ id, item, location, price }) => (
              <tr key={id}>
                <td className='text-center'>
                  <div className="d-flex justify-content-center text-center">
                    {
                      editMode && selectedRow === id ?
                        <input
                          type="text"
                          defaultValue={item}
                          className="form-control form-control-sm text-center"
                          style={{ width: "fit-content" }}
                          onChange={(e) => setEditedRow({ ...editedRow, item: e.target.value })}
                        />
                        :
                        item
                    }
                  </div>
                </td>
                <td className='text-center'>
                  <div className="d-flex justify-content-center text-center">
                    {
                      editMode && selectedRow === id ?
                        <input
                          type="text"
                          defaultValue={location}
                          className="form-control form-control-sm text-center"
                          style={{ width: "fit-content" }}
                          onChange={(e) => setEditedRow({ ...editedRow, location: e.target.value })}
                        />
                        :
                        location
                    }
                  </div>
                </td>
                <td className='text-center'>
                  <div className="d-flex justify-content-center">
                    {
                      editMode && selectedRow === id ?
                        <input
                          type="number"
                          defaultValue={price}
                          className="form-control form-control-sm text-center"
                          style={{ width: "fit-content" }}
                          onChange={(e) => setEditedRow({ ...editedRow, price: Number(e.target.value) })}
                        />
                        :
                        price
                    }
                  </div>
                </td>
                <td className='text-center'>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    {
                      editMode && selectedRow === id ?
                        <>
                          <button
                            className="badge rounded-pill bg-success border-0"
                            onClick={() => { setEditMode(false); updateRowField(id) }}
                          >
                            Update
                          </button>
                          <button
                            className="badge rounded-pill bg-danger border-0"
                            onClick={() => { setEditMode(false); updateRowField(id) }}
                          >
                            Cancel
                          </button>
                        </>
                        :
                        <>
                          <button
                            className="badge rounded-pill bg-warning border-0"
                            onClick={() => { setEditMode(true); setSelectedRow(id) }}>
                            Edit
                          </button>
                          <button
                            className="badge rounded-pill bg-danger border-0"
                            onClick={() => handleDelete(id)}
                          >
                            Delete
                          </button>
                        </>
                    }
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-end align-items-center">
        <Pagination>
          <Pagination.Prev
            onClick={() =>
              handlePageChange(Math.max(currentPage - 1, 1))
            }
          />

          {
            pageNumbers.map((pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            ))
          }
          <Pagination.Next
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
          />
          <small className="d-flex align-items-center text-muted fst-italic ms-1">
            ({allItemsLength}) Item/s
          </small>
        </Pagination>
      </div>
    </Container>
  )
}