import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Event from '../models/Event.js';
import Product from '../models/Product.js';
import Requirement from '../models/Requirement.js';
import User from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campuscart');
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Requirement.deleteMany();
    await Event.deleteMany();

    console.log('[Seed] Cleared existing Users, Categories, Products, Requirements, and Events.');

    // Seed Categories
    const categories = await Category.insertMany([
      { name: 'Books', slug: 'books', icon: 'BookOpen' },
      { name: 'Electronics', slug: 'electronics', icon: 'Laptop' },
      { name: 'Furniture', slug: 'furniture', icon: 'Armchair' },
      { name: 'Cycles', slug: 'cycles', icon: 'Bike' },
      { name: 'Apparel', slug: 'apparel', icon: 'Shirt' },
      { name: 'Misc', slug: 'misc', icon: 'Package' }
    ]);

    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    // Seed Users
    const student = await User.create({
      name: 'Alex Chen',
      email: 'alex.chen@stanford.edu',
      password: 'password123',
      role: 'student',
      department: 'Computer Science',
      year: 'Senior (Year 4)',
      rollNumber: 'STAN-2024-8841',
      phone: '+1 (650) 843-9210',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isVerified: true,
      avgRating: 4.9
    });

    const admin = await User.create({
      name: 'Faculty Moderator',
      email: 'admin@college.edu',
      password: 'adminpassword123',
      role: 'admin',
      department: 'Administration',
      year: 'Faculty',
      rollNumber: 'ADM-001',
      isVerified: true
    });

    const peer = await User.create({
      name: 'Maya Lin',
      email: 'maya.lin@stanford.edu',
      password: 'password123',
      role: 'student',
      department: 'Electrical Engineering',
      year: 'Junior (Year 3)',
      rollNumber: 'STAN-2024-4412',
      isVerified: true,
      avgRating: 4.8
    });

    // Seed Initial Products
    const products = [
      {
        title: 'TI-84 Plus CE Graphing Calculator',
        description: 'Perfect working condition for Calculus and Physics. Includes USB charging cable and original protective hard case cover.',
        price: 3200,
        originalPrice: 7500,
        category: catMap['Electronics'],
        sellerId: student._id,
        images: ['https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?w=600'],
        condition: 'Like New',
        meetupLocation: 'Tressider Student Union'
      },
      {
        title: 'Ergonomic Desk Chair with Lumbar Support',
        description: 'Fully adjustable mesh back office chair with headrest. Great for long study sessions in dorms. No tears or squeaks.',
        price: 4500,
        originalPrice: 12000,
        category: catMap['Furniture'],
        sellerId: peer._id,
        images: ['https://images.unsplash.com/photo-1580481072645-022f9a6d1209?w=600'],
        condition: 'Good',
        meetupLocation: 'Wilbur Hall Courtyard'
      },
      {
        title: 'Data Structures & Algorithms in Java (4th Ed)',
        description: 'Essential textbook for CS106B. Highlighted in 2 chapters only. Pages are crisp with no dog-ears.',
        price: 850,
        originalPrice: 2400,
        category: catMap['Books'],
        sellerId: student._id,
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
        condition: 'Good',
        meetupLocation: 'Gates Computer Science Bldg'
      },
      {
        title: 'Trek FX 2 Hybrid Campus Bicycle',
        description: '18-speed commuter bike with front/rear lights and heavy duty U-lock included. Serviced last month.',
        price: 8900,
        originalPrice: 22000,
        category: catMap['Cycles'],
        sellerId: peer._id,
        images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600'],
        condition: 'Like New',
        meetupLocation: 'Main Quad Bike Racks'
      },
      {
        title: 'Stanford Hoodie - Unisex Medium',
        description: 'Official bookstore cardinal red hoodie. Worn twice, super warm fleece lining.',
        price: 1200,
        originalPrice: 3500,
        category: catMap['Apparel'],
        sellerId: student._id,
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600'],
        condition: 'Like New',
        meetupLocation: 'Bookstore Plaza'
      }
    ];

    await Product.insertMany(products);

    // Seed Sample Requirements (Wanted Feed)
    await Requirement.insertMany([
      {
        title: 'Looking for Organic Chemistry Lab Coat (Size M) & Splash Goggles',
        description: 'Need for CHEM 31A labs starting next Monday. Preferably clean condition.',
        budget: '₹600',
        category: 'Apparel',
        department: 'Bioengineering',
        urgent: true,
        status: 'active',
        preferredMeetup: 'Central Library Lobby & Steps',
        postedBy: {
          name: 'Sarah Jenkins',
          department: 'Bioengineering',
          year: 'Sophomore (Year 2)',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          verified: true
        }
      },
      {
        title: 'Need Casio fx-991EX Classwiz Calculator for Midterms',
        description: 'Lost my scientific calculator. Willing to buy or borrow for 2 weeks.',
        budget: '₹1,200',
        category: 'Electronics',
        department: 'Mechanical Engineering',
        urgent: true,
        status: 'active',
        preferredMeetup: 'Gates Computer Science Bldg',
        postedBy: {
          name: 'Rohan Sharma',
          department: 'Mechanical Eng.',
          year: 'Junior (Year 3)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verified: true
        }
      },
      {
        title: 'Wanted: Mini Dorm Refrigerator or Compact Cooler',
        description: 'Moving into dorm room. Needs to be in working condition without loud compressor noise.',
        budget: '₹4,000',
        category: 'Furniture',
        department: 'Computer Science',
        urgent: false,
        status: 'active',
        preferredMeetup: 'Wilbur Hall Courtyard',
        postedBy: {
          name: 'David Kim',
          department: 'Computer Science',
          year: 'Senior (Year 4)',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          verified: true
        }
      }
    ]);

    // Seed Campus Events
    await Event.insertMany([
      {
        title: 'Campus Hackathon 2026',
        description: '48-hour annual hackathon featuring AI, Web3, and Hardware tracks. Free food, mentor sessions, and ₹50,000 in prizes.',
        category: 'Hackathon',
        date: 'Oct 18 - 20, 2026',
        time: '09:00 AM - 06:00 PM',
        venue: 'Main Innovation Lab & Central Auditorium',
        entryFee: 0,
        totalSlots: 200,
        registeredCount: 42,
        gearTag: 'Hardware & Microcontrollers in High Demand',
        organizer: 'Engineering Student Council',
        createdBy: admin._id
      },
      {
        title: 'Robotics & AI Expo',
        description: 'State-level robotics project exhibition featuring bot combat, line followers, drone simulations, and embedded IoT demos.',
        category: 'Exhibition',
        date: 'Nov 5, 2026',
        time: '10:00 AM - 04:30 PM',
        venue: 'Engineering Complex Arena - Hall B',
        entryFee: 150,
        totalSlots: 150,
        registeredCount: 68,
        gearTag: 'Sensors, Soldering Kits & Cables Wanted',
        organizer: 'Robotics & Automation Club',
        createdBy: admin._id
      },
      {
        title: 'Annual Inter-College Sports Week',
        description: 'Multi-sport tournament including Cricket, Badminton, Football, Table Tennis, and Volleyball.',
        category: 'Sports',
        date: 'Nov 14 - 18, 2026',
        time: '07:30 AM - 06:00 PM',
        venue: 'University Sports Complex & Track Ground',
        entryFee: 200,
        totalSlots: 300,
        registeredCount: 115,
        gearTag: 'Badminton Rackets, Footballs & Fitness Gear',
        organizer: 'Campus Sports Committee',
        createdBy: admin._id
      }
    ]);

    console.log('✅ Database seeded successfully with Categories, Users, Products, Requirements, and Events!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();

