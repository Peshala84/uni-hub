// utils/mockApi.js
export const mockAxios = {
  get: async (url) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock API responses
    if (url.includes('view_students')) {
      return {
        data: [
          {
            userId: 1,
            fName: "John",
            lName: "Doe",
            email: "john.doe@university.edu",
            nic: "199512345678",
            address: "123 Main Street, Colombo 07",
            contact: "0771234567",
            dob: "1995-05-15",
            role: "STUDENT",
            studentId: "STU001"
          },
          {
            userId: 2,
            fName: "Jane",
            lName: "Smith",
            email: "jane.smith@university.edu",
            nic: "199612345679",
            address: "456 Oak Avenue, Colombo 05",
            contact: "0771234568",
            dob: "1996-08-20",
            role: "STUDENT",
            studentId: "STU002"
          },
          {
            userId: 3,
            fName: "Alice",
            lName: "Johnson",
            email: "alice.johnson@university.edu",
            nic: "199712345680",
            address: "789 Elm Street, Colombo 03",
            contact: "0771234569",
            dob: "1997-03-12",
            role: "STUDENT",
            studentId: "STU003"
          }
        ]
      };
    } else if (url.includes('view_lecturers')) {
      return {
        data: [
          {
            userId: 4,
            fName: "Dr. Michael",
            lName: "Johnson",
            email: "michael.johnson@university.edu",
            nic: "198012345680",
            address: "789 Pine Street, Colombo 03",
            contact: "0771234569",
            dob: "1980-03-10",
            role: "LECTURER",
            lecturerId: "LEC001"
          },
          {
            userId: 5,
            fName: "Prof. Sarah",
            lName: "Williams",
            email: "sarah.williams@university.edu",
            nic: "197812345681",
            address: "321 Cedar Avenue, Colombo 05",
            contact: "0771234570",
            dob: "1978-07-22",
            role: "LECTURER",
            lecturerId: "LEC002"
          }
        ]
      };
    }
  },
  
  post: async (url, data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock create user response
    if (url.includes('create_user')) {
      console.log('Creating user:', data);
      return { data: { success: true, message: 'User created successfully' } };
    }
    
    return { data: { success: true } };
  }
};