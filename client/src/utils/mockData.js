// Mock user data
export const mockUsers = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
  },
];

// Generate a mock study plan
export const generateMockStudyPlan = (
  topic,
  level,
  timePerDay,
  duration,
  lockedAmount,
  userId
) => {
  const days = [];
  const topicAreas = getTopicAreas(topic, level);

  for (let i = 1; i <= duration; i++) {
    const dayTasks = [];

    const lessonTopic = topicAreas[Math.floor((i - 1) * topicAreas.length / duration)];
    dayTasks.push({
      id: `lesson-${i}`,
      type: 'Lesson',
      title: `${lessonTopic} Basics`,
      description: `Learn the fundamentals of ${lessonTopic}`,
      completed: false,
      videoUrl: i % 3 === 0 ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : undefined,
      content: `This lesson covers the key concepts of ${lessonTopic}. You'll learn how to apply these concepts in real-world scenarios.`,
    });

    dayTasks.push({
      id: `mcq-${i}`,
      type: 'MCQ',
      title: `${lessonTopic} Quiz`,
      description: `Test your understanding of ${lessonTopic}`,
      completed: false,
    });

    if (i % 5 === 0) {
      dayTasks.push({
        id: `interview-${i}`,
        type: 'Interview',
        title: 'Progress Interview',
        description: 'AI-powered interview to test your verbal understanding',
        completed: false,
      });
    }

    if (i % 3 === 0 || i === duration) {
      dayTasks.push({
        id: `revision-${i}`,
        type: 'Revision',
        title: 'Topic Revision',
        description: "Revise what you've learned so far",
        completed: false,
      });
    }

    days.push({
      day: i,
      completed: false,
      attendanceMarked: false,
      tasks: dayTasks,
    });
  }

  return {
    id: 'plan-1',
    userId,
    topic,
    level,
    timePerDay,
    duration,
    lockedAmount,
    createdAt: new Date(),
    days,
  };
};

// Generate mock topic areas based on the main topic
function getTopicAreas(topic, level) {
  if (topic.toLowerCase().includes('javascript')) {
    return [
      'Variables and Data Types',
      'Functions and Scope',
      'Objects and Arrays',
      'DOM Manipulation',
      'Asynchronous JavaScript',
      'Error Handling',
      'ES6+ Features',
      'Frameworks Introduction',
    ];
  } else if (topic.toLowerCase().includes('machine learning')) {
    return [
      'Data Preprocessing',
      'Supervised Learning',
      'Unsupervised Learning',
      'Model Evaluation',
      'Neural Networks',
      'Reinforcement Learning',
      'Feature Engineering',
      'Model Deployment',
    ];
  } else {
    return [
      'Fundamental Concepts',
      'Core Principles',
      'Advanced Techniques',
      'Practical Applications',
      'Problem Solving',
      'Real-world Examples',
      'Future Trends',
      'Case Studies',
    ];
  }
}

export const mockWallet = {
  userId: '1',
  lockedAmount: 1000,
  attendancePercentage: 85,
  refundStatus: 'Pending',
};

export const mockTests = [
  {
    id: '1',
    title: 'Week 1 Assessment',
    description: "Test your understanding of the first week's material",
    questions: [
      {
        id: 'q1',
        question: 'What is the primary purpose of this learning platform?',
        options: [
          'Entertainment',
          'Gaming',
          'Personalized learning with accountability',
          'Social networking',
        ],
        correctAnswer: 2,
      },
      {
        id: 'q2',
        question: 'How long is the standard learning plan?',
        options: ['7 days', '14 days', '30 days', '60 days'],
        correctAnswer: 2,
      },
      {
        id: 'q3',
        question: 'What percentage of attendance is required to get a refund?',
        options: ['50%', '65%', '75%', '90%'],
        correctAnswer: 2,
      },
    ],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false,
  },
];

export const mockInterviews = [
  {
    id: '1',
    title: 'Concept Understanding Check',
    description: 'A quick interview to test your verbal understanding of key concepts',
    questions: [
      'Explain the main concept in your own words',
      'How would you apply this in a real-world scenario?',
      'What challenges might you face when implementing this?',
      'How does this concept connect to what you learned previously?',
    ],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    completed: false,
  },
];

export const mockNotes = [
  {
    id: '1',
    title: 'Key Concepts Summary',
    content:
      'This is a summary of the key concepts covered in your lessons. These notes are generated based on your learning material and are designed to help you review and retain information effectively.',
    createdAt: new Date(),
    revisionDates: [
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    ],
  },
];
