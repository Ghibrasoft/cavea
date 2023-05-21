import { Button, Container, Form } from 'react-bootstrap';
import { IoMdAdd } from 'react-icons/io';
import { useItemsData } from '../store/Store';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';


export function AddForm() {
  const { fetchData, addItem, currentPage } = useItemsData();
  const navigate = useNavigate();


  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData(formRef.current!);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    addItem(data);
    fetchData(currentPage, 20);
    navigate('/');
  }

  return (
    <Container className='d-flex justify-content-center'>
      <div className='bg-light p-5 mt-5 border rounded'>
        <h1 className='text-center fw-bold mb-3'>
          Add new item
        </h1>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className='vstack gap-3'>

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

            {/* inputs div */}
            <div className='form-group form-floating'>
              <input
                className='form-control'
                name='item'
                id='item'
                type='text'
                placeholder=' '
                required
              />
              <label htmlFor='item' className='form-label'>სახელი...</label>
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

            {/* buttons div */}
            <div className='hstack gap-3 d-flex justify-content-center'>
              <div>
                <Button
                  type='submit'
                  variant='outline-primary'
                  className='d-flex justify-content-center align-items-center'
                >
                  <IoMdAdd size={20} /> Add
                </Button>
              </div>
              <div>
                <Button
                  type='reset'
                  variant='outline-danger'
                  className='d-flex justify-content-center align-items-center'
                >
                  Reset
                </Button>
              </div>
            </div>

          </div>
        </Form>
      </div>
    </Container>
  )
}
