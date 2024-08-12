import PromptCard from "./PromptCard"

const Profile = ({name, desc, data, handleEdit, handleDelete}) => {
  return (
    <section className="w-full px-20">
      <h1 className='text-4xl md:text-5xl font-bold text-left mt-10'>
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600'>{name}</span>
        </h1>
      <p className="desc text-left">{desc}</p>
      <div className='mt-10 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleEdit={() => handleEdit && handleEdit(post)}
          handleDelete={() => handleDelete && handleDelete(post)}
        />
      ))}
    </div>
    </section>
  )
}

export default Profile