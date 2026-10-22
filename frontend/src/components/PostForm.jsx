import { useState } from 'react'
import { ImCross } from 'react-icons/im'
import { imgSrc } from '../url'

// Shared by "Create a post" and "Edit post"
export default function PostForm({ heading, submitLabel, initial, onSubmit, error }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [desc, setDesc] = useState(initial?.desc || '')
  const [file, setFile] = useState(null)
  const [cat, setCat] = useState('')
  const [cats, setCats] = useState(initial?.categories || [])
  const [busy, setBusy] = useState(false)

  const addCategory = () => {
    const c = cat.trim()
    if (c && !cats.includes(c)) setCats([...cats, c])
    setCat('')
  }
  const deleteCategory = (i) => setCats(cats.filter((_, idx) => idx !== i))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    await onSubmit({ title, desc, categories: cats, file })
    setBusy(false)
  }

  const input = 'w-full border border-gray-300 px-4 py-2 outline-none'

  return (
    <div className="mt-8 px-6 md:px-[200px]">
      <h1 className="mt-8 text-xl font-bold md:text-2xl">{heading}</h1>
      <form onSubmit={submit} className="mt-4 flex w-full flex-col space-y-4 md:space-y-8">
        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Enter post title" className={input} required />

        <div>
          {initial?.photo && !file && (
            <img src={imgSrc(initial.photo)} alt="current" className="mb-2 h-32 rounded-md object-cover" />
          )}
          <input onChange={(e) => setFile(e.target.files[0])} type="file" accept="image/*" className={input} />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-4 md:space-x-8">
            <input
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory() } }}
              className="border border-gray-300 px-4 py-2 outline-none"
              placeholder="Enter post category"
              type="text"
            />
            <div onClick={addCategory} className="cursor-pointer bg-black px-4 py-2 font-semibold text-white">Add</div>
          </div>
          <div className="mt-3 flex flex-wrap px-4">
            {cats.map((c, i) => (
              <div key={i} className="mb-2 mr-4 flex items-center justify-center space-x-2 rounded-md bg-gray-200 px-2 py-1">
                <p>{c}</p>
                <p onClick={() => deleteCategory(i)} className="cursor-pointer rounded-full bg-black p-1 text-sm text-white">
                  <ImCross />
                </p>
              </div>
            ))}
          </div>
        </div>

        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={10} className={input} placeholder="Enter post description" required />

        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={busy} type="submit" className="mx-auto w-full bg-black px-4 py-2 text-lg font-semibold text-white disabled:opacity-60 md:w-[20%] md:text-xl">
          {busy ? 'Please wait...' : submitLabel}
        </button>
      </form>
    </div>
  )
}
