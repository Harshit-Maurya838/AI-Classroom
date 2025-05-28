import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, Calendar, Wallet, CheckCircle, Brain,
  BarChart3, ArrowLeft, ArrowRight, Plus, X
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';

const CreatePlanPage = () => {
  const [step, setStep] = useState(1);
  const [topicLevelPairs, setTopicLevelPairs] = useState([
    { topic: '', level: 'Beginner' }
  ]);
  const [timePerDay, setTimePerDay] = useState(60);
  const [duration, setDuration] = useState(30);
  const [lockedAmount, setLockedAmount] = useState(1000);
  const [isGenerating, setIsGenerating] = useState(false);

  const { createPlan } = usePlan();
  const navigate = useNavigate();

  const handleNext = () => {
    // Don't proceed if any topic is empty
    if (step === 1 && topicLevelPairs.some(pair => !pair.topic)) {
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    setIsGenerating(true);
  
    setTimeout(() => {
      createPlan(
        topicLevelPairs[0].topic, 
        topicLevelPairs[0].level, 
        timePerDay, 
        duration, 
        lockedAmount
      );
      const planData = {
        topic: topicLevelPairs[0].topic,
        level: topicLevelPairs[0].level,
        timePerDay: timePerDay,
        duration: duration,
        lockedAmount: lockedAmount
      };
      const planDataJson = JSON.stringify(planData);
  
      // Send to mock server
      fetch('http://localhost:3001/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: planDataJson
      })
      .then(response => response.json())
      .then(data => {
        setIsGenerating(false);
        navigate('/dashboard');
      })
      .catch(error => {
        setIsGenerating(false);
        // handle error (optional)
        console.error('Error:', error);
      });
    }, 2000);
  };

  // Handle topic change
  const handleTopicChange = (index, value) => {
    const updatedPairs = [...topicLevelPairs];
    updatedPairs[index].topic = value;
    setTopicLevelPairs(updatedPairs);
  };

  // Handle level change
  const handleLevelChange = (index, level) => {
    const updatedPairs = [...topicLevelPairs];
    updatedPairs[index].level = level;
    setTopicLevelPairs(updatedPairs);
  };

  // Add new topic-level pair
  const addTopicLevelPair = () => {
    setTopicLevelPairs([...topicLevelPairs, { topic: '', level: 'Beginner' }]);
  };

  // Remove topic-level pair
  const removeTopicLevelPair = (index) => {
    if (topicLevelPairs.length > 1) {
      const updatedPairs = topicLevelPairs.filter((_, i) => i !== index);
      setTopicLevelPairs(updatedPairs);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-800">Create Your Learning Plan</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  s === step
                    ? 'bg-blue-600 text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s < step ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center mb-2">
                <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">What do you want to learn?</h2>
              </div>
              
              {topicLevelPairs.map((pair, index) => (
                <div key={index} className="space-y-4 border border-gray-200 rounded-md p-4 relative">
                  {topicLevelPairs.length > 1 && (
                    <button 
                      onClick={() => removeTopicLevelPair(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                  
                  <div>
                    <label htmlFor={`topic-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Topic {topicLevelPairs.length > 1 ? index + 1 : ''}
                    </label>
                    <input
                      id={`topic-${index}`}
                      type="text"
                      value={pair.topic}
                      onChange={(e) => handleTopicChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="E.g., JavaScript, Machine Learning, Data Science"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => handleLevelChange(index, l)}
                          className={`py-2 px-4 rounded-md text-sm font-medium ${
                            pair.level === l
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } transition-colors duration-200`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={addTopicLevelPair}
                className="flex items-center justify-center w-full py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add another topic
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">How much time can you commit?</h2>
              </div>
              <div>
                <label htmlFor="timePerDay" className="block text-sm font-medium text-gray-700 mb-1">Time per day (minutes)</label>
                <input
                  id="timePerDay"
                  type="range"
                  min="30"
                  max="180"
                  step="15"
                  value={timePerDay}
                  onChange={(e) => setTimePerDay(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center mt-2 font-medium text-gray-800">
                  {timePerDay} minutes per day
                </div>
              </div>

              <div className="pt-4">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setDuration(Math.max(7, duration - 7))}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    disabled={duration <= 7}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-xl font-semibold text-gray-800">{duration}</span>
                    <span className="text-gray-600 text-sm ml-1">days</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDuration(Math.min(60, duration + 7))}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    disabled={duration >= 60}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[7, 14, 30, 60].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`py-1 px-2 rounded-md text-sm font-medium ${
                        duration === d
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors duration-200`}
                    >
                      {d} days
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center mb-2">
                <Wallet className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Set your accountability amount</h2>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                <p className="text-sm text-blue-800">
                  Lock an amount that you'll get back if you maintain ≥75% attendance throughout the course.
                </p>
              </div>
              <div>
                <label htmlFor="lockedAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount to lock (in ₹)</label>
                <input
                  id="lockedAmount"
                  type="number"
                  min="500"
                  step="500"
                  value={lockedAmount}
                  onChange={(e) => setLockedAmount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[500, 1000, 2000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setLockedAmount(amount)}
                    className={`py-1 px-2 rounded-md text-sm font-medium ${
                      lockedAmount === amount
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-colors duration-200`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
              </div>
              <div className="text-gray-700 space-y-2">
                {/* Topics section */}
                <div className="space-y-2">
                  <strong>Topics:</strong>
                  {topicLevelPairs.map((pair, index) => (
                    <div key={index} className="ml-4 flex items-center justify-between">
                      <span>{pair.topic}</span>
                      <span className="text-sm text-gray-600">({pair.level})</span>
                    </div>
                  ))}
                </div>
                <div><strong>Time per day:</strong> {timePerDay} minutes</div>
                <div><strong>Duration:</strong> {duration} days</div>
                <div><strong>Locked Amount:</strong> ₹{lockedAmount}</div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                {isGenerating ? 'Generating Plan...' : 'Create Plan'}
              </button>
            </div>
          )}
        </div>

        {/* Next Button */}
        {step < 4 && (
          <div className="mt-6 text-right">
            <button
              onClick={handleNext}
              disabled={step === 1 && topicLevelPairs.some(pair => !pair.topic)}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePlanPage;