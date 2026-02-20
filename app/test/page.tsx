'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Test Page</h1>
        <p className="text-lg">If you can see this, the app is working!</p>
        <div className="mt-6">
          <a 
            href="/dashboard" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-indigo-700"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
