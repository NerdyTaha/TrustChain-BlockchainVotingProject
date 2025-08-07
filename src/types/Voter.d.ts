export interface Voter {
  _id: string;
  epicId: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  dob: Date;
  address: {
    address: string;
    district: string;
    taluka: string;
    state: string;
    country: string;
    pincode: string;
  };
}
