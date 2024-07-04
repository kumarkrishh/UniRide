import Link from 'next/link';
import AddressInput from './AddressInput';

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  return (
    <section className='w-full max-w-full flex flex-col items-center px-6 md:px-20 min-h-screen bg-[#141d26] text-white'>
      <h1 className='text-4xl md:text-5xl font-bold text-center mt-10'>
        <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600'>Find Rideshares</span>
      </h1>
      <AddressInput />
    </section>
  )
}

export default Form;
