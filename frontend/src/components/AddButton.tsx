import { Button } from 'react-bootstrap'
import { IoMdAdd } from 'react-icons/io'
import { Link } from 'react-router-dom'


export function AddButton() {
    return (
        <Link to="/addform">
            <Button className='my-3 d-flex justify-content-center align-items-center'>
                <IoMdAdd size={20} /> Add
            </Button>
        </Link>

    )
}
