import { AiFillDelete } from 'react-icons/ai';
import { AddButton } from './AddButton';
import { FilterSelect } from './FilterSelect';
import '../styles/table.css';
import { useEffect, useState } from 'react';
import { Container, Pagination } from 'react-bootstrap';
import { useItemsData } from '../store/Store';
import axios from 'axios';


export function TableComp() {
  const { items, totalPages, currentPage, getData } = useItemsData();
  const [value, setValue] = useState("all");

  // delete item row
  async function handleDelete(id: number) {
    try {
      await axios.delete(`http://localhost:3001/Inventory/${id}`)
      getData();
    } catch (error) {
      console.log(error);
    }
  }
  

  console.log("from tableComp", items)
  return (
    <Container>
      {/* add button  & filter */}
      <div className='hstack gap-3 d-flex justify-content-end'>
        <AddButton />
        <FilterSelect setValue={setValue} />
      </div>

      {/* table */}
      <table className="table table-striped table-borderless">
        <thead className="table-success">
          <tr>
            <th scope="col" className='text-center'>ნივთის სახელი</th>
            <th scope="col" className='text-center'>ადგილმდებარეობა</th>
            <th scope="col" className='text-center'>ფასი (₾)</th>
            <th scope="col" className='text-center'>ოპერაციები</th>
          </tr>
        </thead>
        {/* display with filtering by branch of cavea */}
        <tbody>
          {
            Array.isArray(items) && items.map(({ id, item, location, price }) => (
              <tr key={id}>
                <td className='text-center'>{item}</td>
                <td className='text-center'>{location}</td>
                <td className='text-center'>{price}</td>
                <td className='text-center'><AiFillDelete className='del-icon' onClick={() => handleDelete(id)} /></td>
              </tr>
            ))
          }
        </tbody>
      </table>

      {/* new pagination */}
      {/* <div>
        <Pagination>
          <Pagination.Prev />
          <Pagination.Item active>{currentPage}</Pagination.Item>
          <Pagination.Item>{currentPage + 1}</Pagination.Item>
          <Pagination.Item>{currentPage + 2}</Pagination.Item>
          <Pagination.Ellipsis />
          <Pagination.Item>{totalPages}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
        <span>{items.length}</span>
      </div> */}


    </Container>
  )
}