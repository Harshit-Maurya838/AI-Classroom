import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, CheckCircle } from 'lucide-react';

const AttendanceCamera = ({ onAttendanceMarked }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const webcamRef = useRef(null);
  
  const activateCamera = () => {
    setCameraActive(true);
  };
  
  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    
    if (imageSrc) {
      // In a real app, we would send this image to an AI service for verification
      // For demo purposes, we'll just simulate success
      setAttendanceMarked(true);
      setCameraActive(false);
      onAttendanceMarked();
    }
  };
  
  if (attendanceMarked) {
    return (
      <div className="border rounded-lg p-4 bg-green-50 border-green-200 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={40} className="text-green-500 mx-auto mb-2" />
          <h3 className="font-semibold text-green-800">Attendance Marked</h3>
          <p className="text-green-600 text-sm">You've successfully marked your attendance for today.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold text-gray-800 mb-3">Mark Attendance</h3>
      
      {cameraActive ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 320,
                height: 240,
                facingMode: "user"
              }}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCameraActive(false)}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={captureImage}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
            >
              Capture & Verify
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-3">
            Verify your attendance by taking a snapshot with your webcam.
          </p>
          <button
            onClick={activateCamera}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            <Camera size={18} className="mr-2" />
            Start Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceCamera;
