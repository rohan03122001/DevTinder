/**
 * seed.js
 * Wipes Users & ConnectionRequests, seeds 40 predictable profiles,
 * and creates realistic requests & connections for the primary demo user.
 *
 * Primary demo (shown first in arrays):
 *   Email:    firstname.lastname@gmail.com  (usually alex.lee@gmail.com)
 *   Password: DevTinder@123
 *
 * Usage:
 *   1) npm i mongoose bcrypt validator dotenv
 *   2) echo "MONGODB_URI=mongodb://127.0.0.1:27017/devtinder" > .env
 *   3) node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devtinder';
const PASSWORD = 'DevTinder@123';

// ====== Schemas (match your backend’s shapes) ======
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  photoURL: {
    type: String,
    validate(value) {
      if (value && !validator.isURL(value)) {
        throw new Error('Invalid URL ' + value);
      }
    },
  },
  password: { type: String, required: true },
  emailId: { type: String, required: true, unique: true, validate: validator.isEmail },
  age: { type: Number, min: 18 },
  gender: { type: String, enum: ['male', 'female', 'others'], default: undefined },
  about: String,
  skills: [String],
}, { timestamps: true });

const connectionRequestSchema = new mongoose.Schema({
  fromUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['ignored', 'interested', 'rejected', 'accepted'], required: true },
}, { timestamps: true });

// Ensure we don’t create duplicate request pairs by accident
connectionRequestSchema.index({ fromUserID: 1, toUserID: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

// ====== Curated working-style photos (Unsplash) ======
const PHOTOS = [
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
  'https://images.unsplash.com/photo-1551434678-e076c223a692',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  'https://images.unsplash.com/photo-1529336953121-4f3c7c5a8a2c',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
  'https://images.unsplash.com/photo-1522252234503-e356532cafd5',
  'https://images.unsplash.com/photo-1552581234-26160f608093',
  'https://images.unsplash.com/photo-1517433456452-f9633a875f6f',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61',
];

const FIRST = ['Alex','Sam','Jordan','Taylor','Casey','Riley','Morgan','Avery','Jamie','Quinn','Cameron','Skyler','Parker','Rowan','Reese','Harper','Bailey','Elliot','Hayden','Micah'];
const LAST  = ['Lee','Patel','Kim','Garcia','Singh','Nguyen','Hernandez','Khan','Chen','Ali','Sharma','Martinez','Silva','Nakamura','Santos','Ivanov','Kumar','Diaz','Huang','Sato'];
const ABOUTS = [
  'Full-stack developer who loves ship-fast teams and clean code.',
  'Frontend enthusiast focusing on performance and accessibility.',
  'Backend engineer into databases, queues, and distributed systems.',
  'Mobile + web generalist; React Native and PWAs are my jam.',
  'Open-source contributor, testing nerd, and documentation advocate.',
  'ML tinkerer who also enjoys DevOps and CI/CD pipelines.',
];
const SKILLS = ['React','Next.js','Node','Express','MongoDB','PostgreSQL','GraphQL','TypeScript','Tailwind','Docker','AWS','Python','Django','Go','Rust','Redis','Kafka'];

function pickMany(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

async function seedUsers() {
  // 1) Remove existing data
  await ConnectionRequest.deleteMany({});
  await User.deleteMany({});

  // 2) Hash the shared password
  const hash = await bcrypt.hash(PASSWORD, 10);

  // 3) Build 40 predictable users
  const docs = [];
  for (let i = 0; i < 40; i++) {
    const firstName = FIRST[i % FIRST.length];
    const lastName  = LAST[i % LAST.length];
    const emailId   = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
    const age = 20 + ((i * 3) % 17); // 20..36
    const genders = ['male','female','others', undefined];
    const gender = genders[i % genders.length];
    const about = ABOUTS[i % ABOUTS.length];
    const skills = pickMany(SKILLS, 3 + (i % 3)); // 3–5 skills
    const photoURL = PHOTOS[i % PHOTOS.length] + '?auto=format&fit=crop&w=1000&q=80';

    docs.push({ firstName, lastName, emailId, password: hash, age, gender, about, skills, photoURL });
  }

  // 4) Insert and return inserted docs with _ids
  const inserted = await User.insertMany(docs, { ordered: true });
  return inserted;
}

async function seedRelationships(users) {
  // Primary demo = first user
  const demo = users[0]; // usually Alex Lee
  const others = users.slice(1);

  // Helper to safely create a request doc object
  const reqDoc = (from, to, status) => ({
    fromUserID: from._id,
    toUserID: to._id,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const requests = [];

  // A) Accepted connections (some from others to demo, some from demo to others)
  //    We'll make 8 accepted connections total.
  const acceptedFromOthers = others.slice(0, 4);       // others -> demo (accepted)
  const acceptedFromDemo   = others.slice(4, 8);       // demo -> others (accepted)

  for (const u of acceptedFromOthers) requests.push(reqDoc(u, demo, 'accepted'));
  for (const u of acceptedFromDemo)   requests.push(reqDoc(demo, u, 'accepted'));

  // B) Pending "received" (interested) requests for demo (to review)
  const pendingReceived = others.slice(8, 13);         // others -> demo (interested)
  for (const u of pendingReceived) requests.push(reqDoc(u, demo, 'interested'));

  // C) Pending "sent" (interested) from demo to others
  const pendingSent = others.slice(13, 18);            // demo -> others (interested)
  for (const u of pendingSent) requests.push(reqDoc(demo, u, 'interested'));

  // D) A couple of ignores/rejections for variety (optional)
  const ignored = others.slice(18, 20);                // demo ignored these
  for (const u of ignored) requests.push(reqDoc(demo, u, 'ignored'));

  const rejected = others.slice(20, 22);               // others rejected demo
  for (const u of rejected) requests.push(reqDoc(u, demo, 'rejected'));

  // Insert all requests (unique index will guard dup pairs)
  await ConnectionRequest.insertMany(requests, { ordered: false }).catch(() => { /* ignore dup errors */ });

  return {
    demoEmail: demo.emailId,
    accepted: acceptedFromOthers.length + acceptedFromDemo.length,
    pendingReceived: pendingReceived.length,
    pendingSent: pendingSent.length,
    ignored: ignored.length,
    rejected: rejected.length,
  };
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected:', MONGODB_URI);

  const users = await seedUsers();
  const relStats = await seedRelationships(users);

  console.log('--- Seed summary ---');
  console.log('Users:', users.length);
  console.log('Primary demo:', relStats.demoEmail, `(password: ${PASSWORD})`);
  console.log('Accepted connections:', relStats.accepted);
  console.log('Pending received:', relStats.pendingReceived);
  console.log('Pending sent:', relStats.pendingSent);
  console.log('Ignored:', relStats.ignored, 'Rejected:', relStats.rejected);

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(async (e) => {
  console.error('Seeder failed:', e);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
