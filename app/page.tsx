'use client';

import { useState } from 'react';
import { questionsData } from '@/lib/data';

export default function Home() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Record<number, any>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentCategory = questionsData[currentCategoryIndex];
  const isLastCategory = currentCategoryIndex === questionsData.length - 1;

  const handleAnswerChange = (qIndex: number, field: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentCategoryIndex]: {
        ...(prev[currentCategoryIndex] || {}),
        [qIndex]: {
          ...((prev[currentCategoryIndex] || {})[qIndex] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentCategoryIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentCategoryIndex((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Flatten answers layout for submission
    const flattenedAnswers = [];
    for (let cIdx = 0; cIdx < questionsData.length; cIdx++) {
      const categoryLabel = questionsData[cIdx].category;
      for (let qIdx = 0; qIdx < questionsData[cIdx].questions.length; qIdx++) {
        const questionText = questionsData[cIdx].questions[qIdx];
        const ans = (answers[cIdx] || {})[qIdx] || {};
        flattenedAnswers.push({
          category: categoryLabel,
          question: questionText,
          yesNo: ans.yesNo || '',
          score: ans.score || '',
          reason: ans.reason || '',
          suggestion: ans.suggestion || '',
          remark: ans.remark || ''
        });
      }
    }

    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: flattenedAnswers })
      });
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">Your feedback has been submitted successfully.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            NRS - Crew Feedback
          </h1>
          <p className="text-center text-gray-500 mb-8 pb-8 border-b border-gray-100">
            Please fill out the questionnaire below. Your feedback helps us improve safety, teamwork, and operational excellence onboard.
          </p>

          <div className="mb-6 flex items-center justify-between text-sm font-medium text-gray-500">
            <span>Part {currentCategoryIndex + 1} of {questionsData.length}</span>
            <span>{Math.round(((currentCategoryIndex) / questionsData.length) * 100)}% Completed</span>
          </div>
          
          <div className="w-full bg-gray-100 h-2 rounded-full mb-10 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${((currentCategoryIndex + 1) / questionsData.length) * 100}%` }}
            />
          </div>

          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full text-sm">
              {currentCategoryIndex + 1}
            </span>
            {currentCategory.category}
          </h2>

          <div className="space-y-10">
            {currentCategory.questions.map((q, qIndex) => {
              const currentAns = (answers[currentCategoryIndex] || {})[qIndex] || {};
              return (
                <div key={qIndex} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <p className="font-medium text-lg mb-4 text-gray-800">{q}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      {/* Yes / No */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Yes / No</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name={`yesno-${currentCategoryIndex}-${qIndex}`} 
                              value="Yes"
                              checked={currentAns.yesNo === 'Yes'}
                              onChange={(e) => handleAnswerChange(qIndex, 'yesNo', e.target.value)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name={`yesno-${currentCategoryIndex}-${qIndex}`} 
                              value="No"
                              checked={currentAns.yesNo === 'No'}
                              onChange={(e) => handleAnswerChange(qIndex, 'yesNo', e.target.value)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span>No</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name={`yesno-${currentCategoryIndex}-${qIndex}`} 
                              value="N/A"
                              checked={currentAns.yesNo === 'N/A'}
                              onChange={(e) => handleAnswerChange(qIndex, 'yesNo', e.target.value)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span>N/A</span>
                          </label>
                        </div>
                      </div>

                      {/* Score */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Score (Optional 1-5)</label>
                        <select 
                          className="w-full md:w-32 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={currentAns.score || ''}
                          onChange={(e) => handleAnswerChange(qIndex, 'score', e.target.value)}
                        >
                          <option value="">-</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Reason */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Reason</label>
                        <textarea 
                          rows={2}
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Provide a reason..."
                          value={currentAns.reason || ''}
                          onChange={(e) => handleAnswerChange(qIndex, 'reason', e.target.value)}
                        />
                      </div>
                      
                      {/* Suggestion */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Crew Suggestion</label>
                        <textarea 
                          rows={2}
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Your suggestion..."
                          value={currentAns.suggestion || ''}
                          onChange={(e) => handleAnswerChange(qIndex, 'suggestion', e.target.value)}
                        />
                      </div>

                      {/* Remark */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Remark</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Any additional remarks..."
                          value={currentAns.remark || ''}
                          onChange={(e) => handleAnswerChange(qIndex, 'remark', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentCategoryIndex === 0}
              className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {isLastCategory ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 transition-colors shadow-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-2.5 rounded-lg font-medium text-white bg-gray-900 hover:bg-black transition-colors shadow-sm"
              >
                Next
              </button>
            )}
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-400 pb-10">
          <p>&copy; {new Date().getFullYear()} NRS Crew Database.</p>
          <a href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors mt-2 inline-block">
            Admin Access
          </a>
        </footer>
      </div>
    </main>
  );
}
