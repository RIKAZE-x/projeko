'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data);
    } catch (e) {
      console.error(e);
      alert('Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password for quick security
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const downloadExcel = async () => {
    const XLSX = await import('xlsx');
    // We want to flatten the submissions into a nice table. 
    // Submissions are stored as [{id, timestamp, responses: [{category, question, yesNo, score, reason, suggestion, remark}]}]
    const rows: any[] = [];

    submissions.forEach(sub => {
      sub.responses.forEach((resp: any) => {
        rows.push({
          "Submission ID": sub.id,
          "Timestamp": new Date(sub.timestamp).toLocaleString(),
          "Category": resp.category,
          "Question": resp.question,
          "Yes/No": resp.yesNo,
          "Score": resp.score,
          "Reason": resp.reason,
          "Crew Suggestion": resp.suggestion,
          "Remark": resp.remark
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");
    XLSX.writeFile(workbook, "Crew_Feedback_Results.xlsx");
  };

  const downloadCSV = async () => {
    const XLSX = await import('xlsx');
    const rows: any[] = [];
    submissions.forEach(sub => {
      sub.responses.forEach((resp: any) => {
        rows.push({
          "Submission ID": sub.id,
          "Timestamp": new Date(sub.timestamp).toLocaleString(),
          "Category": resp.category,
          "Question": resp.question,
          "Yes/No": resp.yesNo,
          "Score": resp.score,
          "Reason": resp.reason,
          "Crew Suggestion": resp.suggestion,
          "Remark": resp.remark
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Crew_Feedback_Results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">Only authorized admins can access and download the survey results.</p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">View and download crew feedback submissions.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadCSV}
              disabled={submissions.length === 0}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 shadow-sm"
            >
              Download CSV
            </button>
            <button 
              onClick={downloadExcel}
              disabled={submissions.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 shadow-sm"
            >
              Download Excel
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 ml-2"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center">
              <h2 className="text-xl font-medium text-gray-800 mb-2">No Submissions Yet</h2>
              <p className="text-gray-500">When crew members submit feedback, it will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                    <th className="px-6 py-4 font-medium text-gray-600 text-left">Date</th>
                    <th className="px-6 py-4 font-medium text-gray-600">ID</th>
                    <th className="px-6 py-4 font-medium text-gray-600">Total Responses</th>
                    <th className="px-6 py-4 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {submissions.map((sub, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {new Date(sub.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {sub.id}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {sub.responses?.length || 0} questions answered
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => alert('Please download Excel or CSV to view full response details.')}
                          className="text-blue-600 hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
