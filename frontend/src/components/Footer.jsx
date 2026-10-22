export default function Footer() {
  return (
    <>
      <div className="mt-8 flex flex-col items-start justify-between space-y-4 bg-black px-8 py-8 text-sm text-white md:flex-row md:space-y-0 md:px-[300px] md:text-base">
        <div className="flex flex-col text-white">
          <p>Featured Blogs</p>
          <p>Most viewed</p>
          <p>Readers Choice</p>
        </div>
        <div className="flex flex-col text-white">
          <p>Forum</p>
          <p>Support</p>
          <p>Recent Posts</p>
        </div>
        <div className="flex flex-col text-white">
          <p>Privacy Policy</p>
          <p>About Us</p>
          <p>Terms &amp; Conditions</p>
          <p>Terms of Service</p>
        </div>
      </div>
      <p className="bg-black py-2 pb-6 text-center text-sm text-white">
        All rights reserved @Blog Market {new Date().getFullYear()}
      </p>
    </>
  )
}
