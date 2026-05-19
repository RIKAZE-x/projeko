export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">404 - Not Found</h1>
        <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
        <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go Home</a>
      </div>
    </div>
  );
}
