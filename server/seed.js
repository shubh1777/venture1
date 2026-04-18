const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Opportunity = require('./models/Opportunity');

const opportunities = [
  {
    title: 'Software Engineering Intern',
    company: 'Google',
    type: 'internship',
    description: 'Join Google as a Software Engineering Intern and work on cutting-edge technology projects.',
    location: 'Bangalore, India',
    stipend: '₹80,000/month',
    deadline: new Date('2024-03-15'),
    applyLink: '[careers.google.com](https://careers.google.com)',
    tags: ['React', 'Python', 'Cloud'],
    isPremium: true
  },
  {
    title: 'Frontend Developer Intern',
    company: 'Microsoft',
    type: 'internship',
    description: 'Build amazing user experiences at Microsoft as a Frontend Developer Intern.',
    location: 'Hyderabad, India',
    stipend: '₹60,000/month',
    deadline: new Date('2024-03-20'),
    applyLink: '[careers.microsoft.com](https://careers.microsoft.com)',
    tags: ['JavaScript', 'React', 'TypeScript'],
    isPremium: false
  },
  {
    title: 'Smart India Hackathon 2024',
    company: 'Government of India',
    type: 'hackathon',
    description: 'India\'s biggest hackathon. Solve real-world problems and win exciting prizes.',
    location: 'Pan India',
    deadline: new Date('2024-04-01'),
    applyLink: '[sih.gov.in](https://sih.gov.in)',
    tags: ['Innovation', 'Problem Solving', 'Technology'],
    isPremium: false
  },
  {
    title: 'HackMIT 2024',
    company: 'MIT',
    type: 'hackathon',
    description: 'Join the world\'s premier college hackathon at MIT.',
    location: 'Virtual',
    deadline: new Date('2024-05-15'),
    applyLink: '[hackmit.org](https://hackmit.org)',
    tags: ['AI/ML', 'Web3', 'Innovation'],
    isPremium: true
  },
  {
    title: 'Google Code Jam',
    company: 'Google',
    type: 'competition',
    description: 'Compete in Google\'s longest-running global coding competition.',
    location: 'Online',
    deadline: new Date('2024-04-10'),
    applyLink: '[codingcompetitions.withgoogle.com](https://codingcompetitions.withgoogle.com)',
    tags: ['Algorithms', 'Data Structures', 'Competitive Programming'],
    isPremium: false
  },
  {
    title: 'Data Science Intern',
    company: 'Amazon',
    type: 'internship',
    description: 'Work on ML models that power Amazon\'s recommendation systems.',
    location: 'Bangalore, India',
    stipend: '₹75,000/month',
    deadline: new Date('2024-03-25'),
    applyLink: '[amazon.jobs](https://amazon.jobs)',
    tags: ['Python', 'ML', 'Data Analysis'],
    isPremium: true
  },
  {
    title: 'ICPC World Finals',
    company: 'ICPC Foundation',
    type: 'competition',
    description: 'The most prestigious collegiate programming competition in the world.',
    location: 'Astana, Kazakhstan',
    deadline: new Date('2024-06-01'),
    applyLink: '[icpc.global](https://icpc.global)',
    tags: ['Algorithms', 'Team Competition', 'Problem Solving'],
    isPremium: true
  },
  {
    title: 'Product Design Intern',
    company: 'Flipkart',
    type: 'internship',
    description: 'Design products used by millions of Indians every day.',
    location: 'Bangalore, India',
    stipend: '₹50,000/month',
    deadline: new Date('2024-03-30'),
    applyLink: '[careers.flipkart.com](https://careers.flipkart.com)',
    tags: ['UI/UX', 'Figma', 'User Research'],
    isPremium: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Opportunity.deleteMany({});
    console.log('Cleared existing opportunities');

    await Opportunity.insertMany(opportunities);
    console.log('Seeded opportunities successfully');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
