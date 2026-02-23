export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  userId: string;
}

export interface Appointment {
  id: string;
  date: string;
  type: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  userId: string;
  petId: string;
}

export interface DashboardData {
  pets: Pet[];
  appointments: Appointment[];
  stats: {
    totalPets: number;
    totalAppointments: number;
    nextAppointment: string | null;
  };
}
