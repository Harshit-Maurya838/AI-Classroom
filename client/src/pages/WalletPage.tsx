import React, { useEffect, useState } from 'react';
import { usePlan } from '../context/PlanContext';
import { Wallet as WalletIcon, AlertCircle, BadgeCheck, XCircle, ArrowRight, ArrowUpRight } from 'lucide-react';
import ProgressCircle from '../components/ProgressCircle';

const WalletPage: React.FC = () => {
  const { currentPlan, getAttendancePercentage } = usePlan();
  const [refundStatus, setRefundStatus] = useState<'Pending' | 'Eligible' | 'Ineligible' | 'Refunded'>('Pending');
  
  useEffect(() => {
    // Determine refund status based on attendance and plan completion
    const attendancePercentage = getAttendancePercentage();
    
    if (!currentPlan) {
      setRefundStatus('Pending');
      return;
    }
    
    // If course is completed
    const isCompleted = currentPlan.days.every(day => day.completed);
    
    if (isCompleted) {
      if (attendancePercentage >= 75) {
        setRefundStatus('Eligible');
      } else {
        setRefundStatus('Ineligible');
      }
    } else {
      setRefundStatus('Pending');
    }
  }, [currentPlan, getAttendancePercentage]);
  
  if (!currentPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Active Plan</h1>
            <p className="text-gray-600 mb-8">
              You need to create a study plan to use the wallet feature.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const planStartDate = new Date(currentPlan.createdAt);
    const planEndDate = new Date(planStartDate);
    planEndDate.setDate(planEndDate.getDate() + currentPlan.duration);
    
    const today = new Date();
    const diffTime = Math.max(0, planEndDate.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Calculate projected refund based on current attendance
  const calculateProjectedRefund = () => {
    const attendancePercentage = getAttendancePercentage();
    if (attendancePercentage >= 75) {
      return currentPlan.lockedAmount;
    } else {
      return 0;
    }
  };
  
  const getStatusInfo = () => {
    switch (refundStatus) {
      case 'Eligible':
        return {
          icon: <BadgeCheck className="h-12 w-12 text-green-500" />,
          title: 'Eligible for Refund',
          description: 'Congratulations! You\'ve maintained at least 75% attendance. You can now withdraw your locked amount.',
          color: 'text-green-800',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'Ineligible':
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          title: 'Not Eligible for Refund',
          description: 'Your attendance was below the required 75%. The locked amount has been forfeited.',
          color: 'text-red-800',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      case 'Refunded':
        return {
          icon: <BadgeCheck className="h-12 w-12 text-green-500" />,
          title: 'Refund Processed',
          description: 'Your locked amount has been refunded to your account successfully.',
          color: 'text-green-800',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      default:
        return {
          icon: <AlertCircle className="h-12 w-12 text-blue-500" />,
          title: 'Refund Status Pending',
          description: 'Complete your learning plan with at least 75% attendance to receive your refund.',
          color: 'text-blue-800',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  const daysRemaining = calculateDaysRemaining();
  const attendancePercentage = getAttendancePercentage();
  const projectedRefund = calculateProjectedRefund();
  
  const handleWithdraw = () => {
    // In a real app, this would initiate a withdrawal process
    setRefundStatus('Refunded');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <WalletIcon className="h-6 w-6 text-blue-600 mr-2" />
          Your Wallet
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Locked Amount */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Locked Amount</h2>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">₹{currentPlan.lockedAmount}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Amount you've locked for this learning plan
            </p>
          </div>
          
          {/* Attendance */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
            <h2 className="text-sm font-medium text-gray-500 uppercase mb-3 self-start">Current Attendance</h2>
            <ProgressCircle 
              percentage={attendancePercentage} 
              color={attendancePercentage >= 75 ? '#10B981' : '#F59E0B'}
              size={80}
            >
              <div className="text-center">
                <span className="text-xl font-bold">{attendancePercentage}%</span>
              </div>
            </ProgressCircle>
            <p className="mt-3 text-sm text-center">
              {attendancePercentage >= 75 ? (
                <span className="text-green-600">Above required threshold (75%)</span>
              ) : (
                <span className="text-amber-600">{75 - attendancePercentage}% more needed</span>
              )}
            </p>
          </div>
          
          {/* Time Remaining */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Status</h2>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">{daysRemaining}</span>
              <span className="ml-1 text-gray-600">days remaining</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Projected refund: <span className="font-medium">₹{projectedRefund}</span>
            </p>
          </div>
        </div>
        
        {/* Status Card */}
        <div className={`border rounded-lg p-6 mb-8 ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:mr-6 mb-4 md:mb-0">
              {statusInfo.icon}
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${statusInfo.color} mb-2`}>
                {statusInfo.title}
              </h2>
              <p className={`${statusInfo.color.replace('800', '700')}`}>
                {statusInfo.description}
              </p>
              
              {refundStatus === 'Eligible' && (
                <button
                  onClick={handleWithdraw}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Withdraw Funds
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Rules */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Refund Rules</h2>
          
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                1
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Lock-in Period:</span> The amount you've locked is held for the duration of your learning plan ({currentPlan.duration} days).
              </p>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                2
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Attendance Requirement:</span> You must maintain at least 75% attendance throughout the course to be eligible for a refund.
              </p>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                3
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Refund Processing:</span> Once eligible, you can request a withdrawal. Refunds typically process within 3-5 business days.
              </p>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                4
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Forfeiture:</span> If attendance falls below 75%, the locked amount is forfeited and cannot be reclaimed.
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-md p-4">
            <p className="text-sm text-blue-800">
              The locked amount system is designed to increase accountability and commitment to your learning journey. Studies show that having "skin in the game" dramatically improves completion rates and learning outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;