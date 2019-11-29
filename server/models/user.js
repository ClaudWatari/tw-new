const users = {
  user1: {
    firstName: '',
    lastName: '',
    email: '', 
    password: '', 
    gender: '', 
    jobRole: '', 
    department: '', 
    address: '',
  },
  user2: {
    firstName: 'Claud',
    lastName: 'Watari',
    email: 'claudwatari95@gmail.com', 
    password: 'password', 
    gender: 'male', 
    jobRole: 'Software developer', 
    department: 'Engineering', 
    address: 'Nairobi',
    admin: true,
  },
  user3: {
    firstName: 'Claud',
    lastName: 'Watari',
    email: 'claud@gmail.com', 
    password: 'password', 
    gender: 'male', 
    jobRole: 'Software developer', 
    department: 'Engineering', 
    address: 'Nairobi',
    admin: false,
  },
  user4: {
    email: '', 
    password: '',
  },
  user5: {
    email: 'nonexistent@email.example', 
    password: process.env.adminPassword,
  },
  user6: {
    email: process.env.adminPassword, 
    password: 'randompassword',
  },
};

export default users;