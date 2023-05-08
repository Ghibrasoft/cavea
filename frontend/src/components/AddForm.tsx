import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { IoMdAdd } from 'react-icons/io';
import { useItemsData } from '../store/Store';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface IProps {
  id: number;
  item: string;
  location: string;
  price: number;
}

export function AddForm() {
  const { getData } = useItemsData();
  const navigate = useNavigate();

  // get form data
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData(formRef.current!);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const { item, location, price } = data;

    await axios.post<IProps>("http://localhost:3001/Inventory", {
      item, location, price
    })
    navigate('/');
    getData();
  }

  return (
    <Form
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <div className='vstack gap-3 mx-auto w-50'>

        {/* select div */}
        <div>
          <select className="form-select" name='location' required>
            <option value="" className='text-muted'>ადგილმდებარეობა...</option>
            <option value="Head Office">მთავარი ოფისი</option>
            <option value="Cavea Tbilisi Mall">კავეა თბილისი მოლი</option>
            <option value="Cavea City Mall">კავეა სითი მოლი</option>
            <option value="Cavea East Point">კავეა ისთ ფოინთი</option>
            <option value="Cavea Gallery">კავეა გალერეა</option>
          </select>
        </div>

        {/* inputs div(stack) */}
        <div className='hstack gap-3'>
          <div className='form-group form-floating'>
            <input
              className='form-control'
              name='item'
              id='item'
              type='text'
              placeholder=' '
              required
            />
            <label htmlFor='title' className='form-label'>სახელი...</label>
          </div>
          <div className='form-froup form-floating'>
            <input
              className='form-control'
              name='price'
              id='price'
              type='number'
              placeholder=' '
              required
            />
            <label htmlFor='price' className='form-label'>ფასი...</label>
          </div>

          {/* buttons div(stack) */}
          <div className='hstack gap-3'>
            <Button
              type='submit'
              variant='outline-primary'
              className='my-3 d-flex justify-content-center align-items-center'
            >
              <IoMdAdd size={20} /> Add
            </Button>
            <div className="vr"></div>
            <Button
              type='reset'
              variant='outline-danger'
            >
              Reset
            </Button>
          </div>
        </div>

      </div>
    </Form>
  )
}
