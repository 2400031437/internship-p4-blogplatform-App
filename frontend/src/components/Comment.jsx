import { MdDelete } from 'react-icons/md'

export default function Comment({ c, canDelete, onDelete }) {
  return (
    <div className="my-2 rounded-lg bg-gray-200 px-2 py-2">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-600">@{c.author}</h3>
        <div className="flex items-center justify-center space-x-4">
          <p className="text-sm text-gray-500">{new Date(c.updatedAt).toDateString()}</p>
          <p className="text-sm text-gray-500">{new Date(c.updatedAt).toLocaleTimeString().slice(0, 5)}</p>
          {canDelete && (
            <p className="cursor-pointer" onClick={() => onDelete(c._id)}>
              <MdDelete />
            </p>
          )}
        </div>
      </div>
      <p className="mt-2 px-4">{c.comment}</p>
    </div>
  )
}
