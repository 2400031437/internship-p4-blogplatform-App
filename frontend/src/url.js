import axios from 'axios'

// Backend address (change in frontend/.env -> VITE_API_URL)
export const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
export const IF = URL + '/images/' // folder where uploaded pictures are served

// send the JWT cookie with every request
axios.defaults.withCredentials = true

const placeholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#e5e7eb"/><text x="300" y="210" font-family="Arial" font-size="28" fill="#6b7280" text-anchor="middle">No image</text></svg>'
  )

// full image address for a stored file name
export const imgSrc = (photo) => (!photo ? placeholder : photo.startsWith('http') ? photo : IF + photo)

export const errMsg = (err, fallback = 'Something went wrong') => err?.response?.data?.message || fallback
