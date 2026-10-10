const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Goal = require('../models/Goal');
const Map = require('../models/Map');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/meridian');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing demo user
    let user = await User.findOne({ email: 'alex@meridian.app' });
    if (!user) {
      user = await User.create({
        name: 'Alex Morgan',
        email: 'alex@meridian.app',
        password: 'password123'
      });
      console.log('Created Demo User: alex@meridian.app / password123');
    }

    // Clear user data
    await Workspace.deleteMany({ user: user._id });
    await Goal.deleteMany({ user: user._id });
    await Map.deleteMany({ user: user._id });

    // Workspaces
    const defaultWs = await Workspace.create({
      user: user._id,
      name: 'Personal Space',
      description: 'Main personal workspace for life & career goals',
      icon: 'User',
      color: '#FBBF24',
      isDefault: true
    });

    const startupWs = await Workspace.create({
      user: user._id,
      name: 'SaaS Product Launch',
      description: 'Planning and execution for Meridian 2.0',
      icon: 'Rocket',
      color: '#22D3EE'
    });

    // Parent Goal 1
    const goal1 = await Goal.create({
      user: user._id,
      workspace: startupWs._id,
      title: 'Launch SaaS Platform v1.0',
      description: 'Build, test and launch our core MVP to early adopters and get first 100 paid users.',
      status: 'In Progress',
      priority: 'High',
      category: 'Work',
      cardColor: '#FBBF24', // Warm Yellow
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      startDate: new Date(),
      progress: 65,
      tags: ['SaaS', 'MVP', 'Launch'],
      tasks: [
        { title: 'Finalize UI Mockups in Figma', completed: true },
        { title: 'Setup Node.js & MongoDB backend schema', completed: true },
        { title: 'Build React Flow interactive map visualizer', completed: true },
        { title: 'Configure Payment Gateway Integration', completed: false },
        { title: 'Perform Beta Testing & Bug Fixes', completed: false }
      ]
    });

    // Sub-goal 1.1
    await Goal.create({
      user: user._id,
      workspace: startupWs._id,
      parentGoal: goal1._id,
      title: 'Design Marketing Landing Page',
      description: 'Convert visitors with clear hero sections, interactive demo cards, and pricing table.',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Work',
      cardColor: '#FB923C', // Coral Orange
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      startDate: new Date(),
      progress: 50,
      tags: ['Marketing', 'Design'],
      tasks: [
        { title: 'Draft value proposition headline', completed: true },
        { title: 'Design high-converting pricing cards', completed: false }
      ]
    });

    // Goal 2
    await Goal.create({
      user: user._id,
      workspace: defaultWs._id,
      title: 'Full Stack Engineering Mastery',
      description: 'Master React 19, TypeScript, Express, microservices architecture, and system design.',
      status: 'In Progress',
      priority: 'High',
      category: 'Career',
      cardColor: '#C084FC', // Soft Purple
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      startDate: new Date(),
      progress: 40,
      tags: ['Skill', 'Engineering', 'Learning'],
      tasks: [
        { title: 'Complete Advanced React Patterns course', completed: true },
        { title: 'Build 3 full stack projects with authentication', completed: true },
        { title: 'Read System Design Interview Book Vol 1 & 2', completed: false }
      ]
    });

    // Goal 3
    await Goal.create({
      user: user._id,
      workspace: defaultWs._id,
      title: 'Marathon Fitness Training',
      description: 'Prepare for the autumn half-marathon by running 4 times a week with structured endurance recovery.',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Health',
      cardColor: '#A3E635', // Lime Green
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      startDate: new Date(),
      progress: 80,
      tags: ['Fitness', 'Running', 'Health'],
      tasks: [
        { title: 'Run 10k baseline time trial', completed: true },
        { title: 'Increase long weekend run to 15km', completed: true },
        { title: 'Hydration and electrolyte protocol', completed: true },
        { title: 'Complete 21km practice run', completed: false }
      ]
    });

    // Goal 4
    await Goal.create({
      user: user._id,
      workspace: defaultWs._id,
      title: 'Read 12 Non-Fiction Books This Year',
      description: 'Read 1 book per month focusing on psychology, product strategy, philosophy, and personal growth.',
      status: 'In Progress',
      priority: 'Low',
      category: 'Personal',
      cardColor: '#86EFAC', // Mint Green
      dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      startDate: new Date(),
      progress: 58,
      tags: ['Reading', 'Habits'],
      tasks: [
        { title: 'Atomic Habits by James Clear', completed: true },
        { title: 'Deep Work by Cal Newport', completed: true },
        { title: 'The Lean Startup by Eric Ries', completed: true },
        { title: 'Thinking, Fast and Slow', completed: false }
      ]
    });

    // Goal 5
    await Goal.create({
      user: user._id,
      workspace: startupWs._id,
      title: 'Seed Funding Investment Pitch',
      description: 'Prepare deck, financial projections model, and pitch to angel investors.',
      status: 'Not Started',
      priority: 'Urgent',
      category: 'Finance',
      cardColor: '#22D3EE', // Sky Cyan
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      startDate: new Date(),
      progress: 10,
      tags: ['Pitch', 'Investor', 'Finance'],
      tasks: [
        { title: 'Draft 10-slide pitch deck', completed: true },
        { title: 'Calculate 3-year cash flow projections', completed: false },
        { title: 'Schedule meetings with 5 angel investors', completed: false }
      ]
    });

    // Work Maps
    await Map.create({
      user: user._id,
      workspace: startupWs._id,
      title: 'Meridian Product Architecture Mind Map',
      description: 'Visual map of frontend components, REST endpoints, and DB models.',
      type: 'mindmap',
      cardColor: '#22D3EE',
      nodes: [
        {
          id: '1',
          type: 'input',
          data: { label: 'Meridian App Engine' },
          position: { x: 250, y: 50 },
          style: { background: '#0F172A', color: '#fff', borderRadius: '12px', padding: '12px 20px', fontWeight: 'bold' }
        },
        {
          id: '2',
          data: { label: 'React + Vite Client' },
          position: { x: 80, y: 180 },
          style: { background: '#FBBF24', color: '#0F172A', borderRadius: '12px', padding: '10px 16px', border: 'none' }
        },
        {
          id: '3',
          data: { label: 'Node.js Express API' },
          position: { x: 420, y: 180 },
          style: { background: '#C084FC', color: '#0F172A', borderRadius: '12px', padding: '10px 16px', border: 'none' }
        },
        {
          id: '4',
          data: { label: 'MongoDB Database' },
          position: { x: 420, y: 300 },
          style: { background: '#86EFAC', color: '#0F172A', borderRadius: '12px', padding: '10px 16px', border: 'none' }
        },
        {
          id: '5',
          data: { label: 'React Flow Canvas' },
          position: { x: 80, y: 300 },
          style: { background: '#22D3EE', color: '#0F172A', borderRadius: '12px', padding: '10px 16px', border: 'none' }
        }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#0F172A', strokeWidth: 2 } },
        { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#0F172A', strokeWidth: 2 } },
        { id: 'e3-4', source: '3', target: '4', style: { stroke: '#0F172A', strokeWidth: 2 } },
        { id: 'e2-5', source: '2', target: '5', style: { stroke: '#0F172A', strokeWidth: 2 } }
      ]
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
