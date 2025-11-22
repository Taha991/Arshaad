export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container-xl py-6 text-sm text-gray-600" role="contentinfo">
        © {new Date().getFullYear()} Know Your Path. All rights reserved.
      </div>
    </footer>
  )
}