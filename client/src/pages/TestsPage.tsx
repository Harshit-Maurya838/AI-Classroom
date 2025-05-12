import React, { useState } from 'react';
import { mockTests, mockInterviews } from '../utils/mockData';
import { Test, Interview, MCQQuestion } from '../types';
import { FileQuestion, Clock, Calendar, CheckCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const TestsPage: React.FC = () => {
  const [tests, setTests] = useState<Test[]>(mockTests);
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: number }>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [interviewSubmitted, setInterviewSubmitted] = useState(false);
  const [interviewAnswers, setInterviewAnswers] = useState<{ [questionId: string]: string }>({});
  
  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: optionIndex,
    });
  };
  
  const handleSubmitTest = () => {
    if (!activeTest) return;
    
    // Calculate score
    let correctAnswers = 0;
    let totalQuestions = activeTest.questions.length;
    
    activeTest.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Update test with score
    const updatedTests = tests.map(test => 
      test.id === activeTest.id
        ? { ...test, completed: true, score }
        : test
    );
    
    setTests(updatedTests);
    setTestSubmitted(true);
  };
  
  const handleInterviewAnswerChange = (questionIndex: number, answer: string) => {
    if (!activeInterview) return;
    
    setInterviewAnswers({
      ...interviewAnswers,
      [`q${questionIndex}`]: answer,
    });
  };
  
  const handleSubmitInterview = () => {
    if (!activeInterview) return;
    
    // Update interview as completed
    const updatedInterviews = interviews.map(interview => 
      interview.id === activeInterview.id
        ? { 
            ...interview, 
            completed: true, 
            feedback: 'Your responses show a good understanding of the core concepts. Continue practicing application in real-world scenarios.'
          }
        : interview
    );
    
    setInterviews(updatedInterviews);
    setInterviewSubmitted(true);
  };
  
  const startTest = (test: Test) => {
    setActiveTest(test);
    setUserAnswers({});
    setTestSubmitted(false);
  };
  
  const startInterview = (interview: Interview) => {
    setActiveInterview(interview);
    setInterviewAnswers({});
    setInterviewSubmitted(false);
  };
  
  const resetTest = () => {
    setActiveTest(null);
    setUserAnswers({});
    setTestSubmitted(false);
  };
  
  const resetInterview = () => {
    setActiveInterview(null);
    setInterviewAnswers({});
    setInterviewSubmitted(false);
  };
  
  const formatDueDate = (date: Date) => {
    const today = new Date();
    const dueDate = new Date(date);
    
    // Calculate difference in days
    const diffTime = Math.abs(dueDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return dueDate.toLocaleDateString();
  };
  
  if (activeTest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTest.title}
              </h1>
              
              <button
                onClick={resetTest}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Back to Tests
              </button>
            </div>
            
            {testSubmitted ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold text-green-800 mb-2">Test Completed!</h2>
                  <p className="text-green-700">
                    Your score: <span className="font-bold">{activeTest.score}%</span>
                  </p>
                </div>
                
                <div className="space-y-4 mt-6">
                  <h3 className="font-semibold text-gray-800 text-lg">Review Your Answers</h3>
                  
                  {activeTest.questions.map((question, qIndex) => {
                    const userAnswer = userAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <div 
                        key={question.id}
                        className={`border rounded-lg p-4 ${
                          isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <p className="font-medium text-gray-800 mb-3">
                          {qIndex + 1}. {question.question}
                        </p>
                        
                        <div className="space-y-2 mb-3">
                          {question.options.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className={`p-3 rounded-md ${
                                oIndex === question.correctAnswer
                                  ? 'bg-green-100 border border-green-300'
                                  : oIndex === userAnswer && oIndex !== question.correctAnswer
                                  ? 'bg-red-100 border border-red-300'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                    oIndex === userAnswer ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                  }`}>
                                    {oIndex === userAnswer && (
                                      <CheckCircle className="h-3 w-3" />
                                    )}
                                  </div>
                                </div>
                                <span className="ml-2 text-gray-700">{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {!isCorrect && (
                          <div className="text-sm text-red-700 mt-2">
                            <p>
                              <span className="font-semibold">Correct answer:</span> {question.options[question.correctAnswer]}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={resetTest}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Back to Tests
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600 mb-4">{activeTest.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{activeTest.questions.length * 2} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <FileQuestion className="h-4 w-4 mr-1" />
                    <span>{activeTest.questions.length} questions</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {activeTest.questions.map((question, qIndex) => (
                    <div key={question.id} className="border rounded-lg p-4 bg-white">
                      <p className="font-medium text-gray-800 mb-3">
                        {qIndex + 1}. {question.question}
                      </p>
                      
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <button
                            key={oIndex}
                            onClick={() => handleSelectAnswer(question.id, oIndex)}
                            className={`w-full p-3 rounded-md text-left transition-colors duration-150 ${
                              userAnswers[question.id] === oIndex
                                ? 'bg-blue-100 border border-blue-300'
                                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  userAnswers[question.id] === oIndex ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                }`}>
                                  {userAnswers[question.id] === oIndex && (
                                    <CheckCircle className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                              <span className="ml-2 text-gray-700">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSubmitTest}
                    disabled={Object.keys(userAnswers).length < activeTest.questions.length}
                    className={`px-6 py-2 rounded-md ${
                      Object.keys(userAnswers).length < activeTest.questions.length
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (activeInterview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {activeInterview.title}
              </h1>
              
              <button
                onClick={resetInterview}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Back to Interviews
              </button>
            </div>
            
            {interviewSubmitted ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold text-green-800 mb-2">Interview Completed!</h2>
                </div>
                
                <div className="border rounded-lg p-5 bg-blue-50 border-blue-200 mt-6">
                  <h3 className="font-semibold text-blue-800 mb-3">AI Feedback</h3>
                  <p className="text-blue-700">{activeInterview.feedback}</p>
                </div>
                
                <div className="space-y-4 mt-6">
                  <h3 className="font-semibold text-gray-800">Your Responses</h3>
                  
                  {activeInterview.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border rounded-lg p-4 bg-white">
                      <p className="font-medium text-gray-800 mb-2">{qIndex + 1}. {question}</p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700">{interviewAnswers[`q${qIndex}`] || "No response provided"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={resetInterview}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Back to Interviews
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600 mb-4">{activeInterview.description}</p>
                
                <div className="space-y-6">
                  {activeInterview.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border rounded-lg p-4 bg-white">
                      <p className="font-medium text-gray-800 mb-3">{qIndex + 1}. {question}</p>
                      <textarea
                        value={interviewAnswers[`q${qIndex}`] || ''}
                        onChange={(e) => handleInterviewAnswerChange(qIndex, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Type your answer here..."
                      ></textarea>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSubmitInterview}
                    disabled={Object.keys(interviewAnswers).length < activeInterview.questions.length}
                    className={`px-6 py-2 rounded-md ${
                      Object.keys(interviewAnswers).length < activeInterview.questions.length
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Submit Interview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Tests & Interviews
        </h1>
        
        <div className="space-y-8">
          {/* MCQ Tests */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FileQuestion className="h-5 w-5 text-purple-600 mr-2" />
              Multiple Choice Tests
            </h2>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{test.title}</div>
                        <div className="text-xs text-gray-500">{test.questions.length} questions</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDueDate(test.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {test.completed ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {test.completed && test.score !== undefined ? (
                          <span className="font-medium">{test.score}%</span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => startTest(test)}
                          className={`px-3 py-1 rounded-md ${
                            test.completed
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {test.completed ? 'Review' : 'Take Test'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Interviews */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="h-5 w-5 text-amber-600 mr-2" />
              AI Interviews
            </h2>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interview
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interviews.map((interview) => (
                    <tr key={interview.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{interview.title}</div>
                        <div className="text-xs text-gray-500">{interview.questions.length} questions</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDueDate(interview.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {interview.completed ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => startInterview(interview)}
                          className={`px-3 py-1 rounded-md ${
                            interview.completed
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {interview.completed ? 'Review' : 'Start Interview'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsPage;