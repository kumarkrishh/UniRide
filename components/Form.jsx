import Link from 'next/link';
import AddressInput from './AddressInput';

const Form = ({
  type, post, setPost, submitting, handleSubmit }) => {
  return (
    <section className='w-full max-w-full flex-start flex-col px-20'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'> {type} Post </span>
      </h1>
      <AddressInput />
       
    </section>
  )
}

export default Form